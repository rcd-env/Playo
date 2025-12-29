import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

export function SplashScreen({ onComplete, isDarkMode }: SplashScreenProps) {
  const [stage, setStage] = useState<"pulse" | "fade">("pulse");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("fade"), 800), // Pulse for 0.8s then fade
      setTimeout(() => onComplete(), 1200), // Complete at 1.2s
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
        }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo Stage - Pulse & Fade */}
        <motion.div
          className="absolute"
          initial={{ scale: 1, opacity: 1 }}
          animate={
            stage === "pulse"
              ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.8, ease: "easeInOut" },
                }
              : {
                  scale: 0.95,
                  opacity: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                }
          }
        >
          <img
            src={
              isDarkMode
                ? "/images/playo-logo-light.png"
                : "/images/playo-logo-dark.png"
            }
            alt="Playo"
            className="w-32 h-32"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
