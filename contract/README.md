# Memory Game Smart Contract

Solidity smart contract for the Earno memory game on Mantle Sepolia testnet.

## Prerequisites

- Node.js installed
- Private key with MNT tokens for Mantle Sepolia
- Get testnet MNT from: https://faucet.sepolia.mantle.xyz/

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Add your private key to `.env`:

```
PRIVATE_KEY=your_private_key_here
```

## Deploy

Deploy to Mantle Sepolia:

```bash
npx hardhat run scripts/deploy.js --network mantleSepolia
```

After deployment:

1. Copy the contract address
2. Update `MEMORY_GAME_ADDRESS` in `client/src/lib/contract.ts`
3. Verify on explorer: https://sepolia.mantlescan.xyz

## Contract Details

- **Network**: Mantle Sepolia Testnet
- **Chain ID**: 5003
- **RPC**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://sepolia.mantlescan.xyz
- **Native Token**: MNT (testnet)

## Contract Functions

### Player Functions

- `deposit()` - Deposit MNT to start game
- `withdraw(uint256 amount)` - Withdraw winnings
- `getBalance(address player)` - View player balance
- `getContractBalance()` - View total contract balance

### Owner Functions

- `fundPrizePool()` - Add funds to prize pool
- `ownerWithdraw(uint256 amount)` - Withdraw specific amount
- `ownerWithdrawAll()` - Withdraw all funds
