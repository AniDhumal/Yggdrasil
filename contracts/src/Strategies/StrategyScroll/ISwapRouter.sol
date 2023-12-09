//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.14;

interface ISwapRouter {
    struct SwapStep {
        address pool; // The pool of the step.
        bytes data; // The data to execute swap with the pool.
        address callback;
        bytes callbackData;
    }
    struct SwapPath {
        SwapStep[] steps; // Steps of the path.
        address tokenIn; // The input token of the path.
        uint amountIn; // The input token amount of the path.
    }

    // Performs a swap.
    function swap(
        SwapPath[] memory paths,
        uint amountOutMin,
        uint deadline
    ) external payable returns (uint amountOut);
}
