// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC4626.sol)
pragma solidity ^0.8.14;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ETHVault is ERC4626 {
    constructor(
        IERC20 _underlying_asset, string memory name_, string memory symbol_) ERC4626(_underlying_asset) ERC20("eVault", "eVT"){    
    }
}