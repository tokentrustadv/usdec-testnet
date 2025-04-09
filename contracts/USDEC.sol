// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20Extended is IERC20 {
    function decimals() external view returns (uint8);
}

// Mock Morpho Vault interface (testnet only)
interface IMorphoVault {
    function deposit(uint256 amount, address onBehalfOf) external;
    function withdraw(uint256 amount, address to) external;
    function balanceOf(address user) external view returns (uint256);
}

contract USDEC is ERC20, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    IMorphoVault public immutable morphoVault;
    uint256 public constant MAX_STAKE_PER_TX = 500_000_000; // 500 USDC with 6 decimals

    constructor(address _usdc, address _morphoVault) ERC20("USDEC", "USDEC") Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        morphoVault = IMorphoVault(_morphoVault);
    }

    function mint(uint256 amount) external onlyOwner {
        require(amount <= MAX_STAKE_PER_TX, "Max stake per transaction is 500 USDC");
        require(usdc.balanceOf(msg.sender) >= amount, "Not enough USDC");

        usdc.safeTransferFrom(msg.sender, address(this), amount);
        usdc.safeApprove(address(morphoVault), amount);
        morphoVault.deposit(amount, address(this));

        _mint(msg.sender, amount);
    }

    function redeem(uint256 amount) external onlyOwner {
        require(balanceOf(msg.sender) >= amount, "Not enough USDEC");

        _burn(msg.sender, amount);
        morphoVault.withdraw(amount, address(this));
        usdc.safeTransfer(msg.sender, amount);
    }

    function backingReserves() external view returns (uint256) {
        return morphoVault.balanceOf(address(this));
    }
}
