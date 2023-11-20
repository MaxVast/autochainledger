// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Import dependencies
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./CarMaintenanceLoyalty.sol";

// @title A contract for a pass maintenance vehicle
// @author MaxVast
// @dev Implementation Openzeppelin Ownable, ERC721, ERC721Enumerable
contract CarMaintenanceBook is ERC721, Ownable {
    // Mapping from address to claim token
    mapping(address => bool) claimedTokens;
    // Mapping from Token ID to address
    mapping(uint256 => address) public balance;
    // Mapping to store distributor
    mapping(address => bool) public distributors;

    struct Maintenance {
        string maintenance;
        uint256 dateMaintenance;
    }

    mapping(uint256 => Maintenance[]) Maintenances;

    // ERC20 Token for the cagnotte
    CarMaintenanceLoyalty public cagnotteToken;

    event TokenClaimed(address indexed user, uint256 tokenId);
    
    // Modifier to restrict access to only registered voters
    modifier onlyDistributors() {
        require(distributors[msg.sender], "You are not a distributor");
        _;
    }

    // Constructor to initialize the contract and the Workflow Status
    constructor(address _cagnotteToken) ERC721("Pass Maintenance Auto", "pass-auto") Ownable(msg.sender) {
        distributors[msg.sender] = true;
        cagnotteToken = CarMaintenanceLoyalty(_cagnotteToken);
    }

    // Function to register a distributor
    function registerDistributor(address _distributor) external onlyOwner {
        require(!distributors[_distributor], "Distributor is already registered");
        distributors[_distributor] = true;
    }

    // Function to set the ERC20 cagnotte token
    function setCagnotteToken(address _cagnotteToken) external onlyOwner {
        cagnotteToken = CarMaintenanceLoyalty(_cagnotteToken);
    }

    /// @notice Allows you to claim an SBT and send it to the address
    function claimToken(string calldata _vin, address _to) external onlyDistributors {
        //require(!_exists(generateTokenId(_vin)), "Token does not exist");
        require(!claimedTokens[_to], "Token already claimed");

        // Marks token as claimed
        claimedTokens[_to] = true;

        // Generate token internal
        uint256 tokenId = generateTokenId(_vin);
        _safeMint(_to, tokenId);
        
        // Marks token Id requested from wallet
        balance[tokenId] = _to;

        // Credit 1000 tokens to the cagnotte
        cagnotteToken.addCagnotte(_to, 1000);

        // Emits an event to notify the token claim
        emit TokenClaimed(_to, tokenId);
    }

    /// @notice Allows you to revoke a wallet's the NFT Pass Vehicle 
    function recoverTokens(address from, uint256 _tokenId) external onlyDistributors {
        require(balance[_tokenId] == from, "The wallet doesn't hold this token");
        // Burn the NFT
        _burn(_tokenId);
    }

    function generateTokenId(string calldata _vin) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_vin)));
    }

    function addMaintenance(string calldata _maintenance, string calldata _vin) external onlyDistributors {
        uint256 _idToken = generateTokenId(_vin);
        //require(_exists(_idToken), "Token does not exist");
        Maintenances[_idToken].push(Maintenance(_maintenance, block.timestamp));
        // Credit 100 tokens to the cagnotte for each maintenance
        cagnotteToken.addCagnotte(ownerOf(_idToken), 100);
    }

    function getMaintenanceHistory(string calldata _vin) external view returns (Maintenance[] memory) {
        uint256 _idToken = generateTokenId(_vin);
        //require(_exists(_idToken), "Token does not exist");
        return Maintenances[_idToken];
    }

    function getLengthMaintenanceHistory(string calldata _vin) external view returns (uint) {
        uint256 _idToken = generateTokenId(_vin);
        //require(_exists(_idToken), "Token does not exist");
        return Maintenances[_idToken].length;
    }

    function gethMaintenanceHistoryById(string calldata _vin, uint _idMaintenance) external view returns (Maintenance memory) {
        uint256 _idToken = generateTokenId(_vin);
        //require(_exists(_idToken), "Token does not exist");
        return Maintenances[_idToken][_idMaintenance];
    }
}
