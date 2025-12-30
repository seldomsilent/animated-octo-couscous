"use client";

import { useState } from "react";
import {
  Link2,
  Link2Off,
  CheckCircle2,
  Mic,
  Bell,
  DollarSign,
  MapPin,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [qboConnected, setQboConnected] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [bookkeeperRate, setBookkeeperRate] = useState("80");
  const [province, setProvince] = useState("BC");

  const handleQboConnect = () => {
    // Simulate QBO connection
    setQboConnected(true);
  };

  const handleQboDisconnect = () => {
    setQboConnected(false);
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* QuickBooks Connection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      QuickBooks Connection
                      {qboConnected && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Connect your QuickBooks Online account to sync expenses
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {qboConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          Putney Construction Ltd.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Connected on Dec 15, 2024
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleQboDisconnect}>
                        <Link2Off className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last synced: Today at 2:34 PM
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleQboConnect} className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Connect to QuickBooks
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Tax Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Tax Rules
                </CardTitle>
                <CardDescription>
                  Configure tax codes for your province
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <select
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="BC">British Columbia (GST + PST)</option>
                    <option value="AB">Alberta (GST only)</option>
                    <option value="ON">Ontario (HST)</option>
                    <option value="QC">Quebec (GST + QST)</option>
                  </select>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Current tax rates:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span>GST: 5%</span>
                    <span>PST: 7%</span>
                    <span>Combined: 12%</span>
                    <span>M&E: 2.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Input
                </CardTitle>
                <CardDescription>
                  Configure speech recognition settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable voice input</Label>
                    <p className="text-sm text-muted-foreground">
                      Use your microphone to classify receipts
                    </p>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                      Sound effects
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds during the classification game
                    </p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Savings Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Savings Calculator
                </CardTitle>
                <CardDescription>
                  Set your local bookkeeper rate to calculate savings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Bookkeeper hourly rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={bookkeeperRate}
                    onChange={(e) => setBookkeeperRate(e.target.value)}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    At ${bookkeeperRate}/hr, each receipt saves you approximately{" "}
                    <span className="font-medium text-foreground">
                      ${((2.75 / 60) * parseFloat(bookkeeperRate || "0")).toFixed(2)}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Receipts ready to process</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new receipts arrive
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly report of your activity
                    </p>
                  </div>
                  <Switch
                    checked={weeklyReport}
                    onCheckedChange={setWeeklyReport}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Forwarding */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Forwarding</CardTitle>
                <CardDescription>
                  Forward receipts to this address to add them to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm font-mono">
                    rex-7x9k@receipts.receiptflash.com
                  </code>
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: Set up an email rule to auto-forward receipts from common vendors
                </p>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Delete all data</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete all your receipts and transactions
                    </p>
                  </div>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Delete Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
