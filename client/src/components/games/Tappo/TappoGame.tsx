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
  const [showBonus, setShowBonus] = useState(false);

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

  // Fixed bubble count (12 columns × 7 rows = 84 bubbles)
  const bubbleCount = 84;

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

      // Visual feedback
      setShowBonus(true);
      setTimeout(() => {
        setShowBonus(false);
      }, 600);

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

  // Calculate max achievable points
  const maxAchievablePoints = Math.floor((timerDuration * 6) / 10) * 10; // 6 hits per 10 seconds, 10 points each

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Controls (1/3 width) */}
        <div className="space-y-6 lg:col-span-1">
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

          {/* Game Stats - Always visible */}
          <div
            className={`p-6 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] min-h-[200px]`}
          >
            <h3 className={`text-xl font-medium mb-4 ${textColor}`}>
              Game Stats
            </h3>
            <div className="space-y-3">
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
                <span>Max Achievable Points:</span>
                <span
                  className="font-bold"
                  style={{
                    color: isDarkMode ? "#0fa594" : "#000000",
                    fontWeight: "bolder",
                  }}
                >
                  {maxAchievablePoints} points
                </span>
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
          </div>
        </div>

        {/* Right Column - Game Board (2/3 width) */}
        <div
          className={`lg:col-span-2 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6 flex flex-col max-h-[800px]`}
        >
          {/* Stats Header - shown in both idle and playing states */}
          <div className="flex justify-around items-center mb-4 gap-4">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${textColor}`}>Timer</span>
              <div
                className={`px-6 py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-2xl font-bold min-w-[60px] text-center`}
                style={{
                  backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                  color: isDarkMode ? "#ffffff" : "#000000",
                }}
              >
                {gameStatus === "idle" ? "0" : currentTimer}
              </div>
            </div>

            {/* Hit Target */}
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${textColor}`}>Hit</span>
              <div
                className={`px-6 py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-2xl font-bold min-w-[60px] text-center`}
                style={{
                  backgroundColor:
                    gameStatus === "idle"
                      ? isDarkMode
                        ? "#1d505c"
                        : "#F4F9E9"
                      : isDarkMode
                      ? "#0fa594"
                      : "#FCFF51",
                  color:
                    gameStatus === "idle"
                      ? isDarkMode
                        ? "#ffffff"
                        : "#000000"
                      : "#000000",
                }}
              >
                {gameStatus === "idle" ? "-" : hitTarget}
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${textColor}`}>Score</span>
              <div className="relative">
                <div
                  className={`px-6 py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-2xl font-bold min-w-[60px] text-center transition-all ${
                    shakeScore ? "animate-shake" : ""
                  }`}
                  style={{
                    backgroundColor: shakeScore
                      ? "#fecaca"
                      : isDarkMode
                      ? "#1d505c"
                      : "#F4F9E9",
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }}
                >
                  {gameStatus === "idle" ? "0" : score}
                </div>
                {showPenalty && (
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg animate-fade-up"
                    style={{ animation: "fadeUp 0.6s ease-out" }}
                  >
                    -5
                  </span>
                )}
                {showBonus && (
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-green-500 font-bold text-lg animate-fade-up"
                    style={{ animation: "fadeUp 0.6s ease-out" }}
                  >
                    +10
                  </span>
                )}
              </div>
            </div>
          </div>

          {gameStatus === "idle" && (
            <div className="flex items-center justify-center flex-1">
              <div
                className="grid gap-2 w-full h-full overflow-y-auto pr-2"
                style={{
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
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
            </div>
          )}

          {gameStatus === "playing" && (
            <div className="flex items-center justify-center flex-1">
              <div
                className="grid gap-2 w-full h-full overflow-y-auto pr-2"
                style={{
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  maxHeight: "600px",
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
