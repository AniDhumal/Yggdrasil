//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;
import {IStrategy} from "../../interfaces/IStrategy.sol";
import "../../interfaces/IWETH.sol";
import "../../interfaces/IERC20.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";

contract StrategyLinea is IStrategy {
    address public strategist;
    uint256 public constant fee = 1000; // In basis points
    address public immutable WETH;
    address public immutable vault_address;


// Deploy on Linea
// WETH = "0x4284186b053ACdBA28E8B26E99475d891533086a";

    constructor(
        address _WETH,
        address _strategist,
        address _vault_address
    ) {
        WETH = _WETH;
        strategist = _strategist;
        vault_address = _vault_address;
    }

    function invest(address user, uint amt) external payable {
        //param here is amount
        //should be callable only by the strategy manager
        // require(amt == 0);

        uint256 strategist_fee = (msg.value * fee) / 10000;
        uint256 amount = msg.value - strategist_fee;

        IWETH(WETH).deposit{value: amount}();

        emit FeeDeduction(user, strategist, strategist_fee);

        IERC4626(vault_address).deposit(amount, user);
        // payable(strategist).transfer(strategist_fee);

        // ! Changed logic
        (bool success, ) = payable(strategist).call{value: strategist_fee}("");
        require(success, "Failed to send Ether");
        //update a state var which keeps record of the funds invested by the user with the particular strategy

        emit Invest(user, amount);
    }

    function divest(address user, uint256 amount) external payable {
        //should be callable only by the strategy manager
        
        uint256 redeemedTokens = IERC4626(vault_address).redeem(amount, address(this), user);

        uint256 strategist_fee = (redeemedTokens * fee) / 10000;
        payable(user).transfer(redeemedTokens - strategist_fee);
        payable(strategist).transfer(strategist_fee);

        emit FeeDeduction(user, strategist, strategist_fee);
        emit Divest(user, amount, redeemedTokens - strategist_fee);
    }

    function getRoyalty() external pure returns (uint256) {
        return 1000;
    }

    receive() external payable {
        // Do nothing
    }
}
