// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "./SafeTransferLibSolmate.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK", 8) {}
}
