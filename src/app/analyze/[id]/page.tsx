"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackgrounds } from "@/components/ui/hero-1";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateDaysFromNow,
  formatCurrency,
  formatDaysDifference,
  formatLargeNumber,
} from "@/lib/utils";
import { SecurityAnalysis } from "@/type";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  DollarSign,
  ExternalLink,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getSessionIdForToken } from "@/lib/utils";

export default function SentinelDashboard() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello 👋 I can explain this token's trust analysis. Ask me anything about the security risks or patterns.",
    },
  ]);
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const analysisData = urlParams.get("data");

    if (analysisData) {
      try {
        const parsedData = JSON.parse(analysisData);

        if (parsedData && parsedData.metadata && parsedData.metadata.symbol) {
          setAnalysis(parsedData);
		  setSessionId(getSessionIdForToken(parsedData.metadata.tokenName))
        } else {
          throw new Error("Invalid analysis data structure");
        }
      } catch (error) {
        console.error("Error parsing analysis data:", error);
        toast.error("Invalid Analysis Data", {
          description:
            "The token analysis data is corrupted. Please try analyzing again.",
          className: "!bg-red-500 !text-white",
        });
      }
    } else {
      toast.error("No Analysis Data", {
        description:
          "No token analysis data found. Please analyze a token first.",
        className: "!bg-red-500 !text-white",
      });
    }

    setLoading(false);
  }, []);
  
  console.log(sessionId)
  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
	
	/*
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Based on the contract code, I found that the liquidity pool can be withdrawn by the creator without notice.",
        },
      ]);
    }, 1000);
	*/
	
	setInput("");	
	const res = await fetch("/api/chat", {
		method: "POST",
		body: JSON.stringify({ sessionId: sessionId, message: input, analysis })
	})
	
	//TODO: add conditional
	const { reply } = await res.json()
	console.log(reply)
	setMessages((prev)=>[
		...prev,
		{
			role: "model",
			text: reply
		}
	])
  };

  const getTokenName = () => analysis?.metadata?.tokenName || "Unknown Token";
  const getTokenSymbol = () => analysis?.metadata?.symbol || "UNKNOWN";
  const getRiskLevel = () => analysis?.riskLevel || "medium";
  const getTrustScore = () => analysis?.trustScore || 0;
  const getCreatedAt = () =>
    formatDaysDifference(
      calculateDaysFromNow(analysis?.metadata?.createdAt || "N/A")
    );
  const getHolders = () => formatLargeNumber(analysis?.metadata?.holders || 0);
  const getLiquidity = () => formatCurrency(analysis?.metadata?.liquidity || 0);
  const getMarketCap = () => formatCurrency(analysis?.metadata?.marketCap || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0c0414] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0c0414] text-white">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-gray-400 mb-4">
            The token analysis data is unavailable or invalid.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Analyze Another Token
          </Button>
        </div>
      </div>
    );
  }

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
                <h2 className="text-2xl font-semibold">
                  {getTokenName()} ({getTokenSymbol()})
                </h2>
                <Badge
                  variant={
                    getRiskLevel() === "critical" || getRiskLevel() === "high"
                      ? "destructive"
                      : getRiskLevel() === "medium"
                      ? "secondary"
                      : "default"
                  }
                  className="text-sm"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {getRiskLevel().toUpperCase()} Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Solana token created {getCreatedAt()} • {getHolders()}{" "}
                holders
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
                <span
                  className={`text-2xl font-bold ${
                    getTrustScore() >= 70
                      ? "text-green-400"
                      : getTrustScore() >= 40
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {getTrustScore()}%
                </span>
              </div>
              <Progress
                value={getTrustScore()}
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
                    <div className="text-2xl font-bold">
                      {getLiquidity().toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Liquidity</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold">
                      {getMarketCap().toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Market Cap</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">
                      {getHolders().toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Holders</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">{getCreatedAt()}</div>
                    <div className="text-xs text-gray-400">Age (days)</div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Factors */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Risk Factors Detected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.riskFactors && analysis.riskFactors.length > 0 ? (
                    analysis.riskFactors.slice(0, 3).map((factor, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          factor.severity === "critical" ||
                          factor.severity === "high"
                            ? "bg-red-400/10"
                            : "bg-yellow-400/10"
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 flex-shrink-0 ${
                            factor.severity === "critical" ||
                            factor.severity === "high"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{factor.factor}</div>
                          <div className="text-sm text-gray-400">
                            {factor.description}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No specific risk factors identified
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks">
              <div className="space-y-3">
                {analysis.riskFactors && analysis.riskFactors.length > 0 ? (
                  analysis.riskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="font-medium block">
                          {factor.factor}
                        </span>
                        <span className="text-sm text-gray-400">
                          {factor.description}
                        </span>
                      </div>
                      <Badge
                        variant={
                          factor.severity === "critical"
                            ? "destructive"
                            : factor.severity === "high"
                            ? "destructive"
                            : factor.severity === "medium"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {factor.severity}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No risk factors available for this token
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="similar">
              <div className="text-center py-8 text-gray-400">
                Similar tokens analysis coming soon...
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
				  {msg.role === "model" && (
					<div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
					  <Shield className="w-3 h-3 text-blue-400" />
					</div>
				  )}
				  <div className="text-sm leading-relaxed prose prose-invert max-w-none">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
					  {msg.text}
					</ReactMarkdown>
				  </div>
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
              onClick={() =>
                setInput("Explain the liquidity risks for this token")
              }
            >
              Explain liquidity risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex-1 border-gray-700"
              onClick={() => setInput("What are the contract security issues?")}
            >
              Show contract issues
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
