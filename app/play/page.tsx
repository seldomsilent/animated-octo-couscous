"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Mic, MicOff, SkipForward, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SlotMachine } from "@/components/slot-machine";
import Link from "next/link";

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
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [classificationResult, setClassificationResult] = useState<{
    category: string;
    taxCode: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalReceipts = mockReceipts.length;
  const currentReceipt = mockReceipts[currentIndex];
  const progress = ((currentIndex + 1) / totalReceipts) * 100;

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
      setTranscription("");
      setCurrentIndex((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    }, 1500);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
    setStreak(0); // Reset streak on skip
    setTranscription("");
  };

  const handleUncertain = () => {
    // Mark as uncertain and move on
    setCurrentIndex((prev) => prev + 1);
    setStreak(0);
    setTranscription("");
  };

  const handlePersonal = () => {
    // Mark as personal and move on
    setCurrentIndex((prev) => prev + 1);
    // Keep streak for personal items
    setTranscription("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(transcription);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // TODO: Implement actual speech recognition
  };

  // Get AI prompt based on confidence
  const getPrompt = () => {
    if (currentReceipt.confidence >= 0.85 && currentReceipt.suggestedCategory) {
      return `${currentReceipt.vendor} — looks like ${currentReceipt.suggestedCategory}, ${currentReceipt.suggestedTaxCode}. Confirm?`;
    } else if (currentReceipt.confidence >= 0.6 && currentReceipt.suggestedCategory) {
      return `${currentReceipt.vendor} — is this ${currentReceipt.suggestedCategory}?`;
    } else {
      return `What was this $${currentReceipt.amount.toFixed(2)} at ${currentReceipt.vendor} for?`;
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
            <span className="text-sm">Back</span>
          </Link>

          <div className="text-sm font-medium">
            {currentIndex + 1} of {totalReceipts}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span className="text-lg">🔥</span>
            <span className="font-medium">{streak} streak</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-1 text-right">
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Receipt Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] bg-muted flex items-center justify-center">
              {/* Placeholder for receipt image */}
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-20 border-2 border-dashed border-muted-foreground/30 rounded mb-2 mx-auto" />
                <p className="text-sm">Receipt Image</p>
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
              <p className="text-3xl font-bold text-foreground tabular-nums">
                ${currentReceipt.amount.toFixed(2)}
              </p>
              <p className="text-muted-foreground">{currentReceipt.date}</p>
            </div>

            <div className="border-t border-border pt-6">
              {/* AI Prompt */}
              <p className="text-foreground mb-4">{getPrompt()}</p>

              {/* Input Area */}
              {!showSlotMachine && (
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        currentReceipt.confidence >= 0.85
                          ? 'Say "yes" to confirm...'
                          : "Describe this expense..."
                      }
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {isListening && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary animate-pulse">
                        Listening...
                      </span>
                    )}
                  </div>
                  <Button
                    size="lg"
                    variant={isListening ? "default" : "outline"}
                    onClick={toggleListening}
                    className={`px-4 ${isListening ? "bg-primary" : ""}`}
                  >
                    {isListening ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              )}

              {/* Slot Machine */}
              {showSlotMachine && classificationResult && (
                <div className="py-6">
                  <SlotMachine
                    category={classificationResult.category}
                    taxCode={classificationResult.taxCode}
                    moneySaved={MONEY_SAVED_PER_RECEIPT}
                    isSpinning={isSpinning}
                    onComplete={handleSlotComplete}
                  />
                </div>
              )}

              {/* Quick Submit for high confidence */}
              {!showSlotMachine && currentReceipt.confidence >= 0.85 && (
                <div className="flex gap-2 mb-6">
                  <Button
                    onClick={() => handleSubmit("yes")}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Yes, confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputRef.current?.focus()}
                    className="flex-1"
                  >
                    No, let me specify
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!showSlotMachine && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleSkip}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
                <Button variant="outline" size="sm" onClick={handleUncertain}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Uncertain
                </Button>
                <Button variant="outline" size="sm" onClick={handlePersonal}>
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
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
    (lowerInput === "yes" || lowerInput === "confirm" || lowerInput === "yep") &&
    receipt.suggestedCategory
  ) {
    return {
      category: receipt.suggestedCategory,
      taxCode: receipt.suggestedTaxCode || "GST+PST 12%",
    };
  }

  // Simple keyword matching
  if (lowerInput.includes("fuel") || lowerInput.includes("gas")) {
    return { category: "Fuel & Oil", taxCode: "GST 5%" };
  }
  if (lowerInput.includes("parts") || lowerInput.includes("supplies")) {
    return { category: "Parts & Supplies", taxCode: "GST+PST 12%" };
  }
  if (lowerInput.includes("lunch") || lowerInput.includes("meal") || lowerInput.includes("food")) {
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
  if (lowerInput.includes("repair")) {
    return { category: "Repairs", taxCode: "GST+PST 12%" };
  }

  // Default fallback
  return { category: "General", taxCode: "GST+PST 12%" };
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
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">All caught up!</h1>
          <p className="text-muted-foreground mb-8">Great work on this session</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">{totalProcessed}</div>
              <div className="text-sm text-muted-foreground">receipts processed</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                ${moneySaved.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">saved</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-muted-foreground">
            <span className="text-lg">🔥</span>
            <span>
              Streak: <span className="font-medium text-foreground">{streak}</span>
            </span>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
              Sync to QuickBooks
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
