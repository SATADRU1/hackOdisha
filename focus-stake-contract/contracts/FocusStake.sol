// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FocusStake is ERC20, Ownable {
    mapping(address => uint256) private stakes;
    mapping(address => uint256) private rewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor() ERC20("FocusStake Token", "FST") {}

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender] >= amount, "Insufficient staked amount");
        stakes[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function calculateReward(address user) public view returns (uint256) {
        // Reward calculation logic goes here
        return stakes[user] / 10; // Example: 10% reward
    }

    function claimReward() external {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards available");
        rewards[msg.sender] += reward;
        emit RewardPaid(msg.sender, reward);
    }

    function getStake(address user) external view returns (uint256) {
        return stakes[user];
    }

    function getReward(address user) external view returns (uint256) {
        return rewards[user];
    }
}