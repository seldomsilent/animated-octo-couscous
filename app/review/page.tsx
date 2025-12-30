"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  User, 
  Edit2, 
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppLayout } from "@/components/app-layout";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    date: "2024-12-28",
    vendor: "Esso Cardlock",
    amount: 127.43,
    description: "Fuel for F350",
    category: "Fuel & Oil",
    taxCode: "GST 5%",
    status: "classified",
  },
  {
    id: "2",
    date: "2024-12-27",
    vendor: "Lordco Auto Parts",
    amount: 342.18,
    description: "Brake pads for service truck",
    category: "Parts & Supplies",
    taxCode: "GST+PST 12%",
    status: "classified",
  },
  {
    id: "3",
    date: "2024-12-26",
    vendor: "Tim Hortons",
    amount: 14.67,
    description: "Coffee with client",
    category: "Meals & Ent.",
    taxCode: "GST 2.5%",
    status: "classified",
  },
  {
    id: "4",
    date: "2024-12-24",
    vendor: "Canadian Tire",
    amount: 89.99,
    description: null,
    category: null,
    taxCode: null,
    status: "uncertain",
  },
  {
    id: "5",
    date: "2024-12-23",
    vendor: "Amazon",
    amount: 45.67,
    description: "Personal purchase",
    category: null,
    taxCode: null,
    status: "personal",
  },
  {
    id: "6",
    date: "2024-12-22",
    vendor: "Shell",
    amount: 98.50,
    description: "Diesel for excavator",
    category: "Fuel & Oil",
    taxCode: "GST 5%",
    status: "classified",
  },
];

// Group transactions by category for summary
const categoryTotals = mockTransactions
  .filter((t) => t.status === "classified" && t.category)
  .reduce((acc, t) => {
    if (!acc[t.category!]) {
      acc[t.category!] = { count: 0, total: 0 };
    }
    acc[t.category!].count += 1;
    acc[t.category!].total += t.amount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredTransactions = mockTransactions.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "ready") return t.status === "classified";
    if (activeTab === "uncertain") return t.status === "uncertain";
    if (activeTab === "personal") return t.status === "personal";
    return true;
  });

  const readyCount = mockTransactions.filter((t) => t.status === "classified").length;
  const uncertainCount = mockTransactions.filter((t) => t.status === "uncertain").length;
  const personalCount = mockTransactions.filter((t) => t.status === "personal").length;
  const totalAmount = mockTransactions
    .filter((t) => t.status === "classified")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      alert("Synced to QuickBooks! (Demo)");
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "classified":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        );
      case "uncertain":
        return (
          <Badge variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <HelpCircle className="w-3 h-3 mr-1" />
            Uncertain
          </Badge>
        );
      case "personal":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <User className="w-3 h-3 mr-1" />
            Personal
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Review Transactions
              </h1>
              <p className="text-muted-foreground">
                Review and edit before posting to QuickBooks
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={handleSync}
                disabled={isSyncing || readyCount === 0}
                className="gap-2"
              >
                {isSyncing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Sync to QuickBooks
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {readyCount}
                </div>
                <div className="text-sm text-muted-foreground">Ready to post</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground tabular-nums">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">Total amount</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">
                  {uncertainCount}
                </div>
                <div className="text-sm text-muted-foreground">Uncertain</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-500">
                  {personalCount}
                </div>
                <div className="text-sm text-muted-foreground">Personal</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(categoryTotals).map(([category, data]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">
                        {category}
                      </span>
                      <span className="text-muted-foreground">
                        ({data.count})
                      </span>
                    </div>
                    <span className="font-medium tabular-nums">
                      ${data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">
                    All ({mockTransactions.length})
                  </TabsTrigger>
                  <TabsTrigger value="ready">
                    Ready ({readyCount})
                  </TabsTrigger>
                  <TabsTrigger value="uncertain">
                    Uncertain ({uncertainCount})
                  </TabsTrigger>
                  <TabsTrigger value="personal">
                    Personal ({personalCount})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tax Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.vendor}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        ${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {transaction.description || "—"}
                      </TableCell>
                      <TableCell>
                        {transaction.category || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.taxCode || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
