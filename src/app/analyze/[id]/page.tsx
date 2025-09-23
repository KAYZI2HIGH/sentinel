"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackgrounds } from "@/components/ui/hero-1";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  DollarSign,
  ExternalLink,
  Shield,
  Users
} from "lucide-react";
import { useState } from "react";

export default function SentinelDashboard() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello 👋 I can explain this token's trust analysis. Ask me anything about RuggyCoin's security risks or patterns.",
    },
    {
      role: "ai",
      text: "I've detected 3 major risk factors and 2 suspicious activities in this token.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Based on the contract code, I found that the liquidity pool can be withdrawn by the creator without notice.",
        },
      ]);
    }, 1000);

    setInput("");
  };

  const riskFactors = [
    { label: "Contract Verification", value: "Not Verified", risk: "high" },
    { label: "Liquidity Lock", value: "No Lock", risk: "high" },
    { label: "Holder Distribution", value: "Concentrated", risk: "medium" },
    { label: "Trading Activity", value: "Artificial", risk: "medium" },
    { label: "Creator Reputation", value: "Unknown", risk: "high" },
  ];

  const similarTokens = [
    { name: "SafeMoonV2", score: "87%", change: "+2%", trusted: true },
    { name: "DogeCoin", score: "92%", change: "+1%", trusted: true },
    { name: "ScamTokenXYZ", score: "15%", change: "-5%", trusted: false },
  ];

  return (
    <div className="flex relative h-screen overflow-x-hidden bg-[#0c0414] text-white">
      <GradientBackgrounds />

      {/* Left side → Analysis */}
      <main className="flex-1 p-6 pr-2">
        <ScrollArea className="border h-full bg-gray-900/80 rounded-xl p-8 shadow-sm">
          {/* Header with quick stats */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold">RuggyCoin (RUGGY)</h2>
                <Badge
                  variant="destructive"
                  className="text-sm"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  High Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Solana token created 3 days ago • 2,145 holders
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>

          {/* Trust Score Card */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Overall Trust Score</span>
                <span className="text-2xl font-bold text-red-400">21%</span>
              </div>
              <Progress
                value={21}
                className="h-2 bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Risky</span>
                <span>Moderate</span>
                <span>Safe</span>
              </div>
            </CardContent>
          </Card>

          <Tabs
            defaultValue="analysis"
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger
                value="analysis"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger
                value="risks"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Risk Factors
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Similar Tokens
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="analysis"
              className="space-y-6"
            >
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">$120K</div>
                    <div className="text-xs text-gray-400">Liquidity</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold">$45K</div>
                    <div className="text-xs text-gray-400">24h Volume</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">2,145</div>
                    <div className="text-xs text-gray-400">Holders</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">3 days</div>
                    <div className="text-xs text-gray-400">Age</div>
                  </CardContent>
                </Card>
              </div>

              {/* Suspicious Patterns */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Suspicious Patterns Detected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-400/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Copied contract code</div>
                      <div className="text-sm text-gray-400">
                        Matches known scam token patterns
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-400/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Unverified creator</div>
                      <div className="text-sm text-gray-400">
                        Creator wallet has no transaction history
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-400/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Artificial volume</div>
                      <div className="text-sm text-gray-400">
                        70% of trades are wash trading
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks">
              <div className="space-y-3">
                {riskFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <span className="font-medium">{factor.label}</span>
                    <Badge
                      variant={
                        factor.risk === "high" ? "destructive" : "secondary"
                      }
                    >
                      {factor.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="similar">
              <div className="space-y-3">
                {similarTokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          token.trusted ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      <span className="font-medium">{token.name}</span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          token.trusted ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {token.score}
                      </div>
                      <div
                        className={`text-xs ${
                          token.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </main>

      {/* Right side → AI Chat */}
      <aside className="w-[380px] flex flex-col ">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            AI Security Analyst
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Ask questions about this analysis
          </p>
        </div>

        <ScrollArea className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-blue-500/20 ml-auto border border-blue-500/30"
                    : "bg-gray-800/50 border border-gray-700 mr-auto"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-gray-800">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about security risks..."
              className="flex-1 bg-gray-800/50 border-gray-700"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 border-gray-700"
            >
              Explain liquidity risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 border-gray-700"
            >
              Show contract code
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
