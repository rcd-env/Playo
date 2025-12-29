import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface GameTransitionProps {
  children: ReactNode;
  gameId: string;
}

export function GameTransition({ children, gameId }: GameTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={gameId}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1], // Custom easing for smooth zoom
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
