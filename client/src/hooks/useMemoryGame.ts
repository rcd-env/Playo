import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { MEMORY_GAME_ADDRESS, MEMORY_GAME_ABI } from "../lib/contract";

export type GameStatus = "idle" | "starting" | "playing" | "completed";

export function useMemoryGame() {
  const { address } = useAccount();
  const [gridSize, setGridSize] = useState(4);
  const [betAmount, setBetAmount] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [matchesFound, setMatchesFound] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [potentialReward, setPotentialReward] = useState("0");
  const [maxFlips, setMaxFlips] = useState(0);
  const [flips, setFlips] = useState(0);
  const [correctPairs, setCorrectPairs] = useState(0);
  const [wrongPairs, setWrongPairs] = useState(0);
  const [netGain, setNetGain] = useState(0);
  const [portionValue, setPortionValue] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  // Calculate max flips based on grid size - strict limits
  useEffect(() => {
    const flipLimits: Record<number, number> = {
      2: 2, // Very tight
      4: 8, // Challenging
      6: 18, // Moderate
      8: 32, // Generous but still limited
    };
    setMaxFlips(flipLimits[gridSize] || 10);
  }, [gridSize]);

  // Calculate potential reward and portion values based on grid size
  const calculateReward = useCallback((size: number, bet: string) => {
    const betValue = parseFloat(bet);
    if (!betValue || betValue <= 0) return "0";

    let multiplier = 1;
    const totalPairs = (size * size) / 2;

    // Balanced multipliers for fair gameplay
    switch (size) {
      case 2:
        multiplier = 1.2; // 1.2x reward for perfect play (bet 10, win 12)
        break;
      case 4:
        multiplier = 1.5; // 1.5x reward for perfect play
        break;
      case 6:
        multiplier = 2; // 2x reward for perfect play
        break;
      case 8:
        multiplier = 2.5; // 2.5x reward for perfect play
        break;
    }

    const totalReward = betValue * multiplier;
    const portionVal = totalReward / totalPairs;
    setPortionValue(portionVal);

    return totalReward.toFixed(4);
  }, []);

  // Calculate net gain/loss in real-time
  useEffect(() => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setNetGain(0);
      return;
    }

    // Only calculate during/after playing
    if (gameStatus === "idle" || gameStatus === "starting") {
      return;
    }

    const bet = parseFloat(betAmount);
    const totalPairsCount = (gridSize * gridSize) / 2;

    // Get the multiplier for this grid size
    let multiplier = 1;
    switch (gridSize) {
      case 2:
        multiplier = 1.2;
        break;
      case 4:
        multiplier = 1.5;
        break;
      case 6:
        multiplier = 2;
        break;
      case 8:
        multiplier = 2.5;
        break;
    }

    // Calculate progress-based reward
    const correctRatio =
      totalPairsCount > 0 ? correctPairs / totalPairsCount : 0;
    const maxReward = bet * multiplier;
    const earnedReward = maxReward * correctRatio;

    // Net gain = earned reward - original bet
    const net = earnedReward - bet;

    setNetGain(net);
    setPotentialReward(earnedReward.toFixed(4));
  }, [correctPairs, wrongPairs, betAmount, gridSize, gameStatus]);

  // Start a new game
  const startGame = useCallback(async () => {
    if (!address || !betAmount || parseFloat(betAmount) <= 0) {
      console.error("Invalid game parameters");
      return;
    }

    try {
      setGameStatus("starting");
      const pairs = (gridSize * gridSize) / 2;
      setTotalPairs(pairs);
      setMatchesFound(0);
      setFlips(0);
      setCorrectPairs(0);
      setWrongPairs(0);
      setNetGain(0);

      const reward = calculateReward(gridSize, betAmount);
      setPotentialReward(reward);

      // Call deposit function instead of startGame
      writeContract({
        address: MEMORY_GAME_ADDRESS,
        abi: MEMORY_GAME_ABI,
        functionName: "deposit",
        value: parseEther(betAmount),
      });
    } catch (error) {
      console.error("Error starting game:", error);
      setGameStatus("idle");
    }
  }, [address, betAmount, gridSize, writeContract, calculateReward]);

  // Record a match
  const recordMatch = useCallback(
    (isCorrect: boolean) => {
      if (!address || gameStatus !== "playing") return;

      try {
        if (isCorrect) {
          setMatchesFound((prev) => prev + 1);
          setCorrectPairs((prev) => prev + 1);
        } else {
          setWrongPairs((prev) => prev + 1);
        }
        // No blockchain transaction needed for tracking matches locally
      } catch (error) {
        console.error("Error recording match:", error);
      }
    },
    [address, gameStatus]
  );

  // End the game (client-side only, no blockchain transaction)
  const endGame = useCallback(async () => {
    if (!address || gameStatus !== "playing") return;

    try {
      // Just update status to completed - no blockchain interaction
      setGameStatus("completed");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }, [address, gameStatus]);

  // Handle transaction confirmation
  const handleConfirmation = useCallback(() => {
    if (isConfirmed && gameStatus === "starting") {
      setGameStatus("playing");
    }
  }, [isConfirmed, gameStatus]);

  // Handle transaction errors (user rejection, network errors, etc.)
  useEffect(() => {
    if (writeError && gameStatus === "starting") {
      console.error("Transaction error:", writeError);
      setGameStatus("idle");
      resetWrite(); // Clear the error state
    }
  }, [writeError, gameStatus, resetWrite]);

  // Handle transaction receipt errors
  useEffect(() => {
    if (receiptError && gameStatus === "starting") {
      console.error("Transaction receipt error:", receiptError);
      setGameStatus("idle");
    }
  }, [receiptError, gameStatus]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameStatus("idle");
    setMatchesFound(0);
    setTotalPairs(0);
    setPotentialReward("0");
    setFlips(0);
    setCorrectPairs(0);
    setWrongPairs(0);
    setNetGain(0);
    setPortionValue(0);
  }, []);

  // Update grid size and recalculate reward
  const updateGridSize = useCallback(
    (size: number) => {
      setGridSize(size);
      const reward = calculateReward(size, betAmount);
      setPotentialReward(reward);
    },
    [betAmount, calculateReward]
  );

  // Update bet amount and recalculate reward
  const updateBetAmount = useCallback(
    (amount: string) => {
      setBetAmount(amount);
      const reward = calculateReward(gridSize, amount);
      setPotentialReward(reward);
    },
    [gridSize, calculateReward]
  );

  // Increment flip count
  const incrementFlips = useCallback(() => {
    setFlips((prev) => prev + 1);
  }, []);

  // Check if game is over due to flip limit
  const checkFlipLimit = useCallback(() => {
    if (flips >= maxFlips && gameStatus === "playing") {
      setGameStatus("completed");
      return true;
    }
    return false;
  }, [flips, maxFlips, gameStatus]);

  // Withdraw winnings
  const withdrawWinnings = useCallback(
    async (amount: string) => {
      if (!address) return;

      try {
        setIsWithdrawing(true);
        writeContract({
          address: MEMORY_GAME_ADDRESS,
          abi: MEMORY_GAME_ABI,
          functionName: "withdraw",
          args: [parseEther(amount)],
        });
      } catch (error) {
        console.error("Error withdrawing:", error);
        setIsWithdrawing(false);
      }
    },
    [address, writeContract]
  );

  // Handle withdrawal confirmation - reset game to idle after successful withdrawal
  useEffect(() => {
    if (isConfirmed && isWithdrawing) {
      setIsWithdrawing(false);
      resetGame();
    }
  }, [isConfirmed, isWithdrawing, resetGame]);

  // Handle withdrawal errors
  useEffect(() => {
    if (writeError && isWithdrawing) {
      console.error("Withdrawal error:", writeError);
      setIsWithdrawing(false);
      resetWrite(); // Clear the error state
    }
  }, [writeError, isWithdrawing, resetWrite]);

  return {
    // State
    address,
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
    portionValue,
    isLoading: isPending || isConfirming,
    isConfirmed,
    transactionError: writeError || receiptError,

    // Actions
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
  };
}
