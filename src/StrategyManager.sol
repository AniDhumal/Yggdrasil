//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "./interfaces/IStrategy.sol";

contract StrategyManager {
    address owner;
    mapping(address => uint256) rejectedStrategies;
    mapping(address => uint256) strategistWhitelist;
    mapping(address => uint256) whiteListQueue;
    mapping(address => uint256) whitelistedStrategies;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function queueWhiteListStrategy(
        address strategy,
        address strategist
    ) public {
        require(
            !isStrategyRejected(strategy) && isStrategistWhitelisted(strategist)
        );
        whiteListQueue[strategy] = 1;
    }

    function whiteListStrategy(address strategy) public onlyOwner {
        require(whiteListQueue[strategy] == 1, "Not in whitelist queue");
        require(whitelistedStrategies[strategy] == 0, "Already whitelisted");
        whitelistedStrategies[strategy] = 1;
    }

    function invest(uint256 amount, address strategy) external payable {
        require(isStrategyWhitelisted(strategy), "Strategy not whitelisted");
        if (msg.value == 0) {
            IStrategy(strategy).invest(amount);
        }
        if (msg.value != 0) {
            require(amount == 0);
            IStrategy(strategy).invest{value: msg.value}(0);
        }
        //update a state var which keeps record of the funds invested by the user with the particular strategy
    }

    function isStrategyRejected(address strategy) internal view returns (bool) {
        return (rejectedStrategies[strategy] == 1);
    }

    function isStrategistWhitelisted(
        address strategist
    ) internal view returns (bool) {
        return (rejectedStrategies[strategist] == 1);
    }

    function isStrategyWhitelisted(
        address strategy
    ) public view returns (bool) {
        return (whitelistedStrategies[strategy] == 1);
    }
}
