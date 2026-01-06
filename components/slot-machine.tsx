"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface SlotMachineProps {
  category: string;
  taxCode: string;
  moneySaved: number;
  isSpinning: boolean;
  onComplete?: () => void;
}

// Slot items to cycle through during spin
const categoryOptions = [
  "Fuel & Oil",
  "Parts & Supplies",
  "Office Supplies",
  "Meals & Ent.",
  "Software",
  "Insurance",
  "Repairs",
  "Professional",
];

const taxCodeOptions = [
  "GST 5%",
  "GST+PST 12%",
  "Exempt",
  "GST 2.5%",
  "Out of Scope",
];

export function SlotMachine({
  category,
  taxCode,
  moneySaved,
  isSpinning,
  onComplete,
}: SlotMachineProps) {
  const [reel1Spinning, setReel1Spinning] = useState(false);
  const [reel2Spinning, setReel2Spinning] = useState(false);
  const [reel3Spinning, setReel3Spinning] = useState(false);
  const [reel1Value, setReel1Value] = useState(category);
  const [reel2Value, setReel2Value] = useState(taxCode);
  const [showSaved, setShowSaved] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startSpin = useCallback(() => {
    setIsComplete(false);
    setShowSaved(false);
    setReel1Spinning(true);
    setReel2Spinning(true);
    setReel3Spinning(true);

    // Staggered stops
    setTimeout(() => {
      setReel1Spinning(false);
      setReel1Value(category);
    }, 600);

    setTimeout(() => {
      setReel2Spinning(false);
      setReel2Value(taxCode);
    }, 900);

    setTimeout(() => {
      setReel3Spinning(false);
      setIsComplete(true);
    }, 1200);

    setTimeout(() => {
      setShowSaved(true);
      onComplete?.();
    }, 1400);
  }, [category, taxCode, onComplete]);

  useEffect(() => {
    if (isSpinning) {
      startSpin();
    }
  }, [isSpinning, startSpin]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Slot Reels */}
      <div className="flex gap-3">
        <SlotReel
          value={reel1Value}
          isSpinning={reel1Spinning}
          options={categoryOptions}
          isComplete={isComplete}
        />
        <SlotReel
          value={reel2Value}
          isSpinning={reel2Spinning}
          options={taxCodeOptions}
          isComplete={isComplete}
        />
        <SlotReel
          value={isComplete ? "check" : ""}
          isSpinning={reel3Spinning}
          options={["✓"]}
          isComplete={isComplete}
          isCheckmark
        />
      </div>

      {/* Money Saved */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-amber-500 font-semibold text-lg"
          >
            +${moneySaved.toFixed(2)} saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SlotReelProps {
  value: string;
  isSpinning: boolean;
  options: string[];
  isComplete: boolean;
  isCheckmark?: boolean;
}

function SlotReel({
  value,
  isSpinning,
  options,
  isComplete,
  isCheckmark = false,
}: SlotReelProps) {
  const [displayValue, setDisplayValue] = useState(value);

  // Cycle through options while spinning
  useEffect(() => {
    if (!isSpinning) {
      setDisplayValue(value);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % options.length;
      setDisplayValue(options[index]);
    }, 50);

    return () => clearInterval(interval);
  }, [isSpinning, value, options]);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg
        w-20 h-20 flex items-center justify-center
        bg-primary text-primary-foreground
        font-semibold text-xs text-center
        border-2 transition-colors duration-300
        ${isComplete ? "border-amber-400 shadow-lg shadow-amber-400/20" : "border-primary"}
      `}
      animate={
        isComplete && !isSpinning
          ? {
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={displayValue}
          initial={isSpinning ? { y: -20, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={isSpinning ? { y: 20, opacity: 0 } : undefined}
          transition={{ duration: 0.05 }}
          className="flex items-center justify-center p-2"
        >
          {isCheckmark && isComplete ? (
            <Check className="w-8 h-8 text-amber-400" strokeWidth={3} />
          ) : (
            <span className="leading-tight">{displayValue}</span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Demo component to test the slot machine
export function SlotMachineDemo() {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 100);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <SlotMachine
        category="Fuel & Oil"
        taxCode="GST 5%"
        moneySaved={4.2}
        isSpinning={isSpinning}
        onComplete={() => console.log("Spin complete!")}
      />
      <button
        onClick={handleSpin}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Test Spin
      </button>
    </div>
  );
}
