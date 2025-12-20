interface GameResultProps {
  won: boolean;
  reward: string;
  betAmount: string;
  matchesFound: number;
  totalPairs: number;
  correctPairs: number;
  wrongPairs: number;
  netGain: number;
  onPlayAgain: () => void;
  onWithdraw: (amount: string) => void;
  isWithdrawing?: boolean;
  isDarkMode?: boolean;
}

export function GameResult({
  // won,
  // matchesFound,
  // totalPairs,
  // correctPairs,
  // wrongPairs,
  netGain,
  reward,
  onPlayAgain,
  onWithdraw,
  isWithdrawing = false,
  isDarkMode = false,
}: GameResultProps) {
  const bgColor = isDarkMode ? "#1d505c" : "#F4F9E9";
  const textColor = isDarkMode ? "white" : "#000000";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "#153243" : "#F4F9E9";

  // Quotes
  const loseQuotes = [
    "You should start a charity - oh wait, you did.",
    "You made it look easy - losing, I mean.",
    "Skill issue. Major one.",
  ];

  const winQuotes = [
    "Hot hands - don't let them cool.",
    "You're on fire - fan the flames.",
    "Win mode: ON. Play again to confirm.",
  ];

  // Select random quote based on result
  const quote =
    netGain > 0
      ? winQuotes[Math.floor(Math.random() * winQuotes.length)]
      : loseQuotes[Math.floor(Math.random() * loseQuotes.length)];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-fade-in ${borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Result Title */}
        {/* <h2 className="text-4xl font-bold" style={{ color: textColor }}>
          {won ? (
            <span className="flex gap-3 justify-center items-center">
              You Won <Crown size={45} strokeWidth={2} />
            </span>
          ) : (
            <span className="flex gap-3 justify-center items-center text-rose-400">
              Try Again <HeartCrack size={45} strokeWidth={2} />
            </span>
          )}
        </h2> */}

        {/* Stats */}
        <div className="space-y-3">
          {/* Net Gain/Loss - Prominent */}
          <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor:
                netGain > 0 ? (isDarkMode ? "#065f46" : "#d1fae5") : cardBg,
              color:
                netGain > 0 ? (isDarkMode ? "#ffffff" : "#10b981") : textColor,
            }}
          >
            <div className="text-sm opacity-70 font-medium uppercase tracking-wider">
              {netGain > 0 ? "Profit" : "Profit"}
            </div>

            <div className="text-3xl font-bold">
              {netGain > 0 ? "+" : ""}
              {netGain > 0 ? netGain.toFixed(4) : "0.0000"} MNT
            </div>
          </div>
          {/* Video */}
          <div className="my-3">
            <video
              key={netGain > 0 ? "win" : "lose"}
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full h-64 object-cover rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
            >
              <source
                src={netGain > 0 ? "/videos/Win.mp4" : "/videos/Lost.mp4"}
                type="video/mp4"
              />
            </video>
          </div>

          {/* Matches Found */}
          {/* <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: cardBg,
              color: textColor,
            }}
          >
            <div className="text-sm opacity-70">Matches Found</div>
            <div className="text-2xl font-bold">
              {matchesFound} / {totalPairs}
            </div>
          </div> */}

          {/* Correct vs Wrong Pairs */}
          {/* <div className="grid grid-cols-2 gap-3">
            <div
              className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
              style={{
                backgroundColor: isDarkMode ? "#065f46" : "#d1fae5",
                color: "#10b981",
              }}
            >
              <div className="text-xs font-medium uppercase">Correct</div>
              <div className="text-2xl font-bold">{correctPairs}</div>
            </div>

            <div
              className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
              style={{
                backgroundColor: isDarkMode ? "#7f1d1d" : "#fee2e2",
                color: "#ef4444",
              }}
            >
              <div className="text-xs font-medium uppercase">Wrong</div>
              <div className="text-2xl font-bold">{wrongPairs}</div>
            </div>
          </div> */}

          {/* Bet Amount
          <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: isDarkMode ? "#3C1F47" : "#F4F9E9",
              color: textColor,
            }}
          >
            <div className="text-sm opacity-70">Bet Amount</div>
            <div className="text-xl font-bold">{betAmount} MNT</div>
          </div> */}

          {/* Potential Reward */}
          {/* <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: isDarkMode ? "#3C1F47" : "#F4F9E9",
              color: textColor,
            }}
          >
            <div className="text-sm opacity-70">Potential Reward</div>
            <div className="text-xl font-bold">{reward} MNT</div>
          </div> */}

          {/* Quote */}
          <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: cardBg,
              color: textColor,
            }}
          >
            <p className="text-md font-medium italic">"{quote}"</p>
          </div>
          {/* Quote for Loss */}
          {/* <div
            className={`rounded-lg p-4 italic ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: cardBg,
              color: textColor,
            }}
          >
            {netGain > 0 ? (
              <div>"Victory belongs to the most persevering."</div>
            ) : (
              <div>“You made it look easy — losing, I mean.”</div>
            )}
          </div> */}
        </div>
        {/* Actions */}
        <div className="space-y-3">
          {/* Withdraw/Claim Button - Show if player earned anything */}
          {parseFloat(reward) > 0 && (
            <button
              onClick={() => onWithdraw(reward)}
              disabled={isWithdrawing}
              className={`w-full font-bold py-3 rounded-lg transition text-lg ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] disabled:hover:translate-x-0 disabled:hover:translate-y-0`}
              style={{
                backgroundColor: isDarkMode ? "#10b981" : "#FCFF51",
                color: "#000000",
              }}
            >
              {isWithdrawing
                ? "Withdrawing..."
                : netGain > 0
                ? "Withdraw Winnings"
                : "Claim Partial Refund"}
            </button>
          )}

          {/* Play Again Button - Only show if they earned nothing */}
          {parseFloat(reward) === 0 && (
            <button
              onClick={onPlayAgain}
              className={`w-full font-bold py-3 rounded-lg transition text-lg ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer`}
              style={{
                backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
                color: "#000000",
              }}
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
