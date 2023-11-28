// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarMaintenanceLoyalty.sol";
import "./IERC5192.sol";

/// @title A contract for a pass maintenance vehicle
/// @author MaxVast
/// @dev Implementation Openzeppelin Ownable, ERC721 and Interface IERC5192
contract CarMaintenanceBook is ERC721, Ownable, IERC5192 {
    //Struct to store information NFT
    struct TokenData {
        string uri;
        bool locked;
    }

    //Struct to store information Maintenance
    struct Maintenance {
        string maintenance;
        uint256 dateMaintenance;
    }

    // Mapping from Token ID to Maintenance
    mapping(uint256 => Maintenance[]) Maintenances;
    // Mapping from Token ID to tokenData
    mapping(uint256 => TokenData) private tokenData;
    // Mapping from address to claim token
    mapping(uint256 => bool) claimedTokens;
    // Mapping from Token ID to address
    mapping(uint256 => address) public balance;
    // Mapping to store distributor
    mapping(address => bool) public distributors;

    // ERC20 Token for the cagnotte
    CarMaintenanceLoyalty public cagnotteToken;

    /// @notice Emitted when the token is claim.
    /// @dev If a token is claimed, this event should be emitted.
    /// @param idToken The identifier for a token.
    event TokenClaimed(address indexed user, uint256 idToken);

    event DistributorRegistered(address indexed DistributorAddress);

    modifier onlyDistributor() {
        require(distributors[msg.sender], "Not a distributor");
        _;
    }

    modifier IsTransferAllowed(uint256 _tokenId) {
        require(!tokenData[_tokenId].locked, "Token is locked");
        _;
    }

    modifier tokenIsExists(uint256 _idToken) {
        require(claimedTokens[_idToken], "Token not exists");
        _;
    }

    constructor(address _cagnotteToken) ERC721("AutoChain Ledger", "ACL") Ownable(msg.sender) {
        cagnotteToken = CarMaintenanceLoyalty(_cagnotteToken);
        distributors[msg.sender] = true;
    }

    function setDistributor(address _distributor) external onlyOwner {
        require(!distributors[_distributor], "Distributor is already registered");
        distributors[_distributor] = true;
        emit DistributorRegistered(_distributor);
    }

     // Function to set the ERC20 cagnotte token
    function setCagnotteToken(address _cagnotteToken) external onlyOwner {
        cagnotteToken = CarMaintenanceLoyalty(_cagnotteToken);
    }

    /// @notice Allows you to claim an SBT and send it to the address
    function safeMint(address _to, uint256 _idToken, string calldata _uri) public onlyDistributor {
        require(!claimedTokens[_idToken], "Token already claimed");
        tokenData[_idToken].uri = _uri;
        tokenData[_idToken].locked = true;
        _safeMint(_to, _idToken);
        // Marks token as claimed
        claimedTokens[_idToken] = true;
        
        cagnotteToken.addCagnotte(_to, 1000);
        emit TokenClaimed(_to, _idToken);
    }

    /// @notice Returns the locking status of an Soulbound Token
    /// @dev SBTs assigned to zero address are considered invalid, and queries
    /// about them do throw.
    /// @param _idToken The identifier for an SBT.
    function locked(uint256 _idToken) external view tokenIsExists(_idToken) returns  (bool)  {
        return tokenData[_idToken].locked;
    }

    function unlockToken(uint256 _idToken) public onlyDistributor tokenIsExists(_idToken) {
        tokenData[_idToken].locked = false;
        emit Unlocked(_idToken);
    }

    function reclaimToken(address _from, uint256 _idToken) external onlyDistributor tokenIsExists(_idToken) {
        require(ownerOf(_idToken) == _from, "Token does not belong to the specified address");
        _transfer(_from, msg.sender, _idToken);
        tokenData[_idToken].locked = false;
    }

    function transferTokenNew(address _from, address _to, uint256 _idToken) external onlyDistributor tokenIsExists(_idToken) {
        require(ownerOf(_idToken) == _from, "Token does not belong to the specified address");
        _transfer(_from, _to, _idToken);
    }

    function getTokenURI(uint256 _idToken) public view tokenIsExists(_idToken) returns (string memory) {
        return tokenData[_idToken].uri;
    }

    function generateTokenId(string calldata _vin) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_vin)));
    }

    function addMaintenance(uint256 _idToken, string calldata _maintenance) external onlyDistributor tokenIsExists(_idToken) {
        Maintenances[_idToken].push(Maintenance(_maintenance, block.timestamp));
        // Credit 100 tokens to the cagnotte for each maintenance
        cagnotteToken.addCagnotte(ownerOf(_idToken), 100);
    }

    function getMaintenanceHistory(uint256 _idToken) external view tokenIsExists(_idToken) returns (Maintenance[] memory) {
        return Maintenances[_idToken];
    }

    function getLengthMaintenanceHistory(uint256 _idToken) external view tokenIsExists(_idToken) returns (uint) {
        return Maintenances[_idToken].length;
    }

    function gethMaintenanceHistoryById(uint256 _idToken, uint _idMaintenance) external view tokenIsExists(_idToken) returns (Maintenance memory) {
        return Maintenances[_idToken][_idMaintenance];
    }

    //Override function ERC721
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721) IsTransferAllowed(tokenId) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721) IsTransferAllowed(tokenId) {
        super.safeTransferFrom(from, to, tokenId, _data);
    }
}
