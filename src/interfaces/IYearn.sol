pragma solidity ^0.8.0;

interface IYearn {
    function deposit(uint amount) external payable;

    function withdraw(uint amount) external payable;
}
