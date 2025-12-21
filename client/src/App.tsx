import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { WalletConnect } from "./components/wallet-connect";
import { ErrorNotification } from "./components/ErrorNotification";
import { Sidebar } from "./components/Sidebar";
import { FlippoGame } from "./components/games/Flippo/FlippoGame";
import { TappoGame } from "./components/games/Tappo/TappoGame";
import { useMemoryGame } from "./hooks/useMemoryGame";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [selectedGame, setSelectedGame] = useState("flippo");

  // Apply theme to document for scrollbar styling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const { address, isLoading, transactionError } = useMemoryGame();

  const bgColor = isDarkMode ? "bg-[#3C1F47]" : "bg-[#FFFFFF]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";

  return (
    <div
      className={`min-h-screen ${textColor} ${!isDarkMode ? "light-mode" : ""}`}
      style={{
        backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
        backgroundImage: isDarkMode
          ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.09) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 0, 0, 0.09) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isDarkMode={isDarkMode}
        onHover={setIsSidebarHovered}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
      />

      {/* Main Content with blur effect when sidebar is hovered */}
      <div
        className={`transition-all duration-300 ${
          isSidebarHovered ? "blur-sm" : ""
        }`}
        style={{
          marginLeft: "112px", // Space for collapsed sidebar (80px + 32px margin)
        }}
      >
        {/* Top Bar */}
        <header className={`px-8 py-6 ${bgColor} bg-transparent`}>
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            {/* Brand Name */}
            <h1 className="text-4xl font-bold font-Tsuchigumo tracking-wider brand">
              Playo
            </h1>

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
        </main>

        {/* Error Notification */}
        {transactionError && (
          <ErrorNotification
            error={transactionError as Error}
            onDismiss={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export default App;
