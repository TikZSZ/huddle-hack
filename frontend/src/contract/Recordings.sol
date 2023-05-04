// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Recordings is ERC20, Ownable {
    uint256 private recordingCount = 0;
    mapping(uint256 => string) private _recordings;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function addRecording(uint256 id, string memory url) public onlyOwner {
        require(bytes(_recordings[id]).length == 0, "Recording with this ID already exists");
        _recordings[id] = url;
        recordingCount++;
    }

    function getRecording(uint256 id) public view returns (string memory) {
        require(bytes(_recordings[id]).length > 0, "Recording with this ID does not exist");
        require(balanceOf(msg.sender) >= 1, "You need to hold at least 1 token to access this recording");
        return _recordings[id];
    }

    function getCurrentCount() public view returns (uint256) {
        return recordingCount;
    }
    
}
