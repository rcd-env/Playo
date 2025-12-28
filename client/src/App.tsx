import { useEffect, useState, useRef } from "react";
import { Moon, Sun, Info, Play } from "lucide-react";
import { WalletConnect } from "./components/wallet-connect";
import { ErrorNotification } from "./components/ErrorNotification";
import { Sidebar } from "./components/Sidebar";
import { FlippoGame } from "./components/games/Flippo/FlippoGame";
import { TappoGame } from "./components/games/Tappo/TappoGame";
import { SimonGame } from "./components/games/Simon/SimonGame";
import { usePlayoGame } from "./hooks/usePlayoGame";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [selectedGame, setSelectedGame] = useState("flippo");
  const [showRules, setShowRules] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Apply theme to document for scrollbar styling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  // Delay video playback when demo modal opens
  useEffect(() => {
    if (showDemoVideo && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current?.play();
      }, 500); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [showDemoVideo, selectedGame]);

  const { address, isLoading, transactionError } = usePlayoGame();

  const bgColor = isDarkMode ? "bg-[#3C1F47]" : "bg-[#FFFFFF]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";

  // Map games to their demo videos
  const demoVideos: { [key: string]: string } = {
    flippo: "/videos/flippo-demo.mp4",
    tappo: "/videos/tappo-demo.mp4",
    simon: "/videos/simono-demo.mp4",
  };

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

            {/* Center Buttons Group */}
            <div className="flex items-center gap-4">
              {/* Game Info Button */}
              <button
                onClick={() => setShowRules(true)}
                className={`px-6 py-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer flex items-center gap-2 ${textColor}`}
                style={{
                  backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                }}
              >
                <Info className="w-5 h-5" />
                <span className="font-semibold">Game Info</span>
              </button>

              {/* Demo Video Button */}
              <button
                onClick={() => setShowDemoVideo(true)}
                className={`px-6 py-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer flex items-center gap-2 ${textColor}`}
                style={{
                  backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                }}
              >
                <Play className="w-5 h-5" />
                <span className="font-semibold">Demo Video</span>
              </button>
            </div>

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

          {selectedGame === "simon" && (
            <SimonGame
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

            {selectedGame === "simon" && (
              <div className={`space-y-4 ${textColor}`}>
                {/* Game Header with Logo and Title */}
                <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-black">
                  {/* Game Logo */}
                  <div className="shrink-0">
                    <img
                      src="/images/simono-logo.png"
                      alt="Simono Logo"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  {/* Title and Description */}
                  <div className="flex-1">
                    <h2
                      className={`text-3xl font-bold mb-3 ${textColor} font-Tsuchigumo`}
                    >
                      Simono - Choose Your Fate
                    </h2>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Pure sequential memory - watch the new signal, remember
                      the entire sequence
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Game Objective</h3>
                  <p>
                    Simon is a pure sequential memory challenge where only the
                    newly added signal is shown each round. You must remember
                    and input the entire growing sequence from memory. Your
                    focus and recall ability directly determine your rewards.
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
                      <strong>Select Difficulty:</strong> Choose from Easy,
                      Medium, or Hard difficulty levels
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
                      <strong>Round 1:</strong> Watch the first colored signal
                      (Red, Blue, Green, or Yellow), then repeat it
                    </li>
                    <li>
                      <strong>Each New Round:</strong> Only the newly added
                      signal is shown—no full sequence replay
                    </li>
                    <li>
                      <strong>Sequential Input:</strong> You must input the
                      entire sequence from memory, in correct order
                    </li>
                    <li>
                      <strong>Input Timer:</strong> You have base time + time
                      per signal to complete the full sequence (e.g., Round 5 =
                      longer time than Round 2)
                    </li>
                    <li>
                      <strong>Level Progress:</strong> Successfully completing a
                      sequence advances you to the next level with +1 signal
                    </li>
                    <li>
                      <strong>Game Over:</strong> Any incorrect signal or
                      timeout ends the game immediately—no partial credit
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Difficulty Levels & Multipliers
                  </h3>
                  <p className="mb-2">
                    Difficulty affects signal speed, total time, and per-input
                    pressure:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Easy:</strong> 1s signal display, 1.2s max per
                      input - 1.3× multiplier, target 16 levels
                    </li>
                    <li>
                      <strong>Medium:</strong> 0.7s signal display, 0.9s max per
                      input - 1.6× multiplier, target 12 levels
                    </li>
                    <li>
                      <strong>Hard:</strong> 0.5s signal display, 0.6s max per
                      input - 2.0× multiplier, target 8 levels
                    </li>
                  </ul>
                  <p className="mt-2">
                    <strong>Note:</strong> Total time scales sub-linearly (early
                    levels are forgiving, late levels get tighter). After level
                    5, per-input timeout reduces every 2 levels for increased
                    pressure.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Scoring & Performance
                  </h3>
                  <p className="mb-2">
                    Your score equals the highest level (sequence length) you
                    successfully completed:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Score = Levels Completed:</strong> Each correct
                      full sequence = +1 level
                    </li>
                    <li>
                      <strong>No Partial Credit:</strong> Incomplete sequences
                      or wrong inputs don't count
                    </li>
                    <li>
                      <strong>One Strike Rule:</strong> First mistake or timeout
                      ends the game permanently
                    </li>
                    <li>
                      <strong>Visual Feedback:</strong> Wrong inputs flash red
                      before game ends
                    </li>
                    <li>
                      <strong>No Retries:</strong> Each game session allows only
                      one attempt—no continues
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Timing & Pressure Mechanics
                  </h3>
                  <p className="mb-2">
                    Advanced timing system creates skill-based challenge:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Per-Input Timeout:</strong> Each click must happen
                      within the max time limit (1.2s Easy, 0.9s Medium, 0.6s
                      Hard) or game ends
                    </li>
                    <li>
                      <strong>Sub-Linear Scaling:</strong> Total time grows
                      slower than sequence length—early levels are generous,
                      late levels demand efficiency
                    </li>
                    <li>
                      <strong>Late-Game Pressure Ramp:</strong> After level 5,
                      per-input timeout shrinks by ~8-12% every 2 levels
                    </li>
                    <li>
                      <strong>Execution Matters:</strong> Can't hesitate on late
                      levels—memorization alone isn't enough
                    </li>
                    <li>
                      <strong>Hard Mode Ramps Fastest:</strong> High risk, high
                      reward—pressure increases more aggressively
                    </li>
                  </ul>
                  <p className="mt-2">
                    <strong>Why This Matters:</strong> Prevents consistent
                    profit by making execution under pressure the real
                    challenge, not just memory.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Reward Calculation</h3>
                  <p className="mb-2">
                    Your reward is calculated proportionally and capped at the
                    maximum multiplier:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Formula:</strong> Reward = Stake Amount ×
                      Difficulty Multiplier × Performance Ratio
                    </li>
                    <li>
                      <strong>Performance Ratio:</strong> Your score divided by
                      the target score (capped at 1.0)
                    </li>
                    <li>
                      <strong>Target Scores:</strong> Easy = 16 levels, Medium =
                      12 levels, Hard = 8 levels
                    </li>
                    <li>
                      <strong>Example (Medium):</strong> 5 MNT stake, 12/12
                      levels = 8 MNT reward (3 MNT profit)
                    </li>
                    <li>
                      <strong>Example (Hard):</strong> 10 MNT stake, 6/8 levels
                      = 15 MNT reward (5 MNT profit)
                    </li>
                    <li>
                      <strong>Reward Cap:</strong> Scoring above the target
                      doesn't increase rewards beyond the maximum
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Claiming Your Reward
                  </h3>
                  <p className="mb-2">
                    After the game ends, rewards are based on your final score:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Proportional Rewards:</strong> Even if you don't
                      reach the target score, you receive proportional rewards
                      based on your progress
                    </li>
                    <li>
                      <strong>Perfect Performance:</strong> Reaching or
                      exceeding the target score earns the maximum multiplier
                    </li>
                    <li>
                      <strong>Zero Score:</strong> If you score 0 (fail on first
                      sequence), no reward is earned
                    </li>
                    <li>
                      <strong>Instant Settlement:</strong> All transactions are
                      processed through the smart contract on Mantle Sepolia
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Fair Play Principles
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Skill-Based Only:</strong> Outcomes depend
                      entirely on your memory and focus—no luck involved
                    </li>
                    <li>
                      <strong>Deterministic Sequences:</strong> Sequences are
                      generated at game start using a deterministic algorithm
                    </li>
                    <li>
                      <strong>No Mid-Game Changes:</strong> No randomness
                      affects rewards after the sequence is generated
                    </li>
                    <li>
                      <strong>Equal Challenge:</strong> Same rules and mechanics
                      apply across all devices and sessions
                    </li>
                    <li>
                      <strong>Transparent Rewards:</strong> All reward
                      calculations are verifiable on-chain
                    </li>
                    <li>
                      <strong>No Cashout Tricks:</strong> No double-or-nothing
                      or mid-game cashout mechanics
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Strategy Tips</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      Start with Easy to learn sequential memory and timing
                      mechanics
                    </li>
                    <li>
                      Focus intensely on each new signal—you won't see it again
                    </li>
                    <li>
                      Build mental patterns: group colors, create stories, or
                      use spatial memory
                    </li>
                    <li>
                      Practice speed—after level 5, hesitation becomes dangerous
                    </li>
                    <li>
                      Input with rhythm and confidence—consistent timing reduces
                      mistakes
                    </li>
                    <li>
                      Train muscle memory for color positions to speed up
                      execution
                    </li>
                    <li>
                      Eliminate distractions—late levels require perfect recall
                      AND fast execution
                    </li>
                    <li>
                      Hard mode offers 2× rewards but demands instant recall and
                      lightning-fast inputs
                    </li>
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

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDemoVideo(false)}
        >
          <div
            className="fixed inset-0 bg-black opacity-70"
            style={{ backdropFilter: "blur(4px)" }}
          />
          <div
            className={`relative max-w-4xl rounded-lg border ${borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6`}
            style={{
              backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            {/* <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-2xl font-bold ${textColor} font-Tsuchigumo capitalize`}
              >
                {selectedGame} Demo
              </h2>
              <button
                onClick={() => setShowDemoVideo(false)}
                className={`p-2 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer`}
                style={{
                  backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                }}
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div> */}

            {/* Video Player */}
            <div className="my-3">
              <video
                ref={videoRef}
                key={selectedGame}
                loop
                playsInline
                preload="auto"
                className="rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                style={{ maxHeight: "70vh" }}
                src={demoVideos[selectedGame]}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <button
              onClick={() => setShowDemoVideo(false)}
              className={`mt-4 w-full py-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer text-xl font-bold`}
              style={{
                backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                color: "#000000",
              }}
            >
              Gotcha!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
