pragma solidity ^0.8.14;

interface IStrategy {
    function invest(uint256) external payable;

    function divest(uint256) external payable;
}
