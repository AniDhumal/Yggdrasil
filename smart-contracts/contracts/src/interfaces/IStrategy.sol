//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.14;

interface IStrategy {
    event Invest(address indexed user, uint256 amount);
    event Divest(
        address user,
        uint256 invested_amount,
        uint256 received_amount
    );
    event FeeDeduction(address user, address strategist, uint256 fee_amount);

    function invest(address, uint) external payable;

    function divest(address, uint) external payable;

    function getRoyalty() external view returns (uint256);
}
