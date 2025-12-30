import { Receipt, Mic, Zap } from "lucide-react";

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
            AI Bookkeeping Assistant
          </p>

          {/* Description */}
          <p className="text-lg text-foreground/80 leading-relaxed">
            Flip through receipts like flashcards. Speak or type what each one is.
            Let AI handle the accounting details.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground text-center">
                Drop all your receipts at once
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Classify</h3>
              <p className="text-sm text-muted-foreground text-center">
                Speak or type what each one is
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="p-2 bg-accent rounded-lg mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sync</h3>
              <p className="text-sm text-muted-foreground text-center">
                Post to QuickBooks automatically
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Get Started
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 text-sm text-muted-foreground">
          Built for small business owners who hate bookkeeping
        </p>
      </div>
    </main>
  );
}
