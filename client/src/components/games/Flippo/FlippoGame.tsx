import { useEffect } from "react";
import { GameBoard } from "../../GameBoard";
import { GameResult } from "../../GameResult";
import { usePlayoGame } from "../../../hooks/usePlayoGame";

interface FlippoGameProps {
  isDarkMode: boolean;
  address: string | undefined;
  isLoading: boolean;
}

export function FlippoGame({
  isDarkMode,
  address,
  isLoading,
}: FlippoGameProps) {
  const {
    gridSize,
    betAmount,
    gameStatus,
    matchesFound,
    totalPairs,
    potentialReward,
    maxFlips,
    flips,
    correctPairs,
    wrongPairs,
    netGain,
    startGame,
    recordMatch,
    endGame,
    resetGame,
    updateGridSize,
    updateBetAmount,
    handleConfirmation,
    incrementFlips,
    checkFlipLimit,
    withdrawWinnings,
    isLoading: isTransactionLoading,
  } = usePlayoGame();

  // Handle transaction confirmations
  useEffect(() => {
    handleConfirmation();
  }, [handleConfirmation]);

  const handleGameComplete = () => {
    endGame();
  };

  // Play hover sound function
  const playHoverSound = () => {
    const hoverSound = new Audio("/audios/hover.mp3");
    hoverSound.volume = 1;
    hoverSound.play().catch(() => {});
  };

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "bg-[#1d505c]" : "bg-[#F4F9E9]";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Grid Size & Bet Amount in Same Row */}
          <div className="flex gap-4">
            {/* Grid Size Selector - 1/3 width */}
            <div className="w-1/3">
              <label className={`block text-lg font-medium mb-3 ${textColor}`}>
                Grid Size
              </label>
              <select
                value={`${gridSize}x${gridSize}`}
                onChange={(e) => {
                  const size = parseInt(e.target.value.split("x")[0]);
                  updateGridSize(size);
                }}
                disabled={gameStatus !== "idle"}
                className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
              >
                <option value="2x2">2x2</option>
                <option value="4x4">4x4</option>
                <option value="6x6">6x6</option>
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

          {/* Game Stats Box - Always visible */}
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
                  Grid Size:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {gridSize}×{gridSize}
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
                  {gridSize === 2
                    ? "1.2"
                    : gridSize === 4
                    ? "1.5"
                    : gridSize === 6
                    ? "2.0"
                    : "2.5"}
                  x
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
                  {potentialReward} MNT
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Maximum Pair Flips Allowed:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {maxFlips}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Total Pairs:
                </span>
                <span
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {(gridSize * gridSize) / 2}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Game Board */}
        <div
          className={`rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-3 md:p-6 flex flex-col max-h-[500px] md:max-h-[800px]`}
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
                {/* Correct Flips */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span
                    className={`text-base md:text-2xl font-bold ${textColor}`}
                  >
                    Correct
                  </span>
                  <div
                    className={`px-3 md:px-6 py-1 md:py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base md:text-2xl font-bold min-w-[40px] md:min-w-[60px] text-center`}
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
                    {gameStatus === "idle" ? "0" : correctPairs}
                  </div>
                </div>

                {/* Flips Left */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <span
                    className={`text-base md:text-2xl font-bold ${textColor}`}
                  >
                    Flips Left
                  </span>
                  <div
                    className={`px-3 md:px-6 py-1 md:py-2 rounded-lg border ${borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base md:text-2xl font-bold min-w-[40px] md:min-w-[60px] text-center`}
                    style={{
                      backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                      color: isDarkMode ? "#ffffff" : "#000000",
                    }}
                  >
                    {gameStatus === "idle" ? maxFlips : maxFlips - flips}
                  </div>
                </div>
              </div>

              {/* Game Board Content */}
              <div className="flex items-center justify-center flex-1">
                {gameStatus === "idle" && (
                  <div
                    className="grid gap-3 w-full"
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                      maxWidth: "500px",
                    }}
                  >
                    {Array.from({ length: gridSize * gridSize }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square"
                        >
                          <div
                            className={`absolute w-full h-full rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center ${
                              isDarkMode ? "bg-[#153243]" : "bg-[#F4F9E9]"
                            } cursor-help`}
                            onMouseEnter={playHoverSound}
                          >
                            <div
                              className="text-4xl font-bold"
                              style={{
                                color: isDarkMode ? "white" : "#000000",
                              }}
                            >
                              ?
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {gameStatus === "playing" && (
                  <GameBoard
                    gridSize={gridSize}
                    onMatch={recordMatch}
                    onGameComplete={handleGameComplete}
                    disabled={false}
                    isDarkMode={isDarkMode}
                    onFlip={incrementFlips}
                    checkFlipLimit={checkFlipLimit}
                    flips={flips}
                    maxFlips={maxFlips}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Result Modal */}
      {gameStatus === "completed" && (
        <GameResult
          won={matchesFound === totalPairs}
          reward={potentialReward}
          betAmount={betAmount}
          matchesFound={matchesFound}
          totalPairs={totalPairs}
          correctPairs={correctPairs}
          wrongPairs={wrongPairs}
          netGain={netGain}
          onPlayAgain={resetGame}
          onWithdraw={withdrawWinnings}
          isWithdrawing={isTransactionLoading}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
}
