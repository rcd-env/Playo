interface GameStatsProps {
  matchesFound: number;
  totalPairs: number;
  betAmount: string;
  potentialReward: string;
  flips: number;
  maxFlips: number;
  correctPairs: number;
  wrongPairs: number;
  netGain: number;
  gridSize: number;
  isDarkMode: boolean;
}

export function GameStats({
  matchesFound,
  totalPairs,
  potentialReward,
  flips,
  maxFlips,
  correctPairs,
  wrongPairs,
  netGain,
  isDarkMode,
}: GameStatsProps) {
  const progress = totalPairs > 0 ? (matchesFound / totalPairs) * 100 : 0;
  const flipsLeft = maxFlips - flips;

  return (
    <div className="space-y-3">
      {/* Grid Size */}
      {/* <div className="flex justify-between">
        <span className="opacity-70">Grid Size:</span>
        <span className="font-bold">
          {gridSize}×{gridSize}
        </span>
      </div> */}

      {/* Flips Left */}
      <div className="flex justify-between">
        <span className="opacity-70">Flips Left:</span>
        <span
          className="font-bold"
          style={{
            color:
              flipsLeft <= 3 ? "#ef4444" : isDarkMode ? "#0fa594" : "#000000",
          }}
        >
          {flipsLeft}/{maxFlips}
        </span>
      </div>

      {/* Matches Found */}
      {/* <div className="flex justify-between">
        <span className="opacity-70">Matches Found:</span>
        <span
          className="font-bold"
          style={{ color: isDarkMode ? "#0fa594" : "#000000" }}
        >
          {matchesFound}/{totalPairs}
        </span>
      </div> */}

      {/* Correct Pairs */}
      <div className="flex justify-between">
        <span className="opacity-70">Correct Pairs:</span>
        <span
          className="font-bold"
          style={{ color: isDarkMode ? "#0fa594" : "#000000" }}
        >
          {correctPairs}/{totalPairs}
        </span>
      </div>

      {/* Wrong Pairs */}
      {/* {wrongPairs > 0 && ( */}
      <div className="flex justify-between">
        <span className="opacity-70">Wrong Pairs:</span>
        <span className="font-bold text-red-500">{wrongPairs}</span>
      </div>
      {/* )} */}

      {/* Bet Amount */}
      {/* <div className="flex justify-between">
        <span className="opacity-70">Bet Amount:</span>
        <span className="font-bold">{betAmount} MNT</span>
      </div> */}

      {/* Potential Win */}
      <div className="flex justify-between">
        <span className="opacity-70">Potential Win:</span>
        <span
          className="font-bold"
          style={{ color: isDarkMode ? "#0fa594" : "#000000" }}
        >
          {potentialReward} MNT
        </span>
      </div>

      {/* Current Result (Net Gain/Loss) */}
      <div className="flex justify-between">
        <span className="opacity-70">Current Result:</span>
        <span
          className="font-bold"
          style={{
            color:
              netGain > 0
                ? "#10b981"
                : netGain < 0
                ? "#ef4444"
                : isDarkMode
                ? "#ffffff"
                : "#000000",
          }}
        >
          {netGain >= 0 ? "+" : ""}
          {netGain.toFixed(4)} MNT
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{
            backgroundColor: isDarkMode ? "#153243" : "#E5D4C1",
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
