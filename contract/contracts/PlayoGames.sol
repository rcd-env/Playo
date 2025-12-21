// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PlayoGames
 * @dev Multi-game contract for Playo platform supporting Flippo and Tappo games
 * @notice Players deposit funds to play games and withdraw rewards based on performance
 */
contract PlayoGames {
    mapping(address => uint256) public deposits;
    address public owner;
    
    event Deposited(address indexed player, uint256 amount, string gameType);
    event Withdrawn(address indexed player, uint256 amount);
    event PrizePoolFunded(uint256 amount);
    event OwnerWithdrawal(address indexed owner, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Deposit funds when starting a game
     * @param gameType The type of game being played ("flippo" or "tappo")
     */
    function deposit(string memory gameType) external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(
            keccak256(bytes(gameType)) == keccak256(bytes("flippo")) || 
            keccak256(bytes(gameType)) == keccak256(bytes("tappo")),
            "Invalid game type"
        );
        
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, gameType);
    }
    
    /**
     * @dev Withdraw rewards after game completion
     * @param amount The amount to withdraw (calculated by frontend based on game performance)
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        // Reset player's deposit tracking
        deposits[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Owner funds the prize pool to enable game rewards
     */
    function fundPrizePool() external payable {
        require(msg.value > 0, "Fund amount must be greater than 0");
        emit PrizePoolFunded(msg.value);
    }
    
    /**
     * @dev Owner withdraws specific amount from contract
     * @param amount The amount to withdraw
     */
    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit OwnerWithdrawal(owner, amount);
    }
    
    /**
     * @dev Owner withdraws all funds from contract
     */
    function ownerWithdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit OwnerWithdrawal(owner, balance);
    }
    
    /**
     * @dev Get player's deposit balance
     * @param player The player's address
     * @return The deposited amount
     */
    function getBalance(address player) external view returns (uint256) {
        return deposits[player];
    }
    
    /**
     * @dev Get total contract balance (prize pool + player deposits)
     * @return The total contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Receive function to accept direct ETH transfers as prize pool funding
     */
    receive() external payable {
        emit PrizePoolFunded(msg.value);
    }
}
