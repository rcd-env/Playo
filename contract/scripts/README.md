# PlayoGames Contract Scripts

Utility scripts for managing the PlayoGames smart contract on Mantle Sepolia.

## Contract Address

`0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C`

## Available Scripts

### 1. Deploy Contract

Deploy a new PlayoGames contract to Mantle Sepolia.

```bash
npx hardhat run scripts/deploy.js --network mantleSepolia
```

### 2. Check Balance

Check contract balance, owner info, and your deposits.

```bash
# Use default contract address
npx hardhat run scripts/checkBalance.js --network mantleSepolia

# Specify custom contract address
npx hardhat run scripts/checkBalance.js --network mantleSepolia 0xYourContractAddress
```

**Output:**

- Contract owner address
- Total contract balance (prize pool + deposits)
- Your personal deposits
- Your wallet balance

### 3. Fund Prize Pool

Owner funds the contract's prize pool to enable player rewards.

```bash
# Fund 0.1 MNT (default)
npx hardhat run scripts/fundPrizePool.js --network mantleSepolia

# Fund custom amount
npx hardhat run scripts/fundPrizePool.js --network mantleSepolia 0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C 1.0

# Arguments: [contractAddress] [amount]
```

**Requirements:** Must be called by contract owner

### 4. Owner Withdraw

Owner withdraws funds from the contract.

```bash
# Withdraw specific amount
npx hardhat run scripts/ownerWithdraw.js --network mantleSepolia 0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C 0.5

# Withdraw all funds
npx hardhat run scripts/ownerWithdraw.js --network mantleSepolia 0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C all

# Arguments: [contractAddress] [amount|all]
```

**Requirements:** Must be called by contract owner

## Quick Start Workflow

### Initial Setup

1. **Deploy contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network mantleSepolia
   ```

2. **Fund prize pool:**

   ```bash
   npx hardhat run scripts/fundPrizePool.js --network mantleSepolia 0xYourAddress 10
   ```

3. **Check status:**
   ```bash
   npx hardhat run scripts/checkBalance.js --network mantleSepolia 0xYourAddress
   ```

### Maintenance

- **Check balances regularly:**

  ```bash
  npx hardhat run scripts/checkBalance.js --network mantleSepolia
  ```

- **Top up prize pool when low:**

  ```bash
  npx hardhat run scripts/fundPrizePool.js --network mantleSepolia 0xAddress 5
  ```

- **Withdraw excess funds:**
  ```bash
  npx hardhat run scripts/ownerWithdraw.js --network mantleSepolia 0xAddress 2
  ```

## Environment Setup

Make sure you have a `.env` file in the contract directory:

```env
PRIVATE_KEY=your_private_key_here
```

## Game Flow

1. **Player Deposit:** Player calls `deposit("flippo")` or `deposit("tappo")` when starting a game
2. **Player Withdraw:** Player calls `withdraw(amount)` after game completion based on performance
3. **Prize Pool:** Owner regularly funds the contract to cover player rewards
4. **Monitoring:** Use checkBalance.js to monitor contract health

## Security Notes

- ✅ Only owner can fund prize pool
- ✅ Only owner can withdraw from contract
- ✅ Players can only withdraw up to contract balance
- ✅ Game type validation ensures only "flippo" or "tappo" games
- ✅ All transactions are transparent on-chain

## Explorer Links

- **Contract:** https://sepolia.mantlescan.xyz/address/0xcf8D7A35fCCFFb35ADA108AFa44B397ED3A8204C
- **Network:** Mantle Sepolia Testnet
- **RPC:** https://rpc.sepolia.mantle.xyz
- **Chain ID:** 5003

## Troubleshooting

### "Insufficient contract balance"

- Contract needs more funds in prize pool
- Run: `npx hardhat run scripts/fundPrizePool.js --network mantleSepolia`

### "Only owner can call this function"

- Make sure you're using the owner's private key in `.env`
- Verify with: `npx hardhat run scripts/checkBalance.js --network mantleSepolia`

### "Transfer failed"

- Check gas fees and network status
- Ensure contract has sufficient balance
