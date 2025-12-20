interface GameStartProps {
  gridSize: number;
  betAmount: string;
  potentialReward: string;
  onGridSizeChange: (size: number) => void;
  onBetAmountChange: (amount: string) => void;
  onStartGame: () => void;
  isLoading: boolean;
}

export function GameStart({
  gridSize,
  betAmount,
  potentialReward,
  onGridSizeChange,
  onBetAmountChange,
  onStartGame,
  isLoading,
}: GameStartProps) {
  const getMultiplier = (size: number): string => {
    const multipliers: { [key: number]: string } = {
      2: "1.2x",
      3: "1.5x",
      4: "2x",
      5: "2.5x",
      6: "3x",
      7: "3.5x",
      8: "4x",
    };
    return multipliers[size] || "1x";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {/* Grid Size Selector */}
      <div className="flex items-center gap-4 justify-center">
        <label className="text-lg font-medium text-white">Grid Size:</label>
        <input
          type="range"
          min="2"
          max="8"
          value={gridSize}
          onChange={(e) => onGridSizeChange(Number(e.target.value))}
          className="w-48 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          disabled={isLoading}
        />
        <span className="text-2xl font-bold text-blue-400 min-w-20">
          {gridSize}×{gridSize}
        </span>
        <span className="text-lg text-blue-400 font-medium">
          {getMultiplier(gridSize)}
        </span>
      </div>

      {/* Bet Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <input
          type="number"
          placeholder="Enter Bet (MNT)"
          step="0.01"
          min="0.01"
          value={betAmount}
          onChange={(e) => onBetAmountChange(e.target.value)}
          className="px-4 py-2 rounded-md border border-blue-500/30 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={onStartGame}
          disabled={isLoading || !betAmount || parseFloat(betAmount) <= 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-600 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? "Starting..." : "Start Game"}
        </button>
      </div>

      {/* Quick Bet Options */}
      <div className="flex gap-2 justify-center flex-wrap">
        <span className="text-slate-400 text-sm self-center">Quick bet:</span>
        {["0.01", "0.05", "0.1", "0.5"].map((amount) => (
          <button
            key={amount}
            onClick={() => onBetAmountChange(amount)}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors disabled:opacity-50"
          >
            {amount} MNT
          </button>
        ))}
      </div>

      {/* Game Info */}
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-slate-400 text-sm">Grid Size</div>
            <div className="text-white text-lg font-bold">
              {gridSize}×{gridSize}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Bet Amount</div>
            <div className="text-white text-lg font-bold">
              {betAmount || "0"} MNT
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Potential Reward</div>
            <div className="text-blue-400 text-lg font-bold">
              {potentialReward} MNT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
