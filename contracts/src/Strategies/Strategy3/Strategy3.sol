//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "../../interfaces/IStrategy.sol";
import "../../interfaces/IWETH.sol";
import "../../interfaces/IERC20.sol";
import "./ISwapRouter.sol";
import "./IPool.sol";

contract Strategy3 is IStrategy {
    address public strategist;
    address public immutable strategyManager;
    uint256 public constant fee = 1000; // In basis points
    address public immutable WETH;
    address public immutable WBTC;
    address public immutable UniswapV3Router;
    address public immutable AaveLendingPoolv3;
    address public immutable aBTC;

    // Deploy on Arbitrum
    // WETH = "0x4284186b053ACdBA28E8B26E99475d891533086a";
    // UniswapRouterV3 = ""0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"
    // WBTC = "0x1377b75237a9ee83aC0C76dE258E68e875d96334"
    // AaveLendingPoolV3 = "0x8d284fE251BB7Fe6B529FC2f27BAb415FcF46B25"

    constructor(
        address _WETH,
        address _WBTC,
        address _UniswapRouterV3,
        address _AaveLendingPoolv3,
        address _strategyManager,
        address _aBTC
    ) {
        WETH = _WETH;
        WBTC = _WBTC;
        UniswapV3Router = _UniswapRouterV3;
        AaveLendingPoolv3 = _AaveLendingPoolv3;
        strategyManager = _strategyManager;
        aBTC = _aBTC;
    }

    function invest(address user, uint amt) external payable {
        //param here is amount
        //should be callable only by the strategy manager
        require(msg.sender == strategyManager);
        require(amt == 0);
        IWETH(WETH).deposit{value: msg.value}();

        uint256 strategist_fee = (msg.value * fee) / 10000;
        uint256 amount = msg.value - strategist_fee;
        emit FeeDeduction(user, strategist, strategist_fee);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: WBTC,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint256 amountOut = ISwapRouter(UniswapV3Router).exactInputSingle(
            params
        );

        IERC20(WBTC).approve(AaveLendingPoolv3, amountOut);
        IPool(AaveLendingPoolv3).supply(WBTC, amountOut, user, 0);

        //update a state var which keeps record of the funds invested by the user with the particular strategy

        emit Invest(user, amountOut);
    }

    function divest(address user, uint256 amount) external payable {
        //should be callable only by the strategy manager
        IERC20(aBTC).transferFrom(msg.sender, address(this), amount);
        require(msg.sender == strategyManager);

        uint256 wbtc_received = IPool(AaveLendingPoolv3).withdraw(
            WBTC,
            amount,
            address(this)
        );

        //Approve Aave lending pool to use WBTC
        IERC20(WBTC).approve(UniswapV3Router, wbtc_received);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WBTC,
                tokenOut: WETH,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = ISwapRouter(UniswapV3Router).exactInputSingle(
            params
        );

        uint256 strategist_fee = (amountOut * fee) / 10000;
        payable(user).transfer(amountOut - strategist_fee);

        emit FeeDeduction(user, strategist, strategist_fee);
        emit Divest(user, amount, amountOut - strategist_fee);
    }

    function getRoyalty() external pure returns (uint256) {
        return 1000;
    }

    receive() external payable {
        // Do nothing
    }
}
