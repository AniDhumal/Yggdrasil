//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.14;

interface IStrategy {
    function invest(address, uint256) external payable;
    function devest(address, uint256) external;
    function getRoyalty() external view returns(uint256);
}
