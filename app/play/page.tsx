"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, SkipForward, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SlotMachine } from "@/components/slot-machine";
import { useVoiceInput } from "@/hooks/use-voice-input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock receipt data - will be replaced with real data
const mockReceipts = [
  {
    id: "1",
    vendor: "ESSO CARDLOCK",
    amount: 127.43,
    date: "December 28, 2024",
    imageUrl: "/placeholder-receipt.jpg",
    suggestedCategory: "Fuel & Oil",
    suggestedTaxCode: "GST 5%",
    confidence: 0.92,
  },
  {
    id: "2",
    vendor: "LORDCO AUTO PARTS",
    amount: 342.18,
    date: "December 27, 2024",
    imageUrl: "/placeholder-receipt.jpg",
    suggestedCategory: "Parts & Supplies",
    suggestedTaxCode: "GST+PST 12%",
    confidence: 0.88,
  },
  {
    id: "3",
    vendor: "TIM HORTONS",
    amount: 14.67,
    date: "December 26, 2024",
    imageUrl: "/placeholder-receipt.jpg",
    suggestedCategory: "Meals & Ent.",
    suggestedTaxCode: "GST 2.5%",
    confidence: 0.75,
  },
  {
    id: "4",
    vendor: "CANADIAN TIRE",
    amount: 89.99,
    date: "December 24, 2024",
    imageUrl: "/placeholder-receipt.jpg",
    suggestedCategory: null,
    suggestedTaxCode: null,
    confidence: 0.45,
  },
];

// Calculate money saved per receipt (based on 2.75 min saved × $80/hr)
const MONEY_SAVED_PER_RECEIPT = (2.75 / 60) * 80; // ~$3.67

export default function PlayPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(7);
  const [inputValue, setInputValue] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [classificationResult, setClassificationResult] = useState<{
    category: string;
    taxCode: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice input hook
  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    toggleListening,
    resetTranscript,
  } = useVoiceInput({
    onResult: (text) => {
      setInputValue(text);
      // Auto-submit after voice input
      setTimeout(() => {
        handleSubmit(text);
      }, 500);
    },
  });

  // Update input value from transcript while listening
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const totalReceipts = mockReceipts.length;
  const currentReceipt = mockReceipts[currentIndex];
  const progress = ((currentIndex) / totalReceipts) * 100;

  // Check if we're done
  if (currentIndex >= totalReceipts) {
    return <CompletionScreen totalProcessed={totalReceipts} streak={streak} />;
  }

  const handleSubmit = (input: string) => {
    if (!input.trim()) return;

    // Simulate classification based on input
    const result = classifyInput(input, currentReceipt);
    setClassificationResult(result);
    setShowSlotMachine(true);
    setIsSpinning(true);

    // Reset spinning state after animation starts
    setTimeout(() => setIsSpinning(false), 100);
  };

  const handleSlotComplete = () => {
    // Wait a moment to show the result, then advance
    setTimeout(() => {
      setShowSlotMachine(false);
      setClassificationResult(null);
      setInputValue("");
      resetTranscript();
      setCurrentIndex((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    }, 1500);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
    setStreak(0); // Reset streak on skip
    setInputValue("");
    resetTranscript();
  };

  const handleUncertain = () => {
    setCurrentIndex((prev) => prev + 1);
    setStreak(0);
    setInputValue("");
    resetTranscript();
  };

  const handlePersonal = () => {
    setCurrentIndex((prev) => prev + 1);
    setInputValue("");
    resetTranscript();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(inputValue);
    }
  };

  // Get AI prompt based on confidence
  const getPrompt = () => {
    if (currentReceipt.confidence >= 0.85 && currentReceipt.suggestedCategory) {
      return `Looks like ${currentReceipt.suggestedCategory}, ${currentReceipt.suggestedTaxCode}. Confirm?`;
    } else if (currentReceipt.confidence >= 0.6 && currentReceipt.suggestedCategory) {
      return `Is this ${currentReceipt.suggestedCategory}?`;
    } else {
      return `What was this for?`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Exit</span>
          </Link>

          <div className="text-sm font-medium tabular-nums">
            {currentIndex + 1} of {totalReceipts}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span className="text-lg">🔥</span>
            <span className="font-medium tabular-nums">{streak}</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReceipt.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-2 gap-8 items-start"
          >
            {/* Receipt Image */}
            <Card className="overflow-hidden">
              <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-20 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg mb-3 mx-auto flex items-center justify-center">
                    <span className="text-3xl">🧾</span>
                  </div>
                  <p className="text-sm font-medium">{currentReceipt.vendor}</p>
                  <p className="text-xs text-muted-foreground">{currentReceipt.date}</p>
                </div>
              </div>
            </Card>

            {/* Classification Panel */}
            <div className="space-y-6">
              {/* Receipt Info */}
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {currentReceipt.vendor}
                </h1>
                <p className="text-4xl font-bold text-foreground tabular-nums">
                  ${currentReceipt.amount.toFixed(2)}
                </p>
                <p className="text-muted-foreground mt-1">{currentReceipt.date}</p>
              </div>

              <div className="border-t border-border pt-6">
                {/* AI Prompt */}
                <p className="text-lg text-foreground mb-4">{getPrompt()}</p>

                {/* Input Area */}
                {!showSlotMachine && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={
                            currentReceipt.confidence >= 0.85
                              ? 'Say "yes" to confirm...'
                              : "Describe this expense..."
                          }
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-lg"
                        />
                        {isListening && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-sm text-primary">Listening...</span>
                          </span>
                        )}
                      </div>
                      {voiceSupported && (
                        <Button
                          size="lg"
                          variant={isListening ? "default" : "outline"}
                          onClick={toggleListening}
                          className={cn(
                            "px-4 transition-all",
                            isListening && "bg-primary animate-pulse"
                          )}
                        >
                          <Mic className="w-5 h-5" />
                        </Button>
                      )}
                    </div>

                    {/* Quick Submit for high confidence */}
                    {currentReceipt.confidence >= 0.85 && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmit("yes")}
                          className="flex-1 h-12 text-base"
                        >
                          ✓ Yes, confirm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => inputRef.current?.focus()}
                          className="flex-1 h-12 text-base"
                        >
                          ✎ No, let me specify
                        </Button>
                      </div>
                    )}

                    {/* Submit button for low confidence */}
                    {currentReceipt.confidence < 0.85 && inputValue && (
                      <Button
                        onClick={() => handleSubmit(inputValue)}
                        className="w-full h-12 text-base"
                      >
                        Classify
                      </Button>
                    )}
                  </div>
                )}

                {/* Slot Machine */}
                <AnimatePresence>
                  {showSlotMachine && classificationResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="py-8"
                    >
                      <SlotMachine
                        category={classificationResult.category}
                        taxCode={classificationResult.taxCode}
                        moneySaved={MONEY_SAVED_PER_RECEIPT}
                        isSpinning={isSpinning}
                        onComplete={handleSlotComplete}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              {!showSlotMachine && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={handleSkip} className="gap-2">
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUncertain} className="gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Uncertain
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePersonal} className="gap-2">
                    <User className="w-4 h-4" />
                    Personal
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Keyboard shortcuts hint */}
      <footer className="border-t border-border bg-card px-4 py-2">
        <div className="max-w-5xl mx-auto flex justify-center gap-6 text-xs text-muted-foreground">
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> Submit</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded">Y</kbd> Yes</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded">S</kbd> Skip</span>
        </div>
      </footer>
    </div>
  );
}

// Simple classification logic (will be replaced with AI)
function classifyInput(
  input: string,
  receipt: (typeof mockReceipts)[0]
): { category: string; taxCode: string } {
  const lowerInput = input.toLowerCase();

  // If user confirms suggestion
  if (
    (lowerInput === "yes" || lowerInput === "confirm" || lowerInput === "yep" || lowerInput === "yeah") &&
    receipt.suggestedCategory
  ) {
    return {
      category: receipt.suggestedCategory,
      taxCode: receipt.suggestedTaxCode || "GST+PST 12%",
    };
  }

  // Simple keyword matching
  if (lowerInput.includes("fuel") || lowerInput.includes("gas") || lowerInput.includes("diesel")) {
    return { category: "Fuel & Oil", taxCode: "GST 5%" };
  }
  if (lowerInput.includes("parts") || lowerInput.includes("supplies")) {
    return { category: "Parts & Supplies", taxCode: "GST+PST 12%" };
  }
  if (lowerInput.includes("lunch") || lowerInput.includes("meal") || lowerInput.includes("food") || lowerInput.includes("coffee")) {
    return { category: "Meals & Ent.", taxCode: "GST 2.5%" };
  }
  if (lowerInput.includes("office")) {
    return { category: "Office Supplies", taxCode: "GST+PST 12%" };
  }
  if (lowerInput.includes("software") || lowerInput.includes("subscription")) {
    return { category: "Software", taxCode: "GST+PST 12%" };
  }
  if (lowerInput.includes("insurance")) {
    return { category: "Insurance", taxCode: "Exempt" };
  }
  if (lowerInput.includes("repair") || lowerInput.includes("maintenance")) {
    return { category: "Repairs & Maint.", taxCode: "GST+PST 12%" };
  }
  if (lowerInput.includes("tool")) {
    return { category: "Tools", taxCode: "GST+PST 12%" };
  }

  // Default fallback
  return { category: "General Expense", taxCode: "GST+PST 12%" };
}

// Completion Screen
function CompletionScreen({
  totalProcessed,
  streak,
}: {
  totalProcessed: number;
  streak: number;
}) {
  const timeSavedMinutes = totalProcessed * 2.75;
  const moneySaved = (timeSavedMinutes / 60) * 80;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              All caught up!
            </h1>
            <p className="text-muted-foreground mb-8">
              You crushed it! Here&apos;s your session summary.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-foreground tabular-nums">
                  {totalProcessed}
                </div>
                <div className="text-sm text-muted-foreground">
                  receipts processed
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary tabular-nums">
                  ${moneySaved.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">saved</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-medium text-foreground">{streak} streak</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="font-medium text-foreground">
                  {timeSavedMinutes.toFixed(0)} min saved
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/review">
                <Button size="lg" className="w-full">
                  Review & Sync to QuickBooks
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
