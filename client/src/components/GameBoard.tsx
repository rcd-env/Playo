import { useState, useEffect, useRef } from "react";
import { Card } from "./Card";
import { useVideoPreloader } from "../hooks/useVideoPreloader";

export interface CardType {
  id: number;
  value: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameBoardProps {
  gridSize: number;
  onMatch: (correct: boolean) => void;
  onGameComplete: () => void;
  disabled: boolean;
  isDarkMode: boolean;
  onFlip: () => void;
  checkFlipLimit: () => boolean;
  flips: number;
  maxFlips: number;
}

// Unique colors for pairs (32 pairs maximum for 8x8 grid)
const COLOR_PAIRS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B88B",
  "#FAD7A1",
  "#82E0AA",
  "#AED6F1",
  "#F5B7B1",
  "#D7BDE2",
  "#A9DFBF",
  "#FAD7A0",
  "#ABEBC6",
  "#85C1E9",
  "#F9E79F",
  "#F5CBA7",
  "#E8DAEF",
  "#D1F2EB",
  "#FCF3CF",
  "#FADBD8",
  "#D5F4E6",
  "#D6EAF8",
  "#FCF3CF",
  "#EDBB99",
  "#E8DAEF",
  "#D5DBDB",
  "#AEB6BF",
  "#CCD1D1",
];

export function GameBoard({
  gridSize,
  onMatch,
  onGameComplete,
  disabled,
  isDarkMode,
  onFlip,
  checkFlipLimit,
  flips,
  maxFlips,
}: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  // Preload result videos when game starts (cards initialized)
  useVideoPreloader(cards.length > 0);

  // Initialize audio elements
  useEffect(() => {
    successSoundRef.current = new Audio("/audios/success.mp3");
    successSoundRef.current.volume = 0.3;

    errorSoundRef.current = new Audio("/audios/error.mp3");
    errorSoundRef.current.volume = 1;
  }, []);

  // Initialize cards
  useEffect(() => {
    const totalCards = gridSize * gridSize;
    const pairs = totalCards / 2;

    // Select colors for this game
    const selectedColors = COLOR_PAIRS.slice(0, pairs);

    // Create pairs with numbers and colors
    const cardPairs = selectedColors.flatMap((color, index) => [
      { value: String(index + 1), color },
      { value: String(index + 1), color },
    ]);

    // Shuffle cards
    const shuffled = cardPairs
      .map((card, index) => ({
        id: index,
        value: card.value,
        color: card.color,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
  }, [gridSize]);

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setTimeout(() => {
        onGameComplete();
      }, 500);
    }
  }, [cards, onGameComplete]);

  // Auto-end game when flip limit is reached
  useEffect(() => {
    if (flips >= maxFlips && !isChecking) {
      setTimeout(() => {
        onGameComplete();
      }, 100);
    }
  }, [flips, maxFlips, isChecking, onGameComplete]);

  const handleCardClick = (cardId: number) => {
    if (isChecking || disabled) return;
    if (flippedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (card?.isMatched) return;

    // Check flip limit before allowing first card of a new pair
    if (flippedCards.length === 0) {
      if (checkFlipLimit()) {
        return; // Don't allow any more flips if limit reached
      }
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsChecking(true);

      // Increment flip counter
      onFlip();

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      setTimeout(() => {
        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found - play success sound
          if (successSoundRef.current) {
            successSoundRef.current.currentTime = 0;
            successSoundRef.current.play().catch(() => {});
          }
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true, isFlipped: false }
                : card
            )
          );
          onMatch(true);
        } else {
          // No match - play error sound
          if (errorSoundRef.current) {
            errorSoundRef.current.currentTime = 0;
            errorSoundRef.current.play().catch(() => {});
          }
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          onMatch(false);
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: "500px",
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.value}
            color={card.color}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
