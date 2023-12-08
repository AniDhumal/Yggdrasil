//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "./interfaces/IStrategy.sol";
import './interfaces/IWETH.sol';


contract Strategy is IStrategy {
    address public strategist;
    uint256 immutable fee = 1000; // In basis points
    address public immutable WETH;
    address public immutable UniswapV2Router;

    constructor(uint256 _fee, address _WETH, _UniswapRouter) {
        fee = _fee;
        WETH = _WETH;
        UniswapV2Router = _UniswapRouter;
    }

    function invest(uint256 amount, address user, ) external payable {
        IUniswapV2Router.swap
        // Strategy definition -: Convert ETH to WETH , Swap to BTC and supply to AAVE



        //update a state var which keeps record of the funds invested by the user with the particular strategy
    }

    function getFee(
    ) external pure returns (uint256) {
        return 1000;
    }

    receive() external payable {
        // Do nothing
    }
}
