// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ERC20 Token contract
contract CarMaintenanceLoyalty is ERC20, Ownable {
    mapping(address => uint256) totalTokens;
    mapping(address => bool) admins;

    string _name;
    string _symbol;
    uint256 _totalSupply;
    uint8 _decimals;

    // Modifier to restrict access to only registered voters
    modifier onlyAdmins() {
        require(admins[msg.sender], "You are not a admins");
        _;
    }
    
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(msg.sender) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    function addCagnotte(address _account, uint256 _amount) external onlyAdmins {
        totalTokens[_account] += _amount;
    }

    function mint(address _account) external onlyAdmins {
        _mint(_account, totalTokens[_account]);
    }

    function balanceOf(address _account) public view override returns (uint256) {
        return totalTokens[_account];
    }
}