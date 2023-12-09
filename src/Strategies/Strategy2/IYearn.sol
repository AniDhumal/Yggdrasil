pragma solidity ^0.8.0;

interface IYearn {
    function deposit(uint amount, address recipient) external payable;

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external;

    function withdraw(uint amount) external payable;
}
