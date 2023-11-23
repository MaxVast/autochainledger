// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ERC20 Token contract
contract CarMaintenanceLoyalty is ERC20, Ownable {
    using SafeERC20 for IERC20;

    mapping(address => uint256) totalTokens;
    mapping(address => bool) admins;

    // Modifier to restrict access to only registered voters
    modifier onlyAdmins() {
        require(admins[msg.sender], "You are not a admins");
        _;
    }
    
    constructor() ERC20("AutoChain Ledger Token", "ACLT") Ownable(msg.sender) {}

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

    function safeTransfer(address to, uint256 value) public {
        IERC20(address(this)).safeTransfer(to, value);
    }

    function safeTransferFrom(address from, address to, uint256 value) public {
        IERC20(address(this)).safeTransferFrom(from, to, value);
    }

    function safeIncreaseAllowance(address spender, uint256 value) public {
        IERC20(address(this)).safeIncreaseAllowance(spender, value);
    }

    function safeDecreaseAllowance(address spender, uint256 requestedDecrease) public {
        IERC20(address(this)).safeDecreaseAllowance(spender, requestedDecrease);
    }

    function forceApprove(address spender, uint256 value) public {
        IERC20(address(this)).forceApprove(spender, value);
    }
}
