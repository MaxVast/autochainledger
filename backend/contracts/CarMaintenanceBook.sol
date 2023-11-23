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
    mapping(address => bool) claimedTokens;
    // Mapping from Token ID to address
    mapping(uint256 => address) public balance;
    // Mapping to store distributor
    mapping(address => bool) public distributors;

    // ERC20 Token for the cagnotte
    CarMaintenanceLoyalty public cagnotteToken;

    /// @notice Emitted when the token is claim.
    /// @dev If a token is claimed, this event should be emitted.
    /// @param tokenId The identifier for a token.
    event TokenClaimed(address indexed user, uint256 tokenId);

    event DistributorRegistered(address indexed DistributorAddress);

    modifier onlyDistributor() {
        require(msg.sender == owner() || distributors[msg.sender], "Not a distributor");
        _;
    }

    modifier IsTransferAllowed(uint256 _tokenId) {
        require(!tokenData[_tokenId].locked, "Token is locked");
        _;
    }

    constructor(address _cagnotteToken) ERC721("AutoChain Ledger", "ACL") Ownable(msg.sender) {
        cagnotteToken = CarMaintenanceLoyalty(_cagnotteToken);
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
    function safeMint(address _to, uint256 _tokenId, string calldata _uri) public onlyDistributor {
        require(ownerOf(_tokenId) != address(0), "Token already claimed");
        _safeMint(_to, _tokenId);
        tokenData[_tokenId].uri = _uri;
        tokenData[_tokenId].locked = true;

        cagnotteToken.addCagnotte(_to, 1000);
        emit TokenClaimed(_to, _tokenId);
    }

    /*/// @notice Allow listing all addresses of NFT owners
    function getAllOwners() external view returns (address[] memory) {
        uint256 totalSupply = totalSupply();
        address[] memory owners = new address[](totalSupply);

        for (uint256 i = 0; i < totalSupply; i++) {
            owners[i] = ownerOf(tokenByIndex(i));
        }

        return owners;
    }*/

    /// @notice Returns the locking status of an Soulbound Token
    /// @dev SBTs assigned to zero address are considered invalid, and queries
    /// about them do throw.
    /// @param _tokenId The identifier for an SBT.
    function locked(uint256 _tokenId) external view returns (bool) {
        require(ownerOf(_tokenId) != address(0));
        return tokenData[_tokenId].locked;
    }

    function unlockToken(uint256 _tokenId) public onlyDistributor {
        require(ownerOf(_tokenId) != address(0), "Token not exists");
        tokenData[_tokenId].locked = false;
        emit Unlocked(_tokenId);
    }

    function reclaimToken(address _from, uint256 _tokenId) external onlyDistributor {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        require(ownerOf(_tokenId) == _from, "Token does not belong to the specified address");
        _transfer(_from, msg.sender, _tokenId);
        tokenData[_tokenId].locked = false;
    }

    function transferTokenNew(address _from, address _to, uint256 _tokenId) external onlyDistributor {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        require(ownerOf(_tokenId) == _from, "Token does not belong to the specified address");
        _transfer(_from, _to, _tokenId);
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        return tokenData[_tokenId].uri;
    }

    function generateTokenId(string calldata _vin) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_vin)));
    }

    function addMaintenance(string calldata _maintenance, string calldata _vin) external onlyDistributor {
        uint256 _idToken = generateTokenId(_vin);
        require(ownerOf(_idToken) != address(0), "Token does not exist");
        Maintenances[_idToken].push(Maintenance(_maintenance, block.timestamp));
        // Credit 100 tokens to the cagnotte for each maintenance
        cagnotteToken.addCagnotte(ownerOf(_idToken), 100);
    }

    function getMaintenanceHistory(string calldata _vin) external view returns (Maintenance[] memory) {
        uint256 _idToken = generateTokenId(_vin);
        require(ownerOf(_idToken) != address(0), "Token does not exist");
        return Maintenances[_idToken];
    }

    function getLengthMaintenanceHistory(string calldata _vin) external view returns (uint) {
        uint256 _idToken = generateTokenId(_vin);
        require(ownerOf(_idToken) != address(0), "Token does not exist");
        return Maintenances[_idToken].length;
    }

    function gethMaintenanceHistoryById(string calldata _vin, uint _idMaintenance) external view returns (Maintenance memory) {
        uint256 _idToken = generateTokenId(_vin);
        require(ownerOf(_idToken) != address(0), "Token does not exist");
        return Maintenances[_idToken][_idMaintenance];
    }

    //Override function ERC721
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721) IsTransferAllowed(tokenId) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721) IsTransferAllowed(tokenId) {
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
