//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "../../interfaces/IStrategy.sol";
import {IYearn} from "./IYearn.sol";

contract Strategy2 is IStrategy {
    address public strategist;
    uint256 immutable fee = 1000; // In basis points
    address yearnStrategy;
    address offchain;

    constructor(address _yearnStrategy, address _offchain) {
        yearnStrategy = _yearnStrategy;
        offchain = _offchain;
    }

    modifier onlyOffchain() {
        require(msg.sender == offchain);
        _;
    }

    //swaps with fusion offchain to weth and stakes that with yearn
    function invest(address user, uint amount) external payable {
        //emit event to be picked up by the fusion api
        emit Invest(user, amount);
    }

    function digestFromOffchain(
        address user,
        uint amount5
    ) external onlyOffchain {
        //stake the amount with yearn
        IYearn(yearnStrategy).deposit(amount5);
    }

    function divest(address user, uint amount) external payable {
        //call withdraw function from yearn
        //if call successful, emit event to be picked by the offchain, swapped to original
        //market using fusion and returned to the user.
    }

    function getRoyalty() external pure returns (uint256) {
        return fee;
    }
}
