//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// import {IStrategy} from "./interfaces/IStrategy.sol";
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

contract StrategyManager {
    address owner;
    mapping(address => uint256) rejectedStrategies;
    mapping(address => uint256) strategistWhitelist;
    mapping(address => uint256) whiteListQueue;
    mapping(address => uint256) whitelistedStrategies;
    //maps users=>strategy=>amount= >nonce
    mapping(address => mapping(address => mapping(uint256 => uint256))) userStrategyAmountNonce;
    //maps user nonce to strategy address
    mapping(address => mapping(uint256 => address)) userNonceStrategy;
    uint nonce;

    enum Status {
        INACTIVE, //NOT USED BUT FOR DEFAULT VALUE
        ACTIVE,
        DIVESTED
    }

    struct Investment {
        address user;
        address strategy;
        uint256 amount;
        Status status;
    }
    mapping(uint256 => Investment) nonceToInvestment;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //add change owner function

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

    function whiteListStrategist(address strategist) public onlyOwner {
        strategistWhitelist[strategist] = 1;
    }

    function invest(uint256 amount, address strategy) external payable {
        require(isStrategyWhitelisted(strategy), "Strategy not whitelisted");
        nonce++;
        Investment memory inv = Investment(
            msg.sender,
            strategy,
            amount,
            Status.ACTIVE
        );
        nonceToInvestment[nonce] = inv;
        if (msg.value == 0) {
            IStrategy(strategy).invest(msg.sender, amount);
        } else {
            require(amount == 0);
            IStrategy(strategy).invest{value: msg.value}(msg.sender, 0);
        }
        //update a state var which keeps record of the funds invested by the user with the particular strategy
        //event emission
    }

    function divest(uint256 _nonce) external payable {
        require(_nonce < nonce);
        Investment storage inv = getInvestment(_nonce);
        require(inv.status == Status.DIVESTED);
        address strategy = inv.strategy;
        uint amount = inv.amount;
        inv.status = Status.DIVESTED;
        IStrategy(strategy).divest(msg.sender, amount);
        //event emission
    }

    function isStrategyRejected(address strategy) internal view returns (bool) {
        return (rejectedStrategies[strategy] == 1);
    }

    function isStrategistWhitelisted(
        address strategist
    ) internal view returns (bool) {
        return (strategistWhitelist[strategist] == 1);
    }

    function isStrategyWhitelisted(
        address strategy
    ) public view returns (bool) {
        return (whitelistedStrategies[strategy] == 1);
    }

    function getInvestment(
        uint _nonce
    ) internal view returns (Investment storage) {
        return (nonceToInvestment[_nonce]);
    }
}
