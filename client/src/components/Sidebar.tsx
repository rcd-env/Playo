import { useState } from "react";

interface Game {
  id: string;
  name: string;
  imagePath: string;
  isActive: boolean;
}

interface SidebarProps {
  isDarkMode: boolean;
  onHover: (isHovered: boolean) => void;
}

export function Sidebar({ isDarkMode, onHover }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const games: Game[] = [
    {
      id: "memory",
      name: "Flippo",
      imagePath: "/images/earno-logo.jpg",
      isActive: true,
    },
    {
      id: "coming-soon-1",
      name: "Tappo",
      imagePath: "/images/earno-logo.jpg",
      isActive: false,
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
  const borderColor = "border-black border-2";

  return (
    <aside
      className={`fixed z-50 transition-all duration-300 ease-in-out ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] rounded-lg`}
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
      {/* Logo Section */}
      <div className="p-5 border-b-2 border-black">
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold text-lg`}
            style={{
              backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
              color: "#000000",
            }}
          >
            E
          </div>
          {isExpanded && (
            <span
              className="font-bold font-Tsuchigumo text-3xl whitespace-nowrap overflow-hidden brand tracking-widest"
              style={{ color: textColor }}
            >
              Playo
            </span>
          )}
        </div>
      </div>

      {/* Games List */}
      <div className="py-4">
        {games.map((game, index) => (
          <button
            key={game.id}
            disabled={!game.isActive}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all hover:translate-x-1 ${
              game.isActive ? "cursor-pointer" : "cursor-not-allowed opacity-60"
            } ${
              game.isActive && index === 0
                ? `border-l-4 ${
                    isDarkMode ? "border-[#0fa594]" : "border-[#FCFF51]"
                  }`
                : ""
            }`}
            style={{
              color: game.isActive ? textColor : isDarkMode ? "#666" : "#999",
            }}
          >
            <div
              className={`w-10 h-10 rounded-full ${borderColor} flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden`}
              style={{
                backgroundColor: game.isActive
                  ? isDarkMode
                    ? "#0fa594"
                    : "#FCFF51"
                  : isDarkMode
                  ? "#333"
                  : "#ddd",
                color: "#000000",
              }}
            >
              <img
                src={game.imagePath}
                alt={game.name}
                className="w-6 h-6 object-contain"
                style={{
                  filter: game.isActive
                    ? "none"
                    : "grayscale(100%) opacity(0.5)",
                }}
              />
            </div>
            {isExpanded && (
              <span className="font-medium whitespace-nowrap overflow-hidden text-left">
                {game.name}
              </span>
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
