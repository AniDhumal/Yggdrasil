//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "../../interfaces/IStrategy.sol";
import "../../interfaces/IWETH.sol";
import "../../interfaces/IERC20.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";

contract StrategyMantle is IStrategy {
    address public strategist;
    uint256 public constant fee = 1000; // In basis points
    address public immutable WETH;
    address public immutable vault_address;


// Deploy on Linea
// WETH = "0x2C1b868d6596a18e32E61B901E4060C872647b6C";

    constructor(
        address _WETH,
        address _strategist,
        address _vault_address
    ) {
        WETH = _WETH;
        strategist = _strategist;
        vault_address = _vault_address;
    }

    function invest(address user, uint amt) external payable {
        IERC20(WETH).transferFrom(msg.sender, address(this), amt);

        uint256 strategist_fee = (amt * fee) / 10000;
        uint256 amount = amt - strategist_fee;

        IERC20(WETH).approve(vault_address, amount);

        emit FeeDeduction(user, strategist, strategist_fee);

        IERC4626(vault_address).deposit(amount, user);

        IERC20(WETH).transfer(strategist, strategist_fee);

        emit Invest(user, amount);
    }

    // Primary Function
    function divest(address user, uint256 amount) external payable {
        //should be callable only by the strategy manager
        IERC20(vault_address).transferFrom(msg.sender, address(this), amount);
        
        uint256 redeemedTokens = IERC4626(vault_address).redeem(amount, user, address(this));

        uint256 strategist_fee = (redeemedTokens * fee) / 10000;
        
        IERC20(WETH).transfer(user, redeemedTokens - strategist_fee);

        emit FeeDeduction(user, strategist, strategist_fee);

        IERC20(WETH).transfer(strategist, strategist_fee);
        emit Divest(user, amount, redeemedTokens - strategist_fee);
    }

    // Test function : not to be used in prod
    function divest(address user, uint256 amount, uint256 _strategy) external payable {
        require(_strategy == 0, "Invalid Strategy");

        uint256 strategist_fee = (amount * fee) / 10000;
        IERC20(WETH).transfer(user, amount - strategist_fee);

        emit FeeDeduction(user, strategist, strategist_fee);
    }

    function getRoyalty() external pure returns (uint256) {
        return 1000;
    }

    receive() external payable {
        // Do nothing
    }
}
