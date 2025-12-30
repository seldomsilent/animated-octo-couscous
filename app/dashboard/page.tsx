"use client";

import { Play, Mail, Smartphone, Upload, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data - will be replaced with real data from API
const mockData = {
  pendingReceipts: 23,
  estimatedMinutes: 8,
  recentSources: [
    { source: "email", count: 12, label: "from email", date: "today" },
    { source: "scanner", count: 8, label: "from scanner", date: "yesterday" },
    { source: "phone", count: 3, label: "from phone", date: "Dec 27" },
  ],
  stats: {
    totalReceipts: 1247,
    dollarsClassified: 127432,
    hoursSaved: 62,
    moneySaved: 4960,
    currentStreak: 12,
    longestStreak: 34,
    avgSpeed: 22,
  },
};

const sourceIcons = {
  email: Mail,
  scanner: ScanLine,
  phone: Smartphone,
  upload: Upload,
};

export default function DashboardPage() {
  const { pendingReceipts, estimatedMinutes, recentSources, stats } = mockData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RF</span>
            </div>
            <span className="font-semibold text-foreground">ReceiptFlash</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rex Putney</span>
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Inbox Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {pendingReceipts} receipts waiting
            </span>
          </div>
        </div>

        {/* Play Button Card */}
        <Card className="mb-8 border-2 border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-8 text-center">
            <Link href="/play">
              <Button
                size="lg"
                className="h-20 px-12 text-xl font-semibold gap-3 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <Play className="w-8 h-8" fill="currentColor" />
                PLAY
              </Button>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Start classifying{" "}
              <span className="text-foreground font-medium">
                (est. {estimatedMinutes} minutes)
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Recent Sources */}
        <div className="mb-12">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent:</h3>
          <div className="space-y-2">
            {recentSources.map((item, index) => {
              const Icon = sourceIcons[item.source as keyof typeof sourceIcons];
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <Icon className="w-4 h-4" />
                  <span>
                    {item.count} receipts {item.label}{" "}
                    <span className="text-muted-foreground/60">({item.date})</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-border pt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            All time stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={stats.totalReceipts.toLocaleString()}
              label="receipts"
            />
            <StatCard
              value={`$${stats.dollarsClassified.toLocaleString()}`}
              label="classified"
            />
            <StatCard value={`${stats.hoursSaved} hrs`} label="saved" />
            <StatCard
              value={`$${stats.moneySaved.toLocaleString()}`}
              label="saved"
            />
          </div>

          {/* Streak & Speed */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-muted-foreground">
                Current streak:{" "}
                <span className="text-foreground font-medium">
                  {stats.currentStreak} days
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <span className="text-muted-foreground">
                Longest streak:{" "}
                <span className="text-foreground font-medium">
                  {stats.longestStreak} days
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-muted-foreground">
                Avg speed:{" "}
                <span className="text-foreground font-medium">
                  {stats.avgSpeed} sec/receipt
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
