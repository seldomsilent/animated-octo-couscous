import { Receipt, Mic, Zap, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Receipt className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">ReceiptFlash</h1>
          </div>

          {/* Tagline */}
          <p className="text-xl text-muted-foreground">
            Scan your receipts. Play the game. Books are done.
          </p>

          {/* Description */}
          <p className="text-lg text-foreground/80 leading-relaxed">
            Receipts flow in, you blast through them in a flashcard game, and 
            everything syncs to QuickBooks. Make bookkeeping so fast it&apos;s actually fun.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Inbox</h3>
              <p className="text-sm text-muted-foreground text-center">
                Email, scan, or upload receipts
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Play</h3>
              <p className="text-sm text-muted-foreground text-center">
                Voice or text, slot machine rewards
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sync</h3>
              <p className="text-sm text-muted-foreground text-center">
                One click to QuickBooks
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                <Play className="w-5 h-5" fill="currentColor" />
                Try Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Get Started
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 text-sm text-muted-foreground">
          Replace your bookkeeper. Save $4,960/year.
        </p>
      </div>
    </main>
  );
}
