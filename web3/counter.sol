// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Counter {
    address public owner;
    uint256 public count;

    constructor() {
        owner = msg.sender;
    }

    function increment() public returns (uint256 _count) {
        _count = count++;
    }

    function decrement() public returns (uint256 _count) {
        _count = count--;
    }

    function totalCount() public view returns (uint256) {
        return count;
    }
}
