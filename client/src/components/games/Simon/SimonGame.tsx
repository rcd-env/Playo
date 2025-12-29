import { useState, useEffect, useRef, useCallback } from "react";
import { GameResult } from "../../GameResult";
import { usePlayoGame } from "../../../hooks/usePlayoGame";

interface SimonGameProps {
  isDarkMode: boolean;
  address: string | undefined;
  isLoading: boolean;
}

type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "idle" | "starting" | "showing" | "input" | "completed";

interface DifficultyConfig {
  playbackSpeed: number; // milliseconds for signal display
  baseInputTime: number; // base seconds for total input
  timePerSignal: number; // additional seconds per signal in sequence
  rewardMultiplier: number;
  targetScore: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    playbackSpeed: 1000,
    baseInputTime: 5,
    timePerSignal: 1.5,
    rewardMultiplier: 1.3,
    targetScore: 16,
  },
  medium: {
    playbackSpeed: 700,
    baseInputTime: 4,
    timePerSignal: 1,
    rewardMultiplier: 1.6,
    targetScore: 12,
  },
  hard: {
    playbackSpeed: 500,
    baseInputTime: 3,
    timePerSignal: 0.7,
    rewardMultiplier: 2.0,
    targetScore: 8,
  },
};

const COLORS = [
  { id: 0, name: "Red", bg: "#FF4757", active: "#EE3344", border: "#000000" },
  {
    id: 1,
    name: "Green",
    bg: "#2ECC71",
    active: "#27AE60",
    border: "#000000",
  },
  {
    id: 2,
    name: "Yellow",
    bg: "#FFD93D",
    active: "#FFC107",
    border: "#000000",
  },
  { id: 3, name: "Blue", bg: "#1E90FF", active: "#0077ED", border: "#000000" },
];

export function SimonGame({ isDarkMode, address, isLoading }: SimonGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [completedInputs, setCompletedInputs] = useState(0); // Track completed inputs for display
  const [currentLevelLength, setCurrentLevelLength] = useState(1); // Track current level length for display
  const [activeSignal, setActiveSignal] = useState<number | null>(null);
  const [wrongSignal, setWrongSignal] = useState<number | null>(null);
  const [inputTimer, setInputTimer] = useState(0);
  const [gameStartPending, setGameStartPending] = useState(false);
  const [failureReason, setFailureReason] = useState<
    "timeout" | "wrong" | null
  >(null);
  const [earnedReward, setEarnedReward] = useState("0");
  const [netGain, setNetGain] = useState(0);

  // Audio refs
  const signalSounds = useRef<HTMLAudioElement[]>([]);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  const {
    startGame,
    betAmount,
    gameStatus,
    updateBetAmount,
    withdrawWinnings,
    resetGame,
    endGame,
    handleConfirmation,
    isLoading: isTransactionLoading,
    isConfirmed,
  } = usePlayoGame();

  const config = DIFFICULTY_CONFIGS[difficulty];
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "bg-[#1d505c]" : "bg-[#F4F9E9]";

  // Initialize audio
  useEffect(() => {
    // Create signal sounds for each color
    signalSounds.current = [0, 1, 2, 3].map(() => {
      const audio = new Audio();
      // Simple beep sound using data URL
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyAzO/bfzgJGGS37O2iUhMMP5zm9MJrIwU8kdbyynUqBSZ7x/DbmDwMFWGz7OSbTQwMUpvm88dhIQQrhcrt3IMwChljudvvpFITDEGd5vS/bCEFOpHX88p0KgUmfMjv3JY8DBVis+zmnkwNDFKa5/PEYSEEKoTK7d6DMQoZZLnb76JUEww/nef0wGwiBTuR1/PKdSoFJn3I79yUOwwUYrTs5p5MDAxRnObzw2EhBCqEyu3eg40oCRhjttvvoVMUDD+d5/TAbSIFO5HY88t2KwUlgMjv3JI9CRBJW9vm9MJrIwU6kdbyynUrBSV/x/DbmDsMFWGz7OSbTQwMUpvn88dhIQQrhMrt3oNMCBhju9vvpFITDD+d5/TAbCIFOpHX88p1KgUmfMjv3JY8DBVhs+zmnkwNDFGc5/PEYCEFKoTK7t6CMwkZZbna8aFSEwxAnOf0wG0jBTuR1/PKdSoFJn3I8NuVPAsVYrPs5p5MDQxRnOfzw2EhBSqEyu3eg00IGGOz3O+kUBMMP5zm88FsIgU7ktfyyXcpBSR/x+/blzwME2G07OSaTg0MUpvm88ViIAUrh8vt3oJMCBhju9zvpVITCkCb5/PAbiEEO5HX8sp1KgUmfMjw25k7DRVisuzmnk4MDFKb5/PGYCEFKYXJrd6BTQkZZbbY7aNSEwxBm+b0wG0iBDiR1/PKdSoGJX/H8NuWOwsVYrTs5p5NDAxSm+byw2EhBCuDyu3eg0sKGWS52e+iUxIOQ5zn874wBjiS1/LJdisGJH3I8d2VOwsUYbTs5Z5MDQ1SmubzwmEhBSqEye3eg0wLGWS52/CiUxMLP5zn88BtIgQ5ktbzyXUrBSR/x/Damj0KEF+28+aOTg4NUJvl8sV1IAUrg8jt3YMrChhjudrvpVQSCz+d5vO/biMEOJLX8st5LAUje8jv25Y8CxZhtevlnksODVKb5vLDYSEFK4PJ7d2FTAoZYrnY8KNUEQs+nObzv20jBTiS1/PLdysFI37H8NuUOwwVYLTr5Z5MDg1Sm+Xyxm8gBiuEyu3dh00JGmS72O2kUxIMPpzm88FtIwU4ktfzy3cqBiR+xu3bljsLFWG06+WeTQ4MUprm88ViIgUohMvt3oJMCBhjudvvpVITDD+c5vPBbCIEOZLW8sl1KwUkfsjv25k8CxZhtOvlnUwODFKa5vPGYSEFKoPK7t6DTAoZY7jb76VTEgtBnObzwGwiCTqR1/PKdisFJH3H79uVOw0VYrPs5p5NDAxSmubzxGEhBSqFyu3eg0wKGWS52+6kUhIMPp3m88BtIwU6kdfzyncqBSR+x/DcljsLFWK07OWeTgwMUpvl88RhIQUrhMnt3oRNChhjudrvo1ITCj+d5vO/bCIGOZLW8st1KwYkfcfw25c7CxVhtOzmnksODFGb5vPEYCEEKoTK7d6FTwkXY7jb76RSEws/nef0v20iBDqR1/LLdyoFJHzH79yWPAsVYrLs5p5MDAxSmufzxGEhBCqEyu3eglQBCGA=`;
      audio.volume = 0.3;
      return audio;
    });

    successSound.current = new Audio("/audios/success.mp3");
    successSound.current.volume = 0.5;
    errorSound.current = new Audio("/audios/fail.mp3");
    errorSound.current.volume = 0.5;
  }, []);

  // Handle transaction confirmations
  useEffect(() => {
    handleConfirmation();
  }, [handleConfirmation]);

  // Initialize game when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && gameStartPending && gameStatus === "playing") {
      const seed = Date.now();
      const fullSequence: number[] = [];
      let currentSeed = seed;

      for (let i = 0; i < 50; i++) {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        const value = Math.floor((currentSeed / 233280) * COLORS.length);
        fullSequence.push(value);
      }

      setSequence(fullSequence);
      setScore(0);
      setPlayerInput([]);
      setGamePhase("showing");
      setGameStartPending(false);
    }
  }, [isConfirmed, gameStartPending, gameStatus]);

  // Handle game start
  const handleStartGame = () => {
    setGameStartPending(true);
    startGame();
  };

  // Play signal sound
  const playSignalSound = (signalId: number) => {
    if (signalSounds.current[signalId]) {
      signalSounds.current[signalId].currentTime = 0;
      signalSounds.current[signalId].play().catch(() => {});
    }
  };

  // Show only the NEW signal to player (not full sequence)
  useEffect(() => {
    if (gamePhase !== "showing") return;

    // Only show the newly added signal (the one at position 'score')
    const newSignalIndex = score;
    const signalId = sequence[newSignalIndex];

    // Show the new signal
    setActiveSignal(signalId);
    playSignalSound(signalId);

    setTimeout(() => {
      setActiveSignal(null);
      // Switch to input phase after showing the new signal
      setTimeout(() => {
        setGamePhase("input");
        setPlayerInput([]);
        setFailureReason(null);
        // Calculate input time with sub-linear scaling: base + perSignal × (sequenceLength ^ 0.7)
        const sequenceLength = score + 1;
        setCurrentLevelLength(sequenceLength); // Set current level length for display
        const totalInputTime =
          config.baseInputTime +
          config.timePerSignal * Math.pow(sequenceLength, 0.7);
        setInputTimer(totalInputTime);
        setCompletedInputs(0); // Reset completed inputs for new level
      }, 500);
    }, config.playbackSpeed);
  }, [gamePhase, score, sequence, config]);

  // Input timer countdown
  useEffect(() => {
    if (gamePhase !== "input") return;

    if (inputTimer <= 0) {
      // Time's up - player failed
      setFailureReason("timeout");
      if (errorSound.current) {
        errorSound.current.currentTime = 0;
        errorSound.current.play().catch(() => {});
      }

      const bet = parseFloat(betAmount);
      if (bet && bet > 0) {
        const performanceRatio = Math.min(score / config.targetScore, 1);
        const earned = bet * config.rewardMultiplier * performanceRatio;
        const net = earned - bet;
        setEarnedReward(earned.toFixed(4));
        setNetGain(net);
      }

      setGamePhase("completed");
      endGame();
      return;
    }

    const timer = setTimeout(() => {
      setInputTimer((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearTimeout(timer);
  }, [gamePhase, inputTimer, betAmount, score, config, endGame]);

  // No longer reset timer per input - timer runs continuously for entire sequence

  // Handle player input
  const handleSignalClick = (signalId: number) => {
    if (gamePhase !== "input" || gameStatus !== "playing") return;

    const newInput = [...playerInput, signalId];
    setPlayerInput(newInput);
    setActiveSignal(signalId);

    const currentSequence = sequence.slice(0, score + 1);
    const inputIndex = newInput.length - 1;

    // Check if input is correct
    if (newInput[inputIndex] !== currentSequence[inputIndex]) {
      // Wrong input - play error sound and show red flash
      setFailureReason("wrong");
      if (errorSound.current) {
        errorSound.current.currentTime = 0;
        errorSound.current.play().catch(() => {});
      }
      setTimeout(() => {
        setActiveSignal(null);
        setWrongSignal(signalId);
        // End game after brief visual feedback
        setTimeout(() => {
          setWrongSignal(null);
          handleMistake();
        }, 800);
      }, 200);
      return;
    }

    // Input is correct - play success sound
    if (successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(() => {});
    }
    setTimeout(() => setActiveSignal(null), 200);

    // Input is correct - update completed count for real-time progress
    setCompletedInputs(newInput.length);

    // Check if sequence is complete
    if (newInput.length === currentSequence.length) {
      // Sequence completed successfully
      const newScore = score + 1;
      setScore(newScore);
      setPlayerInput([]);

      // Calculate and update reward after each successful round
      calculateReward(newScore);

      // Show next sequence after a brief delay
      setTimeout(() => {
        setGamePhase("showing");
      }, 800);
    }
  };

  // Calculate reward based on performance
  const calculateReward = useCallback(
    (currentScore: number) => {
      const bet = parseFloat(betAmount);
      if (!bet || bet <= 0) return;

      const performanceRatio = Math.min(currentScore / config.targetScore, 1);
      const earned = bet * config.rewardMultiplier * performanceRatio;
      const net = earned - bet;

      setEarnedReward(earned.toFixed(4));
      setNetGain(net);
    },
    [betAmount, config]
  );

  // Handle mistake (wrong input or timeout)
  const handleMistake = useCallback(() => {
    // Calculate final reward
    calculateReward(score);

    setGamePhase("completed");
    endGame();
  }, [score, calculateReward, endGame]);

  // Handle reset
  const handleReset = () => {
    setGamePhase("idle");
    setSequence([]);
    setScore(0);
    setPlayerInput([]);
    setCompletedInputs(0);
    setCurrentLevelLength(1);
    setActiveSignal(null);
    setWrongSignal(null);
    setInputTimer(0);
    setFailureReason(null);
    setEarnedReward("0");
    setNetGain(0);
    setGameStartPending(false);
    resetGame();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Difficulty & Bet Amount in Same Row */}
          <div className="flex gap-4">
            {/* Difficulty Selector - 1/3 width */}
            <div className="w-1/3">
              <label className={`block text-lg font-medium mb-3 ${textColor}`}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                disabled={gameStatus !== "idle"}
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
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
                onChange={(e) => updateBetAmount(e.target.value)}
                disabled={gameStatus !== "idle"}
                placeholder="0.00"
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
              />
            </div>
          </div>

          {/* Quick Bets */}
          <div>
            <p className={`text-md font-semibold mb-2 ${textColor}`}>
              Quick Bets:
            </p>
            <div className="flex flex-wrap gap-2">
              {["0.01", "1", "2", "5", "10"].map((amount) => (
                <button
                  key={amount}
                  onClick={() => updateBetAmount(amount)}
                  disabled={gameStatus !== "idle"}
                  className={`px-4 py-2 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed`}
                  style={{
                    backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                  }}
                  onMouseEnter={(e) => {
                    if (gameStatus === "idle") {
                      e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#0fa594"
                        : "#FCFF51";
                      e.currentTarget.style.color = "black";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#1d505c"
                      : "#F4F9E9";
                    e.currentTarget.style.color = "";
                  }}
                >
                  {amount} MNT
                </button>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={
              !address ||
              isLoading ||
              !betAmount ||
              parseFloat(betAmount) <= 0 ||
              gameStatus !== "idle"
            }
            className={`w-full py-4 rounded-lg border ${borderColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 hover:shadow-none hover:translate-x-1 hover:translate-y-1`}
            style={{
              backgroundColor:
                !address ||
                isLoading ||
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
              : isLoading
              ? "Starting..."
              : "Start Game"}
          </button>

          {/* Game Stats - Always visible */}
          <div
            className={`p-3 md:p-6 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] min-h-[150px] md:min-h-[200px]`}
          >
            <h3
              className={`text-base md:text-xl font-medium mb-3 md:mb-4 ${textColor}`}
            >
              Game Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Difficulty:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Reward Multiplier:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {config.rewardMultiplier}x
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Maximum Possible Reward:
                </span>
                <span
                  className="font-bold"
                  style={{
                    color: isDarkMode ? "#10b981" : "#059669",
                    fontWeight: "bolder",
                  }}
                >
                  {betAmount && parseFloat(betAmount) > 0
                    ? (parseFloat(betAmount) * config.rewardMultiplier).toFixed(
                        4
                      )
                    : "0.00"}{" "}
                  MNT
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Playback Speed:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {difficulty === "easy"
                    ? "Slow (1s)"
                    : difficulty === "medium"
                    ? "Normal (0.7s)"
                    : "Fast (0.5s)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Total Input Time:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {config.baseInputTime}s + {config.timePerSignal}s × level^0.7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Game Board */}
        <div
          className={`rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-3 md:p-6 flex flex-col min-h-[400px] md:min-h-[600px]`}
        >
          {gameStatus === "starting" && (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div
                  className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4"
                  style={{
                    borderColor: isDarkMode ? "#0fa594" : "#000000",
                    borderTopColor: "transparent",
                  }}
                ></div>
                <p className={`text-lg opacity-70 ${textColor}`}>
                  Starting game...
                </p>
              </div>
            </div>
          )}

          {gameStatus !== "starting" && (
            <>
              {/* Stats Header - shown in both idle and playing states */}
              <div className="flex justify-around items-center mb-3 md:mb-6 gap-2 md:gap-4">
                {/* Status / Progress */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span
                    className={`text-base md:text-2xl font-bold ${textColor}`}
                  >
                    Done
                  </span>
                  <div
                    className={`px-3 md:px-6 py-1 md:py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base md:text-2xl font-bold min-w-16 md:min-w-20 text-center`}
                    style={{
                      backgroundColor:
                        gamePhase === "input" && inputTimer < 3
                          ? "#fecaca"
                          : isDarkMode
                          ? "#1d505c"
                          : "#F4F9E9",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    }}
                  >
                    {gameStatus === "idle"
                      ? "-"
                      : `${completedInputs}/${currentLevelLength}`}
                  </div>
                </div>

                {/* Level (Sequence Length) */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span
                    className={`text-base md:text-2xl font-bold ${textColor}`}
                  >
                    Level
                  </span>
                  <div
                    className={`px-3 md:px-6 py-1 md:py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base md:text-2xl font-bold min-w-10 md:min-w-[60px] text-center`}
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
                    {gameStatus === "idle" ? "-" : score + 1}
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span
                    className={`text-base md:text-2xl font-bold ${textColor}`}
                  >
                    Time
                  </span>
                  <div
                    className={`px-3 md:px-6 py-1 md:py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base md:text-2xl font-bold min-w-10 md:min-w-[60px] text-center`}
                    style={{
                      backgroundColor:
                        gamePhase === "input" && inputTimer < 3
                          ? "#fecaca"
                          : isDarkMode
                          ? "#1d505c"
                          : "#F4F9E9",
                      color:
                        gamePhase === "input" && inputTimer < 3
                          ? "#dc2626"
                          : isDarkMode
                          ? "#ffffff"
                          : "#000000",
                    }}
                  >
                    {gameStatus === "idle" || gamePhase !== "input"
                      ? "-"
                      : `${inputTimer.toFixed(1)}s`}
                  </div>
                </div>
              </div>

              {/* Game Board Content */}
              <div className="flex items-center justify-center flex-1">
                {gameStatus === "idle" && (
                  <div className="w-full max-w-md">
                    {/* Simon Signals Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {COLORS.map((color) => {
                        // Determine which corners to round for each box
                        let roundedCorners = "";
                        if (color.id === 0) {
                          // Top-left: round outer corners (top-left) and inner corner (bottom-right)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 1) {
                          // Top-right: round outer corners (top-right) and inner corner (bottom-left)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 2) {
                          // Bottom-left: round outer corners (bottom-left) and inner corner (top-right)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 3) {
                          // Bottom-right: round outer corners (bottom-right) and inner corner (top-left)
                          roundedCorners = "rounded-4xl";
                        }

                        return (
                          <div
                            key={color.id}
                            className={`aspect-square border-2 transition-all duration-150 cursor-pointer hover:scale-105 ${roundedCorners}`}
                            style={{
                              backgroundColor: color.bg,
                              borderColor: color.border,
                              opacity: 0.7,
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              {/* <span className="text-black text-2xl font-bold drop-shadow-lg">
                                {color.name}
                              </span> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {gameStatus === "playing" && (
                  <div className="w-full max-w-md">
                    {/* Simon Signals Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {COLORS.map((color) => {
                        // Determine which corners to round for each box
                        let roundedCorners = "";
                        if (color.id === 0) {
                          // Top-left: round outer corners (top-left) and inner corner (bottom-right)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 1) {
                          // Top-right: round outer corners (top-right) and inner corner (bottom-left)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 2) {
                          // Bottom-left: round outer corners (bottom-left) and inner corner (top-right)
                          roundedCorners = "rounded-4xl";
                        } else if (color.id === 3) {
                          // Bottom-right: round outer corners (bottom-right) and inner corner (top-left)
                          roundedCorners = "rounded-4xl";
                        }

                        return (
                          <button
                            key={color.id}
                            onClick={() => handleSignalClick(color.id)}
                            disabled={gamePhase !== "input"}
                            className={`aspect-square border-2 transition-all duration-150 cursor-pointer hover:scale-105 
                                ${roundedCorners} ${
                              wrongSignal === color.id ? "animate-pulse" : ""
                            }`}
                            style={{
                              backgroundColor:
                                wrongSignal === color.id
                                  ? "#FF0000"
                                  : activeSignal === color.id
                                  ? color.active
                                  : color.bg,
                              borderColor:
                                wrongSignal === color.id
                                  ? "#8B0000"
                                  : color.border,
                              opacity:
                                wrongSignal === color.id
                                  ? 1
                                  : activeSignal === color.id
                                  ? 1
                                  : 0.7,
                              transform:
                                activeSignal === color.id
                                  ? "scale(0.95)"
                                  : "scale(1)",
                              boxShadow:
                                wrongSignal === color.id
                                  ? "0 0 40px #FF0000, inset 0 0 20px #8B0000"
                                  : activeSignal === color.id
                                  ? `0 0 30px ${color.active}`
                                  : "none",
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              {/* Label removed for cleaner design */}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Result Modal */}
      {gamePhase === "completed" && gameStatus === "completed" && (
        <GameResult
          won={score >= config.targetScore}
          reward={earnedReward}
          betAmount={betAmount}
          matchesFound={score}
          totalPairs={config.targetScore}
          correctPairs={score}
          wrongPairs={0}
          netGain={netGain}
          failureReason={failureReason}
          onPlayAgain={handleReset}
          onWithdraw={withdrawWinnings}
          isWithdrawing={isTransactionLoading}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}
