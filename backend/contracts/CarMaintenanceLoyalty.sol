// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title CarMaintenanceLoyalty - A contract for a Token loyalty program for vehicle maintenance
/// @author MaxVast
/// @dev Implementation of OpenZeppelin's Ownable, ERC20
/// @notice The CarMaintenanceLoyalty contract manages a token-based loyalty program for vehicle maintenance.
/// Users can accumulate loyalty tokens, and administrators have the ability to credit and deliver tokens to user accounts.
contract CarMaintenanceLoyalty is ERC20, Ownable {
    /// @notice Mapping to track the total tokens for each account.
    mapping(address => uint256) public totalTokens;

    /// @notice Mapping to track the administrators.
    mapping(address => bool) admins;

    /// @notice Event emitted when an administrator is added.
    /// @param _admin The address of the added administrator.
    event AdminAdded(address indexed _admin);

    /// @notice Event emitted when an administrator is removed.
    /// @param _admin The address of the removed administrator.
    event AdminRemoved(address indexed _admin);

    /// @notice Event emitted when a prize pool is credited to an account.
    /// @param _account The address of the account receiving the credited tokens.
    /// @param _amount The amount of tokens credited to the account.
    event CreditedPrizePool(address indexed _account, uint256 _amount);

    /// @notice Event emitted when a prize pool is delivered to an account.
    /// @param _account The address of the account receiving the delivered tokens.
    event PrizePoolDelivered(address indexed _account);

    /// @notice Modifier to restrict access to only administrators.
    /// @dev Throws an error if the message sender is not an administrator.
    modifier onlyAdmins() {
        require(admins[msg.sender], "You are not a admins");
        _;
    }

    /// @dev Constructor to initialize the ERC20 token with a name and symbol
    constructor() ERC20("AutoChain Ledger Token", "ACLT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @notice Adds an administrator with the specified address
    /// @dev Only the owner can add administrators
    /// @param _admin The address of the administrator to be added
    function addAdmins(address _admin) external onlyOwner {
        require(!admins[_admin], "Admin already registered");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    /// @notice Removes an administrator with the specified address
    /// @dev Only the owner can remove administrators
    /// @param _admin The address of the administrator to be removed
    function removeAdmins(address _admin) external onlyOwner {
        require(admins[_admin], "Admin already removed");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    /// @notice Adds tokens to the prize pool of the specified account
    /// @dev Only administrators can add tokens to the prize pool
    /// @param _account The address of the account to which tokens are added
    /// @param _amount The amount of tokens to be added
    function addCagnotte(address _account, uint256 _amount) external onlyAdmins {
        totalTokens[_account] += _amount;
        emit CreditedPrizePool(_account, _amount);
    }

    /// @notice Mints tokens to the specified account
    /// @dev Only administrators can mint tokens, and the account must have a positive balance
    /// @param _account The address of the account to which tokens are minted
    function mint(address _account) external onlyAdmins {
        require(totalTokens[_account] > 0, "Account balance is insufficient for minting");
        uint256 totalCagnotte = totalTokens[_account];
        totalTokens[_account] = 0;
        _mint(_account, totalCagnotte);
        emit PrizePoolDelivered(_account);
    }
}
