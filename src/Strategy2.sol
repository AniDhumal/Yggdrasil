//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "./interfaces/IStrategy.sol";
import {IYearn} from "./interfaces/IYearn.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract Strategy2 is IStrategy {
    address public strategist;
    uint256 immutable fee = 1000; // In basis points
    address yearnStrategy;
    address offchain;
    address baseMarket;

    constructor(address _yearnStrategy, address _offchain) {
        yearnStrategy = _yearnStrategy;
        offchain = _offchain;
    }

    event OffchainDivest(address user, uint amount);
    modifier onlyOffchain() {
        require(msg.sender == offchain);
        _;
    }

    //swaps with fusion offchain to weth and stakes that with yearn
    function invest(address user, uint amount) external payable {
        //emit event to be picked up by the fusion api
        emit Invest(user, amount);
    }

    function digestFromOffchainInvest(
        address user,
        uint amount
    ) external onlyOffchain {
        //stake the amount with yearn
        IYearn(yearnStrategy).deposit(amount, user);
    }

    function divest(address user, uint amount) external payable {
        //call withdraw function from yearn
        //if call successful, emit event to be picked by the offchain, swapped to original
        //market using fusion and returned to the user.
        //user needs to approve vault tokens to divest
        IYearn(yearnStrategy).transferFrom(user, address(this), amount);
        IYearn(yearnStrategy).withdraw(amount);
        emit OffchainDivest(user, amount); //To be consumed by the offchain
    }

    function digestFromOffchainDivest(
        address user,
        uint amountReq,
        uint amountRecBaseMarket
    ) external onlyOffchain {
        IERC20(baseMarket).transfer(user, amountRecBaseMarket);
        emit Divest(user, amountReq, amountRecBaseMarket);
    }

    function getRoyalty() external pure returns (uint256) {
        return fee;
    }
}
