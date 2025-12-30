"use client";

import { Play, Mail, Smartphone, Upload, ScanLine, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { motion } from "framer-motion";

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
  recentActivity: [
    { vendor: "Esso Cardlock", amount: 127.43, category: "Fuel & Oil", date: "2 hours ago" },
    { vendor: "Lordco Auto Parts", amount: 342.18, category: "Parts & Supplies", date: "2 hours ago" },
    { vendor: "Tim Hortons", amount: 14.67, category: "Meals & Ent.", date: "Yesterday" },
  ],
};

const sourceIcons = {
  email: Mail,
  scanner: ScanLine,
  phone: Smartphone,
  upload: Upload,
};

export default function DashboardPage() {
  const { pendingReceipts, estimatedMinutes, recentSources, stats, recentActivity } = mockData;

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Rex</p>
            </div>
            <Link href="/upload">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Receipts
              </Button>
            </Link>
          </div>

          {/* Main Inbox Card */}
          {pendingReceipts > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-primary">
                          {pendingReceipts} receipts waiting
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        Ready to classify?
                      </h2>
                      <p className="text-muted-foreground">
                        Estimated time: {estimatedMinutes} minutes
                      </p>
                    </div>
                    <Link href="/play">
                      <Button
                        size="lg"
                        className="h-16 px-10 text-lg font-semibold gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                      >
                        <Play className="w-6 h-6" fill="currentColor" />
                        PLAY
                      </Button>
                    </Link>
                  </div>

                  {/* Recent Sources */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Recent arrivals:</p>
                    <div className="flex flex-wrap gap-4">
                      {recentSources.map((item, index) => {
                        const Icon = sourceIcons[item.source as keyof typeof sourceIcons];
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Icon className="w-4 h-4" />
                            <span>
                              {item.count} {item.label}
                              <span className="text-muted-foreground/60 ml-1">
                                ({item.date})
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="mb-8 border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScanLine className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  All caught up! 🎉
                </h2>
                <p className="text-muted-foreground mb-4">
                  No receipts waiting to be classified
                </p>
                <Link href="/upload">
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload More Receipts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              value={stats.totalReceipts.toLocaleString()}
              label="receipts processed"
              icon={<ScanLine className="w-4 h-4" />}
            />
            <StatCard
              value={`$${stats.dollarsClassified.toLocaleString()}`}
              label="classified"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <StatCard
              value={`${stats.hoursSaved} hrs`}
              label="time saved"
              trend="+2.5 this week"
            />
            <StatCard
              value={`$${stats.moneySaved.toLocaleString()}`}
              label="money saved"
              trend="+$320 this month"
              highlight
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Streaks & Speed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <p className="font-medium text-foreground">Current streak</p>
                      <p className="text-sm text-muted-foreground">Keep it going!</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    {stats.currentStreak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-medium text-foreground">Best streak</p>
                      <p className="text-sm text-muted-foreground">Your record</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    {stats.longestStreak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="font-medium text-foreground">Avg speed</p>
                      <p className="text-sm text-muted-foreground">Per receipt</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    {stats.avgSpeed}s
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.vendor}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.category} · {item.date}
                        </p>
                      </div>
                      <span className="font-medium tabular-nums">
                        ${item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/review">
                  <Button variant="link" className="w-full mt-4 text-primary">
                    View all transactions →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  value,
  label,
  icon,
  trend,
  highlight,
}: {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          {icon}
          <span className="text-xs uppercase tracking-wide">{label}</span>
        </div>
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </div>
        {trend && (
          <p className="text-xs text-green-600 mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}
