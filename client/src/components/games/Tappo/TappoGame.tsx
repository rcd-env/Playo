import { useState, useEffect, useRef } from "react";
import { GameResult } from "../../GameResult";
import { useMemoryGame } from "../../../hooks/useMemoryGame";

interface TappoGameProps {
  isDarkMode: boolean;
  address: string | undefined;
  isLoading: boolean;
}

export function TappoGame({ isDarkMode, address, isLoading }: TappoGameProps) {
  const [gameStatus, setGameStatus] = useState<
    "idle" | "playing" | "completed"
  >("idle");
  const [currentTimer, setCurrentTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [hitTarget, setHitTarget] = useState(0);
  const [bubbles, setBubbles] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState("0.00");
  const [timerDuration, setTimerDuration] = useState(30);
  const [isInputFrozen, setIsInputFrozen] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [shakeScore, setShakeScore] = useState(false);

  // Audio refs
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  const {
    startGame: depositFunds,
    withdrawWinnings,
    resetGame,
  } = useMemoryGame();

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "bg-[#1d505c]" : "bg-[#F4F9E9]";

  // Initialize audio
  useEffect(() => {
    successSound.current = new Audio("/audios/success.mp3");
    errorSound.current = new Audio("/audios/error.mp3");
    successSound.current.volume = 0.5;
    errorSound.current.volume = 0.5;
  }, []);

  // Fixed bubble count
  const bubbleCount = 48;

  // Get win multiplier based on timer duration
  const getWinMultiplier = () => {
    switch (timerDuration) {
      case 15:
        return 2.0; // Hard - less time, higher reward
      case 30:
        return 1.6; // Medium
      case 60:
        return 1.3; // Easy - more time, lower reward
      default:
        return 1.6;
    }
  };

  // Generate random bubbles
  const generateBubbles = () => {
    const newBubbles: number[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push(Math.floor(Math.random() * 10));
    }
    setBubbles(newBubbles);
  };

  // Generate new hit target
  const generateNewHit = () => {
    setHitTarget(Math.floor(Math.random() * 10));
  };

  // Generate initial bubbles on mount
  useEffect(() => {
    generateBubbles();
  }, []);

  // Start game
  const startGame = async () => {
    try {
      // Deposit funds first
      await depositFunds();

      setGameStatus("playing");
      setCurrentTimer(timerDuration);
      setScore(0);
      setIsInputFrozen(false);
      generateBubbles();
      generateNewHit();
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gameStatus === "playing" && currentTimer > 0) {
      const interval = setInterval(() => {
        setCurrentTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (currentTimer === 0 && gameStatus === "playing") {
      setGameStatus("completed");
    }
  }, [gameStatus, currentTimer]);

  // Handle bubble click
  const handleBubbleClick = (clickedNumber: number) => {
    if (gameStatus !== "playing" || isInputFrozen) return;

    if (clickedNumber === hitTarget) {
      // Correct hit
      setScore((prev) => prev + 10);

      // Play success sound
      successSound.current?.play().catch(() => {});

      // Freeze input before reshuffle
      setIsInputFrozen(true);

      // Random delay between 150-250ms
      const delay = 150 + Math.random() * 100;

      setTimeout(() => {
        generateBubbles();
        generateNewHit();
        setIsInputFrozen(false);
      }, delay);
    } else {
      // Wrong click penalty: -5 points (but don't go below 0)
      setScore((prev) => Math.max(0, prev - 5));

      // Play error sound
      errorSound.current?.play().catch(() => {});

      // Visual feedback
      setShowPenalty(true);
      setShakeScore(true);

      setTimeout(() => {
        setShowPenalty(false);
        setShakeScore(false);
      }, 600);
    }
  };

  // Calculate actual reward based on score
  const calculateReward = () => {
    const baseBet = parseFloat(betAmount);
    const multiplier = getWinMultiplier();
    // Reward formula: betAmount * multiplier * performanceRatio
    const maxPossibleScore = timerDuration * 6; // Assume 6 successful clicks per 10 seconds
    const performanceRatio = Math.min(score / maxPossibleScore, 1); // Cap at 1
    return (baseBet * multiplier * performanceRatio).toFixed(4);
  };

  // Calculate net gain
  const netGain =
    score > 0
      ? parseFloat(calculateReward()) - parseFloat(betAmount)
      : -parseFloat(betAmount || "0");

  // Calculate potential reward (max possible)
  const maxReward = (parseFloat(betAmount || "0") * getWinMultiplier()).toFixed(
    2
  );

  // Play hover sound
  const playHoverSound = () => {
    const hoverSound = new Audio("/audios/hover.mp3");
    hoverSound.volume = 1;
    hoverSound.play().catch(() => {});
  };

  // Handle play again
  const handlePlayAgain = () => {
    resetGame();
    setGameStatus("idle");
    setScore(0);
    setCurrentTimer(timerDuration);
    setIsInputFrozen(false);
  };

  // Handle withdraw
  const handleWithdraw = () => {
    if (score > 0) {
      withdrawWinnings(calculateReward());
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Timer & Bet Amount in Same Row */}
          <div className="flex gap-4">
            {/* Timer Selector - 1/3 width */}
            <div className="w-1/3">
              <label className={`block text-lg font-medium mb-3 ${textColor}`}>
                Timer
              </label>
              <select
                value={timerDuration}
                onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                disabled={gameStatus !== "idle"}
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
              >
                <option value="60">60s</option>
                <option value="30">30s</option>
                <option value="15">15s</option>
              </select>
            </div>

            {/* Bet Amount Input - 2/3 width */}
            <div className="w-2/3">
              <label className={`block text-lg font-medium mb-3 ${textColor}`}>
                Place Your Bet
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={gameStatus !== "idle"}
                placeholder="0.00"
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none 
                disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
              />
            </div>
          </div>

          {/* Quick Bets */}
          <div>
            <p className={`text-md font-semibold mb-2 ${textColor}`}>
              Quick Bets:
            </p>
            <div className="flex flex-wrap gap-2">
              {["0.01", "0.5", "2", "5", "10"].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameStatus !== "idle"}
                  className={`px-4 py-2 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed`}
                  style={{
                    backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#0fa594"
                      : "#FCFF51";
                    e.currentTarget.style.color = "black";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#1d505c"
                      : "#F4F9E9";
                    e.currentTarget.style.color = "";
                  }}
                >
                  {amount}MNT
                </button>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <button
            onClick={startGame}
            disabled={
              !address ||
              !betAmount ||
              parseFloat(betAmount) <= 0 ||
              gameStatus !== "idle"
            }
            className={`w-full py-4 rounded-lg border ${borderColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 hover:shadow-none hover:translate-x-1 hover:translate-y-1`}
            style={{
              backgroundColor:
                !address ||
                !betAmount ||
                parseFloat(betAmount) <= 0 ||
                gameStatus !== "idle"
                  ? isDarkMode
                    ? "#5fb5ad"
                    : "#FCFBA7"
                  : isDarkMode
                  ? "#0fa594"
                  : "#FCFF51",
              color: "#000000",
            }}
          >
            {!address
              ? "Wallet Not Connected"
              : gameStatus === "playing"
              ? "Game in Progress"
              : "Start Game"}
          </button>

          {/* Game Stats */}
          <div
            className={`p-6 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] min-h-[200px]`}
          >
            <h3 className={`text-xl font-medium mb-4 ${textColor}`}>
              {gameStatus === "idle" ? "Game Stats" : "Game Progress"}
            </h3>

            {gameStatus === "idle" && (
              <div className="space-y-3">
                <p className="text-sm opacity-70">
                  Click matching bubbles to score points!
                </p>
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span className="font-bold">{timerDuration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Multiplier:</span>
                  <span className="font-bold">{getWinMultiplier()}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Points per Hit:</span>
                  <span className="font-bold">10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Potential Reward:</span>
                  <span
                    className="font-bold"
                    style={{
                      color: isDarkMode ? "#0fa594" : "#000000",
                      fontWeight: "bolder",
                    }}
                  >
                    {maxReward} MNT
                  </span>
                </div>
              </div>
            )}

            {gameStatus === "playing" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Target:</span>
                  <div
                    className={`w-16 h-16 rounded-2xl border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center text-2xl font-bold`}
                    style={{
                      backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                      color: "#000000",
                    }}
                  >
                    {hitTarget}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg">Time:</span>
                  <span className="text-2xl font-bold">{currentTimer}s</span>
                </div>
                <div className="flex justify-between items-center relative">
                  <span className="text-lg">Score:</span>
                  <div className="relative">
                    <span
                      className={`text-2xl font-bold transition-all ${
                        shakeScore ? "animate-shake" : ""
                      }`}
                      style={{
                        color: shakeScore
                          ? "#ef4444"
                          : isDarkMode
                          ? "#0fa594"
                          : "#000000",
                        fontWeight: "bolder",
                      }}
                    >
                      {score}
                    </span>
                    {showPenalty && (
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg animate-fade-up"
                        style={{ animation: "fadeUp 0.6s ease-out" }}
                      >
                        -5
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Game Board */}
        <div
          className={`rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6 flex items-center justify-center max-h-[800px]`}
        >
          {gameStatus === "idle" && (
            <div
              className="grid gap-2 w-full h-full overflow-y-auto pr-2"
              style={{
                gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                maxHeight: "700px",
              }}
            >
              {bubbles.map((number, index) => (
                <div
                  key={index}
                  onMouseEnter={playHoverSound}
                  className={`aspect-square rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center text-xl font-bold cursor-not-allowed opacity-80`}
                  style={{
                    backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
                    color: textColor === "text-white" ? "white" : "#000000",
                  }}
                >
                  {number}
                </div>
              ))}
            </div>
          )}

          {gameStatus === "playing" && (
            <div
              className="grid gap-2 w-full h-full overflow-y-auto pr-2"
              style={{
                gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
                maxHeight: "700px",
              }}
            >
              {bubbles.map((number, index) => (
                <button
                  key={index}
                  onClick={() => handleBubbleClick(number)}
                  onMouseEnter={playHoverSound}
                  className={`aspect-square rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center text-xl font-bold cursor-pointer`}
                  style={{
                    backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
                    color: textColor === "text-white" ? "white" : "#000000",
                  }}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Game Result Modal */}
      {gameStatus === "completed" && (
        <GameResult
          won={score > 0}
          reward={calculateReward()}
          betAmount={betAmount}
          matchesFound={score}
          totalPairs={bubbleCount}
          correctPairs={score}
          wrongPairs={0}
          netGain={netGain}
          onPlayAgain={handlePlayAgain}
          onWithdraw={handleWithdraw}
          isWithdrawing={isLoading}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}
