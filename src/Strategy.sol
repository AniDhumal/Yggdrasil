//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "./interfaces/IStrategy.sol";
import './interfaces/IWETH.sol';
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/IERC20.sol";

contract Strategy is IStrategy {
    address public strategist;
    uint256 immutable fee = 1000; // In basis points
    address public immutable WETH;
    address public immutable WBTC;
    address public immutable UniswapV2Router;
    address public immutable AaveLendingPool;

    constructor(address _WETH, address _WBTC,address _UniswapRouter, address _AaveLendingPool) {
        WETH = _WETH;
        WBTC = _WBTC;
        UniswapV2Router = _UniswapRouter;
        AaveLendingPool = _AaveLendingPool;
    }

    function invest(address user) external payable override {
        uint256 strategist_fee = (msg.value * fee) / 10000;
        uint256 amount = msg.value - strategist_fee;
        emit FeeDeduction(user, strategist, strategist_fee);

        address[] memory path;
        path[0] = WETH;
        path[1] = WBTC;
        uint256[] memory amounts = IUniswapV2Router(UniswapV2Router).swapExactETHForTokens{value: amount}(
            0, path, address(this), block.timestamp + 2400
        );

        //Approve Aave lending pool to use WBTC
        IERC20(WBTC).approve(AaveLendingPool, amounts[1]);

        // Strategy definition -: Convert ETH to WETH , Swap to BTC and supply to AAVE
        ILendingPool(AaveLendingPool).deposit(WBTC, amounts[1], user, 0);
        //update a state var which keeps record of the funds invested by the user with the particular strategy

        emit Invest(user, amounts[1]);
    }

    function devest(address user, uint256 amount) external payable {
        uint256 wbtc_received = ILendingPool(AaveLendingPool).withdraw(WBTC, amount, address(this));

        //Approve Aave lending pool to use WBTC
        IERC20(WBTC).approve(UniswapV2Router, wbtc_received);

        address[] memory path;
        path[0] = WBTC;
        path[1] = WETH;

        uint256[] memory amounts = IUniswapV2Router(UniswapV2Router).swapExactTokensForETH(
            wbtc_received, 0, path, address(this), block.timestamp + 2400
        );

        uint256 strategist_fee = (amounts[1] * fee) / 10000;
        payable(user).transfer(amounts[1] - strategist_fee);

        emit FeeDeduction(user, strategist, strategist_fee);
        emit Devest(user, amount, amounts[1] - strategist_fee);
    }

    function getRoyalty(
    ) external pure returns (uint256) {
        return 1000;
    }

    receive() external payable {
        // Do nothing
    }
}
