import { useState } from "react";

interface Game {
  id: string;
  name: string;
  imagePath: string;
  isActive: boolean;
  badge?: "new" | "popular" | "live";
}

interface SidebarProps {
  isDarkMode: boolean;
  onHover: (isHovered: boolean) => void;
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
}

export function Sidebar({
  isDarkMode,
  onHover,
  selectedGame,
  onSelectGame,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const games: Game[] = [
    {
      id: "flippo",
      name: "Flippo",
      imagePath: "/images/earno-logo.jpg",
      isActive: true,
      badge: "popular",
    },
    {
      id: "tappo",
      name: "Tappo",
      imagePath: "/images/earno-logo.jpg",
      isActive: true,
      badge: "new",
    },
  ];

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onHover(false);
  };

  const bgColor = isDarkMode ? "#1d505c" : "#F4F9E9";
  const textColor = isDarkMode ? "white" : "#000000";
  const borderColor = "border-black border";

  return (
    <aside
      className={`fixed z-50 transition-all duration-300 ease-in-out ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden`}
      style={{
        left: "16px",
        top: "16px",
        bottom: "16px",
        height: "calc(100vh - 32px)",
        width: isExpanded ? "280px" : "80px",
        backgroundColor: bgColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Games List */}
      <div className="py-4">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all relative cursor-pointer ${
              selectedGame === game.id ? "bg-opacity-20" : ""
            }`}
            style={{
              color: textColor,
              backgroundColor:
                selectedGame === game.id
                  ? isDarkMode
                    ? "rgba(15, 165, 148, 0.2)"
                    : "rgba(252, 255, 81, 0.3)"
                  : "transparent",
            }}
          >
            <div
              className="relative shrink-0"
              style={{ minWidth: "40px", width: "40px", height: "40px" }}
            >
              <img
                src={game.imagePath}
                alt={game.name}
                className="w-full h-full object-cover rounded-full border border-black"
              />
            </div>
            {isExpanded && (
              <div className="flex items-center justify-between flex-1">
                <span className="font-medium whitespace-nowrap overflow-hidden text-left">
                  {game.name}
                </span>
                {/* Badge on expanded view */}
                {game.badge && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] ${
                      game.badge === "live"
                        ? "bg-red-500 text-white animate-pulse"
                        : game.badge === "new"
                        ? "bg-cyan-400 text-black"
                        : "bg-pink-500 text-white"
                    }`}
                  >
                    {game.badge.toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Section - Coming Soon Badge */}
      {isExpanded && (
        <div className="absolute bottom-8 left-0 right-0 px-5">
          <div
            className={`${borderColor} rounded-lg p-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: isDarkMode ? "#153243" : "#E8F5E9",
              color: textColor,
            }}
          >
            <p className="text-xs font-medium opacity-70">More games</p>
            <p className="text-sm font-bold">Coming Soon!</p>
          </div>
        </div>
      )}
    </aside>
  );
}
