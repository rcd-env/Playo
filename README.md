# 🎮 Playo - A Gaming Platform on Mantle

> **Play-to-Earn Gaming with Multiple Games on the Blockchain**

Playo is a decentralized gaming platform built on Mantle Sepolia Testnet featuring multiple skill-based games where players bet MNT tokens and earn proportional rewards based on their performance. Challenge yourself with memory and reflex games, and earn crypto rewards instantly!

[![Built with React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Mantle](https://img.shields.io/badge/Mantle-Sepolia-000000)](https://www.mantle.xyz/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Games](#games)
- [Features](#features)
- [Screenshots](#screenshots)
- [Smart Contract](#smart-contract)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Game Rules & Rewards](#game-rules--rewards)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Playo is a blockchain-based gaming platform featuring multiple skill-based games:

- **🃏 Flippo** - Test your memory with card matching challenges
- **⚡ Tappo** - Challenge your reflexes with fast-paced bubble tapping

Key Platform Features:

- **Bet MNT tokens** on your gaming skills
- **Earn proportional rewards** based on game performance (1.2x to 3.0x multipliers)
- **Multiple difficulty levels** for both games
- **Instant on-chain payouts** with transparent smart contracts
- **Break-even indicators** to track your profit targets

Built on Mantle Sepolia Testnet with Solidity smart contracts ensuring transparent, trustless gameplay and instant MNT rewards.

---

## 🎲 Games

### 🃏 Flippo - Memory Card Matching

A classic memory card game where you match identical pairs with limited flips.

**Difficulty Levels:**

- **2x2 Grid**: 2 pairs, 2 flips, 1.2x multiplier
- **4x4 Grid**: 8 pairs, 8 flips, 1.5x multiplier
- **6x6 Grid**: 18 pairs, 18 flips, 2.0x multiplier
- **8x8 Grid**: 32 pairs, 32 flips, 2.5x multiplier

**Gameplay:**

- Click cards to reveal them
- Match identical pairs
- Limited flips based on grid size
- Focus on accuracy with no time pressure

### ⚡ Tappo - Reflex Challenge

A fast-paced bubble-tapping reflex game with 30-second rounds.

**Difficulty Levels:**

- **Easy**: 250 points possible, 2.0x multiplier
- **Medium**: 350 points possible, 2.5x multiplier
- **Hard**: 500 points possible, 3.0x multiplier

**Gameplay:**

- Tap bubbles before they disappear
- Higher difficulty = faster movement & more points
- 30-second time limit
- Progressive difficulty with dynamic spawning

---

## ✨ Features

### 🎯 Platform Features

- **🎮 Multiple Games**: Choose between Flippo (memory) and Tappo (reflex)
- **💰 Proportional Rewards**: Earn based on performance with 1.2x to 3.0x multipliers
- **⚡ Instant Payouts**: Withdraw earnings immediately after games
- **🔐 Secure Smart Contracts**: Battle-tested on Mantle Sepolia Testnet
- **📊 Real-time Statistics**: Track score, accuracy, time, and potential earnings
- **💡 Break-Even Indicators**: See exactly what score you need to profit
- **🎨 Beautiful UI**: Space Grotesk typography with vibrant colors
- **🌊 Prize Pool System**: Owner can fund pool for larger payouts
- **👛 Easy Wallet Connection**: Powered by RainbowKit (MetaMask, Rainbow, WalletConnect, etc.)
- **🎵 Audio Feedback**: Immersive sound effects for all game actions
- **📱 Responsive Design**: Smooth animations with Framer Motion

### 🃏 Flippo Features

- **Four Difficulty Levels**: 2x2, 4x4, 6x6, or 8x8 grids
- **Memory Challenge**: Match identical card pairs
- **Limited Flips**: Strategic gameplay with flip restrictions
- **Progressive Multipliers**: 1.2x to 2.5x based on grid size
- **No Time Pressure**: Focus purely on accuracy

### ⚡ Tappo Features

- **Three Difficulty Levels**: Easy, Medium, Hard
- **30-Second Rounds**: Fast-paced reflex challenge
- **Progressive Difficulty**: Bubbles move faster as difficulty increases
- **High Multipliers**: 2.0x to 3.0x reward potential
- **Dynamic Spawning**: Unique bubble patterns every game
- **Score Targets**: Clear break-even points displayed in stats

---

## 📸 Screenshots

### Home Screen

![Home Screen](./docs/screenshots/home.png)
_Choose your game and difficulty level_

### Flippo - Game Board

![Flippo Game Board](./docs/screenshots/game-board.png)
_Match identical cards with limited flips_

### Tappo - Reflex Challenge

![Tappo Game](./docs/screenshots/tappo.png)
_Tap bubbles before they disappear in 30 seconds_

### Game Statistics

![Game Stats](./docs/screenshots/stats.png)
_Track your performance with clear, readable real-time metrics_

### Winning Screen

![Winning Screen](./docs/screenshots/winning.png)
_Celebrate your victory and claim your rewards_

### Partial Refund

![Losing Screen](./docs/screenshots/losing.png)
_Get proportional refunds based on your performance_

### Wallet Connection

![Wallet Connect](./docs/screenshots/wallet.png)
_Multiple wallet options powered by RainbowKit_

---

## 📝 Smart Contract

### Deployed Contract Address

**Network**: Mantle Sepolia Testnet (Chain ID: 5003)  
**Compiler**: Solidity 0.8.20  
**Contract**: `PlayoGames.sol`  
**Block Explorer**: https://sepolia.mantlescan.xyz  
**Faucet**: https://faucet.sepolia.mantle.xyz/

Deploy your own contract using the instructions in [contract/README.md](contract/README.md)

### Contract Features

- **Deposits**: Players deposit MNT to start games
- **Withdrawals**: Players withdraw winnings proportional to performance
- **Prize Pool**: Owner can fund prize pool to ensure payouts exceed deposits
- **Owner Withdrawals**: Contract owner can withdraw funds anytime
- **Balance Tracking**: Tracks individual player deposits and contract balance
- **Access Control**: Owner-only functions protected with modifiers
- **Game Management**: Support for multiple game types with different reward multipliers

### Contract Functions

**Player Functions:**

```solidity
function deposit() external payable
function withdraw(uint256 amount) external
function getBalance(address player) external view returns (uint256)
function getContractBalance() external view returns (uint256)
```

**Owner Functions:**

```solidity
function fundPrizePool() external payable
function ownerWithdraw(uint256 amount) external onlyOwner
function ownerWithdrawAll() external onlyOwner
```

### Events

```solidity
event Deposited(address indexed player, uint256 amount)
event Withdrawn(address indexed player, uint256 amount)
event PrizePoolFunded(uint256 amount)
event OwnerWithdrawal(address indexed owner, uint256 amount)
```

---

## 🛠 Tech Stack

### Frontend

- **React 19.1.1** - UI framework with modern features
- **TypeScript** - Type safety and better developer experience
- **Vite 7.1.7** - Lightning-fast build tool & dev server
- **Tailwind CSS 4.1.15** - Utility-first styling framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icon set
- **Space Grotesk** - Modern, clean typography

### Web3 Integration

- **Wagmi 2.18.2** - React hooks for Ethereum
- **Viem 2.38.3** - TypeScript Ethereum library
- **RainbowKit 2.2.9** - Beautiful wallet connection UI
- **TanStack Query** - Async state management for Web3

### Smart Contract

- **Solidity 0.8.20** - Smart contract language
- **Hardhat 2.26.3** - Development environment
- **Mantle Sepolia** - Testnet deployment (Chain ID: 5003)

### Audio & Media

- **HTML5 Audio API** - Game sound effects
- **Video Preloading** - Optimized media loading

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** or any Web3 wallet
- **Mantle Sepolia testnet MNT** for testing ([Get from faucet](https://faucet.sepolia.mantle.xyz/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/playo.git
cd playo
```

2. **Install client dependencies**

```bash
cd client
npm install
```

3. **Install contract dependencies** (optional, for development)

```bash
cd ../contract
npm install
```

4. **Configure environment variables**

Create `.env` file in the `contract` directory:

```env
PRIVATE_KEY=your_private_key_here
```

**⚠️ Security Warning**: Never commit `.env` file to git. Keep your private key secure!

5. **Run the development server**

```bash
cd client
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🎮 How to Play

### Getting Started

1. **Connect Wallet**

   - Click "Connect Wallet" button
   - Select your preferred wallet (MetaMask, Rainbow, WalletConnect, etc.)
   - Approve the connection
   - Ensure you're on Mantle Sepolia Testnet

2. **Choose a Game**

   - **Flippo**: Test your memory with card matching
   - **Tappo**: Challenge your reflexes with bubble tapping

3. **Select Difficulty**

   - **Flippo**: 2x2, 4x4, 6x6, or 8x8 grid sizes
   - **Tappo**: Easy, Medium, or Hard difficulty

4. **Place Your Bet**
   - Enter the amount of MNT you want to bet
   - Approve the deposit transaction
   - Wait for blockchain confirmation

### Playing Flippo

1. **Match Cards**

   - Click cards to reveal them
   - Find and match identical pairs
   - You have limited flips based on grid size

2. **Track Stats**

   - **Score**: Pairs matched / Total pairs
   - **Flips**: Remaining flips
   - **Potential Reward**: Your current earnings
   - **Break-Even**: Score needed to profit

3. **Game Ends**
   - When all pairs are matched (Win!)
   - When you run out of flips (Partial win/loss)

### Playing Tappo

1. **Tap Bubbles**

   - Tap on bubbles before they disappear
   - Each successful tap increases your score
   - Faster difficulty = more points per bubble

2. **Track Stats**

   - **Score**: Current points earned
   - **Time**: Countdown from 30 seconds
   - **Potential Reward**: Current earnings estimate
   - **Break-Even**: Points needed to profit

3. **Game Ends**
   - When the 30-second timer reaches zero
   - Your reward is calculated based on final score

### Claiming Your Reward

After any game ends, your reward is automatically calculated based on your performance:

**For Tappo (Score-Based):**

- **Profit (Score ≥ Break-Even Points)**: If you score above the break-even threshold, you earn a profit! Click "Claim Reward" to withdraw your bet plus winnings instantly to your wallet.
- **Break-Even (Score = Break-Even Points)**: If you score exactly at the break-even point, you get your original bet back with no profit or loss. Click "Claim Refund" to recover your bet.
- **Partial Refund (Score < Break-Even Points but > 0)**: If you scored some points but didn't reach break-even, you'll receive a proportional refund. The more points you scored, the more you get back. Click "Claim Partial Refund" to recover what you earned.
- **No Score (Score = 0)**: If you didn't score any points, no refund is available. The game will show your results, but there's no withdrawal option.

**For Flippo (Pairs-Based):**

- Similar reward structure based on pairs matched vs total pairs
- Proportional refunds for partial completions

**Transaction Process:**

1. Click the appropriate claim button
2. Approve the withdrawal transaction in your wallet
3. Wait for blockchain confirmation
4. Funds are instantly transferred to your wallet!

---

## 💰 Game Rules & Rewards

### Flippo - Reward Multipliers by Grid Size

| Grid Size | Total Pairs | Max Flips | Reward Multiplier |
| --------- | ----------- | --------- | ----------------- |
| 2x2       | 2 pairs     | 2 flips   | 1.2x              |
| 4x4       | 8 pairs     | 8 flips   | 1.5x              |
| 6x6       | 18 pairs    | 18 flips  | 2.0x              |
| 8x8       | 32 pairs    | 32 flips  | 2.5x              |

### Tappo - Reward Multipliers by Difficulty

| Difficulty | Max Points | Time Limit | Reward Multiplier | Break-Even Points |
| ---------- | ---------- | ---------- | ----------------- | ----------------- |
| Easy       | 250        | 30s        | 2.0x              | 125               |
| Medium     | 350        | 30s        | 2.5x              | 140               |
| Hard       | 500        | 30s        | 3.0x              | 167               |

### Proportional Rewards System

Your final payout is calculated proportionally based on your performance:

**Flippo Formula:**

```
Earned Reward = (Correct Pairs / Total Pairs) × Max Possible Reward
Max Possible Reward = Bet Amount × Reward Multiplier
```

**Tappo Formula:**

```
Earned Reward = (Score / Max Possible Score) × Max Possible Reward
Max Possible Reward = Bet Amount × Reward Multiplier
```

### Examples

**Flippo - Perfect Game (8x8):**

- Bet: 10 MNT
- Result: Matched all 32 pairs
- Reward: 10 × 2.5 = 25 MNT
- **Profit: 15 MNT** ✨

**Flippo - Partial Win (4x4):**

- Bet: 5 MNT
- Result: Matched 4/8 pairs (50%)
- Reward: 5 × 1.5 × 0.5 = 3.75 MNT
- **Loss: 1.25 MNT** (but you get 3.75 MNT back!)

**Tappo - High Score (Hard):**

- Bet: 20 MNT
- Result: 400/500 points (80%)
- Reward: 20 × 3.0 × 0.8 = 48 MNT
- **Profit: 28 MNT** 🔥

**Tappo - Break-Even (Medium):**

- Bet: 10 MNT
- Result: 140/350 points (exactly break-even)
- Reward: 10 MNT back
- **Profit: 0 MNT** (no loss, no gain)

### Game Over Conditions

**Flippo:**

- ✅ **Win**: All pairs matched
- ⚠️ **Partial**: Out of flips with some pairs matched
- ❌ **Loss**: Out of flips with few/no pairs matched (but still get proportional refund)

**Tappo:**

- ✅ **Win**: Score ≥ Break-even points
- ⚠️ **Partial**: 0 < Score < Break-even points (proportional refund)
- ❌ **Loss**: Score = 0 (no refund)
- **Multi-Wallet Support**: MetaMask, Rainbow, WalletConnect, and more
- **Expandable Sidebar**: Easy navigation with hover-to-expand menu

### 🔒 Security Features

- **Decentralized**: Smart contract handles all game funds
- **Transparent**: Open-source code on GitHub
- **Non-custodial**: You maintain full control of your wallet
- **Auditable**: All transactions on Mantle Sepolia Explorer

---

## 📸 Screenshots

### Game Wireframe

![Game Wireframe](./docs/screenshots/wireframe.png)

### Home Screen

![Home Screen](./docs/screenshots/home.png)
![Home Screen Dark Mode](./docs/screenshots/home-dark.png)
_Connect your wallet and choose your difficulty level_

### Game Board

![Game Board - 4x4 Grid](./docs/screenshots/4x4-grid.png)
_Match pairs to earn rewards - the more you match, the more you earn_

### Game Stats

![Game Statistics](./docs/screenshots/stats.png)
_Real-time tracking of your performance and potential rewards_

### Winning Screen

![Victory Screen](./docs/screenshots/won.png)
_Celebrate your win and withdraw your earnings_

### Losing Screen

![Victory Screen](./docs/screenshots/lose.png)
_"Pandavo ko v krishna bet harne ke bad hi mile the"_

### Wallet Connection

---

## 📁 Project Structure

```
Playo/
├── client/                     # Frontend React application
│   ├── public/
│   │   ├── audios/            # Game sound effects
│   │   ├── fonts/             # Custom fonts
│   │   ├── images/            # Static images and icons
│   │   └── videos/            # Game videos and animations
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Card.tsx                # Flippo card component
│   │   │   ├── ErrorNotification.tsx   # Error handling UI
│   │   │   ├── GameBoard.tsx           # Flippo game board
│   │   │   ├── GameResult.tsx          # Post-game results modal
│   │   │   ├── GameStart.tsx           # Game initialization
│   │   │   ├── GameStats.tsx           # Real-time statistics
│   │   │   ├── provider.tsx            # Context providers
│   │   │   ├── Sidebar.tsx             # Game navigation
│   │   │   ├── wallet-connect.tsx      # Wallet connection UI
│   │   │   └── games/
│   │   │       ├── Flippo/
│   │   │       │   └── FlippoGame.tsx  # Flippo game logic
│   │   │       └── Tappo/
│   │   │           └── TappoGame.tsx   # Tappo game logic
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── usePlayoGame.ts         # Main game state hook
│   │   │   └── useVideoPreloader.ts    # Media preloading
│   │   ├── lib/               # Configuration & utilities
│   │   │   ├── contract.ts             # Contract ABI & address
│   │   │   ├── wagmi.ts                # Wagmi configuration
│   │   │   └── config.ts               # App configuration
│   │   ├── App.tsx            # Main app component with routing
│   │   ├── App.css            # Global styles
│   │   ├── index.css          # Tailwind imports & base styles
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── contract/                   # Smart contract
│   ├── contracts/
│   │   └── PlayoGames.sol     # Main game contract
│   ├── scripts/
│   │   ├── deploy.js          # Deployment script
│   │   ├── checkBalance.js    # Check contract balance
│   │   ├── fundPrizePool.js   # Prize pool funding
│   │   ├── ownerWithdraw.js   # Owner withdrawal script
│   │   └── README.md          # Contract deployment guide
│   ├── artifacts/             # Compiled contracts
│   ├── cache/                 # Hardhat cache
│   ├── hardhat.config.js      # Hardhat configuration
│   └── package.json
│
├── docs/                      # Documentation
│   └── screenshots/           # App screenshots
│
├── LICENSE                    # MIT License
└── README.md                  # This file
```

---

## 🔧 Development

### Running Tests

```bash
# Contract tests
cd contract
npx hardhat test

# Frontend type checking
cd client
npm run typecheck
```

### Linting

```bash
cd client
npm run lint
```

### Building for Production

```bash
cd client
npm run build
```

The production build will be in `client/dist/` directory.

### Local Development with Hardhat

1. **Start local Hardhat node**

```bash
cd contract
npx hardhat node
```

2. **Deploy contract locally**

```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. **Update contract address** in `client/src/lib/contract.ts`

4. **Fund the prize pool** (optional)

```bash
npx hardhat run scripts/fundPrizePool.js --network localhost
```

---

## 🚀 Deployment

### Deploy Smart Contract to Mantle Sepolia

1. **Set up environment variables**

```bash
cd contract
# Add your private key to .env file
echo "PRIVATE_KEY=your_private_key_here" > .env
```

**⚠️ Security**: Never commit `.env` to git!

2. **Ensure you have MNT for gas**

Get testnet MNT from the [Mantle Faucet](https://faucet.sepolia.mantle.xyz/)

3. **Deploy to Mantle Sepolia**

```bash
npx hardhat run scripts/deploy.js --network mantleSepolia
```

This will output your contract address. Save it!

4. **Fund the prize pool** (optional but recommended)

Edit `scripts/fundPrizePool.js` with your contract address:

```javascript
const CONTRACT_ADDRESS = "0xYourContractAddress";
const FUND_AMOUNT = "10"; // Amount in MNT
```

Then run:

```bash
npx hardhat run scripts/fundPrizePool.js --network mantleSepolia
```

5. **Update client configuration**

Update `client/src/lib/contract.ts` with your new contract address.

6. **Verify contract** (optional)

```bash
npx hardhat verify --network mantleSepolia YOUR_CONTRACT_ADDRESS
```

### Deploy Frontend

The frontend can be deployed to various platforms:

**Vercel** (Recommended)

```bash
cd client
vercel --prod
```

**Netlify**

```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

**GitHub Pages**

```bash
cd client
npm run build
# Deploy dist/ folder to gh-pages branch
```

### Managing the Contract

**Check Contract Balance:**

```bash
cd contract
npx hardhat run scripts/checkBalance.js --network mantleSepolia
```

**Owner Withdraw Funds:**

```bash
npx hardhat run scripts/ownerWithdraw.js --network mantleSepolia
```

Edit the script to choose between full or partial withdrawal.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and TypeScript conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

### Areas for Contribution

- 🎮 New game modes and mechanics
- 🎨 UI/UX improvements and animations
- 🔐 Security audits and improvements
- 📊 Advanced statistics and analytics
- 🌐 Internationalization (i18n)
- ♿ Accessibility enhancements
- 📱 Mobile responsiveness improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Mantle Network** - For the blazing-fast L2 blockchain platform
- **RainbowKit** - For the beautiful wallet connection UI
- **Wagmi & Viem** - For excellent Web3 React hooks and utilities
- **Hardhat** - For the robust smart contract development environment
- **React Team** - For the amazing React 19 framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Google Fonts** - For Space Grotesk typography

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/playo/issues)
- **Mantle Discord**: Join the Mantle community for support
- **Documentation**: Check our comprehensive docs for guides

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Mantle Sepolia Explorer**: [View Transactions](https://sepolia.mantlescan.xyz)
- **Mantle Faucet**: [Get Test MNT](https://faucet.sepolia.mantle.xyz/)
- **Mantle Documentation**: [https://docs.mantle.xyz](https://docs.mantle.xyz)
- **Smart Contract Code**: [View on GitHub](./contract/contracts/PlayoGames.sol)

---

## 🎯 Roadmap

### Current Features ✅

- Flippo memory game with 4 difficulty levels
- Tappo reflex game with 3 difficulty levels
- Proportional reward system
- Real-time statistics and break-even indicators
- Beautiful UI with Space Grotesk typography
- Multi-wallet support via RainbowKit

### Upcoming Features 🚀

- [ ] **Mainnet Deployment** - Launch on Mantle mainnet
- [ ] **Leaderboards** - Global and per-game rankings
- [ ] **Achievements System** - Unlock badges and rewards
- [ ] **Tournament Mode** - Competitive multiplayer events
- [ ] **New Games** - More skill-based games
- [ ] **NFT Rewards** - Earn collectible NFTs for achievements
- [ ] **Social Features** - Share scores and challenge friends
- [ ] **Mobile App** - Native iOS and Android apps

---

<div align="center">

**Made with ❤️ for the Mantle ecosystem**

[⬆ Back to Top](#-playo---blockchain-gaming-platform-on-mantle)

</div>
