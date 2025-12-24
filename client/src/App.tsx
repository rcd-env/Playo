import { useEffect, useState } from "react";
import { Moon, Sun, Info } from "lucide-react";
import { WalletConnect } from "./components/wallet-connect";
import { ErrorNotification } from "./components/ErrorNotification";
import { Sidebar } from "./components/Sidebar";
import { FlippoGame } from "./components/games/Flippo/FlippoGame";
import { TappoGame } from "./components/games/Tappo/TappoGame";
import { usePlayoGame } from "./hooks/usePlayoGame";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [selectedGame, setSelectedGame] = useState("flippo");
  const [showRules, setShowRules] = useState(false);

  // Apply theme to document for scrollbar styling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const { address, isLoading, transactionError } = usePlayoGame();

  const bgColor = isDarkMode ? "bg-[#3C1F47]" : "bg-[#FFFFFF]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";

  return (
    <div
      className={`min-h-screen ${textColor} ${
        !isDarkMode ? "light-mode" : ""
      } relative overflow-y-auto scrollbar-hide`}
    >
      {/* Background Layer */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
          backgroundImage: isDarkMode
            ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.09) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.09) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        isDarkMode={isDarkMode}
        onHover={setIsSidebarHovered}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
      />

      {/* Overlay when sidebar is hovered */}
      {isSidebarHovered && (
        <div
          className="fixed inset-0 bg-black transition-opacity duration-300"
          style={{
            opacity: 0.15,
            zIndex: 40,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Main Content */}
      <div
        className="relative"
        style={{
          marginLeft: "112px", // Space for collapsed sidebar (80px + 32px margin)
          zIndex: 1,
        }}
      >
        {/* Top Bar */}
        <header className={`px-8 py-6 ${bgColor} bg-transparent`}>
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            {/* Brand Name */}
            <h1 className="text-4xl font-bold font-Tsuchigumo tracking-wider brand">
              Playo
            </h1>

            {/* Rules Button - Center */}
            <button
              onClick={() => setShowRules(true)}
              className={`px-6 py-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer flex items-center gap-2 ${textColor}`}
              style={{
                backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
              }}
            >
              <Info className="w-5 h-5" />
              <span className="font-semibold">How to Play</span>
            </button>

            {/* Theme Toggle & Wallet Connect */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer`}
                style={{
                  backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                }}
              >
                {isDarkMode ? (
                  <Moon className="w-6 h-6 text-black" />
                ) : (
                  <Sun className="w-6 h-6 text-black" />
                )}
              </button>
              <WalletConnect isDarkMode={isDarkMode} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {selectedGame === "flippo" && (
            <FlippoGame
              isDarkMode={isDarkMode}
              address={address}
              isLoading={isLoading}
            />
          )}

          {selectedGame === "tappo" && (
            <TappoGame
              isDarkMode={isDarkMode}
              address={address}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Error Notification */}
        {transactionError && (
          <ErrorNotification
            error={transactionError as Error}
            onDismiss={() => {}}
          />
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRules(false)}
        >
          <div
            className="fixed inset-0 bg-black opacity-50"
            style={{ backdropFilter: "blur(4px)" }}
          />
          <div
            className={`relative max-w-2xl w-full rounded-lg border ${borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8 max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-hide`}
            style={{
              backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedGame === "flippo" && (
              <div className={`space-y-4 ${textColor}`}>
                {/* Game Header with Logo and Title */}
                <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-black">
                  {/* Game Logo */}
                  <div className="shrink-0">
                    <img
                      src="/images/flippo-logo.png"
                      alt="Flippo Logo"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  {/* Title and Description */}
                  <div className="flex-1">
                    <h2
                      className={`text-3xl font-bold mb-3 ${textColor} font-Tsuchigumo`}
                    >
                      Flippo - Flip Your Fate
                    </h2>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Memory matching game - flip cards to find pairs
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Game Objective</h3>
                  <p>
                    Flippo is a skill-based memory matching game where you flip
                    cards to find matching pairs. Your memory and strategy
                    directly determine your rewards based on how many pairs you
                    successfully match.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Connect Wallet:</strong> Ensure your wallet is
                      connected to Mantle Sepolia testnet
                    </li>
                    <li>
                      <strong>Select Grid Size:</strong> Choose from 2×2, 4×4,
                      or 6×6 grid sizes
                    </li>
                    <li>
                      <strong>Stake Amount:</strong> Enter your MNT stake amount
                      to participate
                    </li>
                    <li>
                      <strong>Start Game:</strong> Click "Start Game" to begin
                      and deposit your stake into the smart contract
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Gameplay Mechanics</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Card Grid:</strong> Cards are placed face-down in
                      your selected grid size
                    </li>
                    <li>
                      <strong>Flip Cards:</strong> Click any card to reveal its
                      symbol
                    </li>
                    <li>
                      <strong>Match Pairs:</strong> Find two cards with
                      identical symbols to make a match
                    </li>
                    <li>
                      <strong>Matched Cards:</strong> Successfully matched pairs
                      remain face-up
                    </li>
                    <li>
                      <strong>Unmatched Cards:</strong> Non-matching cards flip
                      back face-down
                    </li>
                    <li>
                      <strong>Memory Challenge:</strong> Remember card positions
                      to match pairs efficiently
                    </li>
                    <li>
                      <strong>Limited Flips:</strong> You have a set number of
                      flips based on grid size
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Grid Sizes & Multipliers
                  </h3>
                  <p className="mb-2">
                    Choose your difficulty level based on the grid size:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>2×2 Grid:</strong> 2 pairs, 2 flips - 1.2×
                      multiplier (Beginner)
                    </li>
                    <li>
                      <strong>4×4 Grid:</strong> 8 pairs, 13 flips - 1.5×
                      multiplier (Easy)
                    </li>
                    <li>
                      <strong>6×6 Grid:</strong> 18 pairs, 25 flips - 2.0×
                      multiplier (Medium)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Performance & Scoring
                  </h3>
                  <p className="mb-2">
                    Your success is measured by matched pairs and flip
                    efficiency:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Matched Pairs:</strong> Each successfully matched
                      pair contributes to your score
                    </li>
                    <li>
                      <strong>Total Pairs:</strong> The number of pairs in your
                      selected grid
                    </li>
                    <li>
                      <strong>Wrong Flips:</strong> Incorrect matches count
                      against your performance
                    </li>
                    <li>
                      <strong>Perfect Game:</strong> Match all pairs within the
                      flip limit for maximum reward
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Reward Calculation</h3>
                  <p className="mb-2">
                    Your reward is calculated proportionally based on your
                    performance:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Formula:</strong> Reward = Stake Amount × Grid
                      Multiplier × (Matched Pairs ÷ Total Pairs)
                    </li>
                    <li>
                      <strong>Proportional System:</strong> Even partial
                      completions earn proportional rewards
                    </li>
                    <li>
                      <strong>Example (8×8):</strong> 10 MNT stake, match all 32
                      pairs = 25 MNT reward (15 MNT profit)
                    </li>
                    <li>
                      <strong>Example (4×4):</strong> 5 MNT stake, match 4/8
                      pairs = 3.75 MNT reward
                    </li>
                    <li>
                      <strong>Net Gain:</strong> Your profit/loss after
                      deducting the initial stake
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Claiming Your Reward
                  </h3>
                  <p className="mb-2">After the game ends:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Withdraw Reward:</strong> Claim your calculated
                      reward from the prize pool based on matched pairs
                    </li>
                    <li>
                      <strong>Partial Rewards:</strong> Even if you don't match
                      all pairs, you receive proportional rewards
                    </li>
                    <li>
                      <strong>No Matches:</strong> If no pairs are matched, no
                      reward is earned
                    </li>
                    <li>
                      All transactions are processed through the smart contract
                      on Mantle Sepolia
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Fair Play Principles
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Memory-Based:</strong> Outcomes depend entirely on
                      your memory skills and strategy
                    </li>
                    <li>
                      <strong>Deterministic Rewards:</strong> Your matched pairs
                      directly determine your reward—no randomness
                    </li>
                    <li>
                      <strong>Equal Opportunity:</strong> All players face the
                      same card layouts and flip limits
                    </li>
                    <li>
                      <strong>Transparent:</strong> All game logic and reward
                      calculations are verifiable on-chain
                    </li>
                    <li>
                      <strong>Prize Pool Funded:</strong> Rewards come from an
                      owner-funded prize pool ensuring sustainability
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Strategy Tips</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Start with smaller grids (2×2 or 4×4) to practice</li>
                    <li>
                      Pay close attention to card positions when they flip
                    </li>
                    <li>
                      Develop a systematic approach to revealing cards (e.g.,
                      row by row)
                    </li>
                    <li>
                      Larger grids offer higher multipliers but are harder
                    </li>
                    <li>Take your time to memorize patterns before rushing</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedGame === "tappo" && (
              <div className={`space-y-4 ${textColor}`}>
                {/* Game Header with Logo and Title */}
                <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-black">
                  {/* Game Logo */}
                  <div className="shrink-0">
                    <img
                      src="/images/tappo-logo.jpeg"
                      alt="Tappo Logo"
                      className="w-24 h-24 object-cover rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  {/* Title and Description */}
                  <div className="flex-1">
                    <h2
                      className={`text-3xl font-bold mb-3 ${textColor} font-Tsuchigumo`}
                    >
                      Tappo - Tap to Win
                    </h2>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Reflex game - tap bubbles matching the target number
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Game Objective</h3>
                  <p>
                    Tappo is a skill-based reflex game where you tap bubbles
                    matching a target number to maximize your score within a
                    time limit. Your performance directly determines your
                    rewards.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Connect Wallet:</strong> Ensure your wallet is
                      connected to Mantle Sepolia testnet
                    </li>
                    <li>
                      <strong>Select Duration:</strong> Choose your game
                      duration (15s, 30s, or 60s)
                    </li>
                    <li>
                      <strong>Stake Amount:</strong> Enter your MNT stake amount
                      to participate
                    </li>
                    <li>
                      <strong>Start Game:</strong> Click "Start Game" to begin
                      and deposit your stake into the smart contract
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Gameplay Mechanics</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Target Display:</strong> A target number (0-9) is
                      shown at the top of the game board
                    </li>
                    <li>
                      <strong>Bubble Grid:</strong> Bubbles displaying random
                      digits (0-9) appear on the board
                    </li>
                    <li>
                      <strong>Correct Tap:</strong> Tap any bubble matching the
                      target number to score +10 points
                    </li>
                    <li>
                      <strong>Auto-Reshuffle:</strong> After each correct hit,
                      all bubbles reshuffle with new random numbers
                    </li>
                    <li>
                      <strong>Wrong Tap:</strong> Tapping an incorrect bubble
                      deducts -5 points (score cannot go below 0)
                    </li>
                    <li>
                      <strong>Timer:</strong> The countdown timer tracks your
                      remaining time
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Scoring & Performance
                  </h3>
                  <p className="mb-2">
                    Your final score reflects your skill through accuracy and
                    speed:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Each correct hit: +10 points</li>
                    <li>Each incorrect tap: -5 points (minimum 0)</li>
                    <li>
                      Performance is measured by total score achieved during
                      gameplay
                    </li>
                    <li>Higher scores result in better rewards</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Difficulty & Multipliers
                  </h3>
                  <p className="mb-2">
                    Choose your difficulty level based on the timer duration:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>15 seconds:</strong> 2.0× multiplier (Hard - less
                      time, higher potential reward)
                    </li>
                    <li>
                      <strong>30 seconds:</strong> 1.6× multiplier (Medium -
                      balanced difficulty)
                    </li>
                    <li>
                      <strong>60 seconds:</strong> 1.3× multiplier (Easy - more
                      time, moderate reward)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Reward Calculation</h3>
                  <p className="mb-2">
                    Your reward is calculated transparently based on your
                    performance:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Formula:</strong> Reward = Stake Amount ×
                      Difficulty Multiplier × Performance Ratio
                    </li>
                    <li>
                      <strong>Performance Ratio:</strong> Your score divided by
                      target score (capped at 1.0). Scoring above the target
                      score doesn't increase rewards beyond the maximum
                      multiplier
                    </li>
                    <li>
                      <strong>Example:</strong> 1 MNT stake, 30s duration
                      (1.6×), 50% performance = 0.8 MNT reward
                    </li>
                    <li>
                      <strong>Net Gain:</strong> Your profit/loss after
                      deducting the initial stake
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Claiming Your Reward
                  </h3>
                  <p className="mb-2">
                    After the timer expires, rewards are based on your score:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Profit (Score &gt; Break-Even):</strong> Withdraw
                      your reward if you scored above the break-even threshold.
                      You earn more than your initial stake!
                    </li>
                    <li>
                      <strong>Break-Even (Score = Threshold):</strong> Receive
                      your full stake back with no profit or loss.
                    </li>
                    <li>
                      <strong>
                        Partial Refund (0 &lt; Score &lt; Break-Even):
                      </strong>{" "}
                      Get back a portion of your stake proportional to your
                      score. The better you perform, the more you recover.
                    </li>
                    <li>
                      <strong>No Score (Score = 0):</strong> If you score 0
                      points, no reward is earned and your stake is lost.
                    </li>
                    <li>
                      All withdrawals are processed instantly through the smart
                      contract on Mantle Sepolia.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Fair Play Principles
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Skill-Based:</strong> Outcomes depend entirely on
                      your reflexes and accuracy
                    </li>
                    <li>
                      <strong>Deterministic Rewards:</strong> No randomness in
                      reward calculation—your score determines your reward
                    </li>
                    <li>
                      <strong>Equal Difficulty:</strong> Responsive design
                      ensures consistent gameplay across all devices
                    </li>
                    <li>
                      <strong>Transparent:</strong> All game logic and reward
                      formulas are verifiable on-chain
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Strategy Tips</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Prioritize accuracy over speed to avoid penalties</li>
                    <li>
                      Shorter durations offer higher multipliers but require
                      faster reflexes
                    </li>
                    <li>Watch for the brief freeze after correct hits</li>
                    <li>
                      Practice with longer durations before attempting hard mode
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowRules(false)}
              className={`mt-6 w-full py-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer text-xl font-bold`}
              style={{
                backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                color: "#000000",
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
