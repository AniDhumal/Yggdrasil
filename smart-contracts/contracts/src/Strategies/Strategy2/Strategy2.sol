//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "../../interfaces/IStrategy.sol";
import {IAave} from "./IAave.sol";
import {IERC20} from "../../interfaces/IERC20.sol";

contract Strategy2 is IStrategy {
    address public strategist;
    uint256 immutable fee = 1000; // In basis points
    address aaveLP; //weth and x token
    address offchain;
    address baseToken; //usdc
    address marketToken; //weth
    address aToken;

    constructor(
        address _aaveLP,
        address _offchain,
        address _baseToken,
        address _marketToken,
        address _aToken
    ) {
        aaveLP = _aaveLP;
        offchain = _offchain;
        baseToken = _baseToken;
        marketToken = _marketToken;
        aToken = _aToken;
    }

    event OffchainDivest(address user, uint amount);
    modifier onlyOffchain() {
        require(msg.sender == offchain);
        _;
    }

    //swaps with fusion offchain to weth and supplies to aave
    function invest(address user, uint amount) external payable {
        //emit event to be picked up by the fusion api
        IERC20(baseToken).transferFrom(user, address(this), amount);
        emit Invest(user, amount);
    }

    function digestFromOffchainInvest(
        address user,
        uint amount
    ) external onlyOffchain {
        //stake the amount with yearn
        IAave(aaveLP).supply(marketToken, amount, user, 0);
    }

    function divest(address user, uint amount) external payable {
        //call withdraw function from yearn
        //if call successful, emit event to be picked by the offchain, swapped to original
        //market using fusion and returned to the user.
        //user needs to approve vault tokens to divest
        IERC20(aToken).transferFrom(user, address(this), amount);
        IAave(aaveLP).withdraw(marketToken, amount, address(this));
        emit OffchainDivest(user, amount); //To be consumed by the offchain
    }

    function digestFromOffchainDivest(
        address user,
        uint amountReq,
        uint amountRecBaseMarket
    ) external onlyOffchain {
        IERC20(baseToken).transfer(user, amountRecBaseMarket);
        emit Divest(user, amountReq, amountRecBaseMarket);
    }

    function getRoyalty() external pure returns (uint256) {
        return fee;
    }
}
