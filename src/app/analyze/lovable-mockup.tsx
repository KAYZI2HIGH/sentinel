"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  AlertTriangle,
  BarChart3,
  Shield,
  Users,
  ExternalLink,
  DollarSign,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react";

import { getSessionIdForToken } from "@/lib/utils";

// Mock data structure - replace with your actual props interface
interface AnalyticsData {
  responseData: {
    success: boolean;
    metadata?: { id: string }; //dummy inference
    price: {
      value: number;
      liquidity: number;
      priceChange24h: number;
    };
    extractedInfo: {
      tokenName: string;
      symbol: string;
      creator: string;
      createdAt: string;
      holders: number;
      liquidity: number;
      marketCap: number;
      price: number;
      volume24h: number;
      isMutable: boolean;
      royaltyModel: string;
      hasPriceData: boolean;
      hasLiquidity: boolean;
    };
    basicInfo: {
      address: string;
      timestamp: string;
    };
    transactions: string[];
  };
  analysis: {
    trustScore: number;
    riskLevel: string;
    riskFactors: Array<{
      factor: string;
      severity: string;
      description: string;
      evidence?: string;
      impact?: string;
    }>;
    categoryScores: {
      contractSecurity: number;
      marketIntegrity: number;
      creatorCredibility: number;
      transactionPatterns: number;
      communityTrust: number;
    };
    recommendations: string[];
    alerts: string[];
    summary: string;
    confidence: number;
  };
}

// Mock data for preview
const mockData: AnalyticsData = {
  responseData: {
    success: true,
    //metadata: {},
    price: {
      value: 0.4396,
      liquidity: 793317.99,
      priceChange24h: 1.23,
    },
    extractedInfo: {
      tokenName: "Jupiter",
      symbol: "JUP",
      creator: "Unknown",
      createdAt: "2025-09-28",
      holders: 30767654042599,
      liquidity: 793317.99,
      marketCap: 3076765404259930,
      price: 0.4396,
      volume24h: 1.23,
      isMutable: true,
      royaltyModel: "creators",
      hasPriceData: true,
      hasLiquidity: true,
    },
    basicInfo: {
      address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      timestamp: "2025-09-28T17:49:04.682Z",
    },
    transactions: [],
  },
  analysis: {
    trustScore: 70,
    riskLevel: "moderate",
    riskFactors: [
      {
        factor: "Mutable Contract",
        severity: "medium",
        description: "The token's mutability introduces potential for undesirable changes",
        evidence: "isMutable: true",
        impact: "Reduced trust",
      },
      {
        factor: "Unknown Creator",
        severity: "medium",
        description: "Creator identity is not verified, posing reputation risks",
        evidence: "creator: Unknown",
        impact: "Trust concerns",
      },
      {
        factor: "Low volume",
        severity: "low",
        description: "The low trading volume poses minor risks.",
      },
    ],
    categoryScores: {
      contractSecurity: 60,
      marketIntegrity: 70,
      creatorCredibility: 55,
      transactionPatterns: 70,
      communityTrust: 65,
    },
    recommendations: [
      "Exercise caution due to contract mutability.",
      "Investigate creator's reputation before significant investment.",
      "Monitor volume changes.",
    ],
    alerts: [
      "Verify the token smart contract address and metadata against reliable sources, especially if you are unsure of the token's legitimacy.",
    ],
    summary: "Jupiter (JUP) shows moderate security risks due to its mutability and the unknown identity of its creator, but a safe range liquidity.",
    confidence: 0.7,
  },
};

const GradientBackgrounds = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
  </div>
);

const AnalyticsPage: React.FC<{ data?: AnalyticsData }> = ({ 
  data = mockData 
}) => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello 👋 I can explain this token's trust analysis. Ask me anything about the security risks or patterns.",
    },
  ]);
  const [input, setInput] = useState("");
  //Distinguish betweeen lovable analysis variable and actual state
  const [analysis_, setAnalysis] = useState<AnalyticsData | null>(null)//useState<SecurityAnalysis | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null)
  //const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
	setSessionId(getSessionIdForToken("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"));
	setAnalysis(data)
  }, [data])
  


  //console.log(sessionId)
  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
	
	setInput("");	
	const res = await fetch("/api/chat", {
		method: "POST",
		body: JSON.stringify({ sessionId: sessionId, message: input, analysis: analysis_ })
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

  const { responseData, analysis } = data;
  const { extractedInfo } = responseData;

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
      case "moderate":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  };

  const getScoreData = () => {
    return Object.entries(analysis.categoryScores).map(([category, score]) => ({
      category: category.replace(/([A-Z])/g, ' $1').trim(),
      score,
      fill: getScoreColor(score),
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(142, 76%, 36%)"; // green
    if (score >= 60) return "hsl(47, 96%, 53%)"; // yellow
    if (score >= 40) return "hsl(25, 95%, 53%)"; // orange
    return "hsl(0, 84%, 60%)"; // red
  };

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
                  {extractedInfo.tokenName} ({extractedInfo.symbol})
                </h2>
                <Badge
                  variant={getRiskBadgeVariant(analysis.riskLevel)}
                  className="text-sm"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {analysis.riskLevel.toUpperCase()} Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Solana token created {extractedInfo.createdAt} • {formatNumber(extractedInfo.holders)} holders
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
                <span className={`text-2xl font-bold ${getTrustScoreColor(analysis.trustScore)}`}>
                  {analysis.trustScore}%
                </span>
              </div>
              <Progress
                value={analysis.trustScore}
                className="h-2 bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Risky</span>
                <span>Moderate</span>
                <span>Safe</span>
              </div>
              <div className="mt-3 text-xs text-gray-300">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Risk Factors
              </TabsTrigger>
              <TabsTrigger value="scores" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Scores
              </TabsTrigger>
              <TabsTrigger value="similar" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Similar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-lg font-bold">
                      {formatCurrency(extractedInfo.liquidity)}
                    </div>
                    <div className="text-xs text-gray-400">Liquidity</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-lg font-bold">
                      ${formatNumber(extractedInfo.marketCap)}
                    </div>
                    <div className="text-xs text-gray-400">Market Cap</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-lg font-bold">
                      {formatNumber(extractedInfo.holders)}
                    </div>
                    <div className="text-xs text-gray-400">Holders</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-lg font-bold">
                      {extractedInfo.volume24h > 0 ? '+' : ''}{extractedInfo.volume24h}%
                    </div>
                    <div className="text-xs text-gray-400">24h Change</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                    <div className="text-lg font-bold">{formatCurrency(extractedInfo.price)}</div>
                    <div className="text-xs text-gray-400">Current Price</div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Score Breakdown Chart */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Security Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      score: {
                        label: "Score",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getScoreData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="category" 
                          stroke="rgba(255,255,255,0.6)"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        />
                        <Bar 
                          dataKey="score" 
                          fill="hsl(var(--chart-1))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {Object.entries(analysis.categoryScores).map(([category, score]) => (
                      <div key={category} className="text-center">
                        <div className={`text-lg font-bold ${getTrustScoreColor(score)}`}>
                          {score}%
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Token Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="w-5 h-5 text-blue-400" />
                      Token Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address</span>
                      <span className="text-sm font-mono">{responseData.basicInfo.address.slice(0, 8)}...{responseData.basicInfo.address.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Creator</span>
                      <span className="text-sm">{extractedInfo.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mutable</span>
                      <Badge variant={extractedInfo.isMutable ? "destructive" : "default"}>
                        {extractedInfo.isMutable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Royalty Model</span>
                      <span className="text-sm capitalize">{extractedInfo.royaltyModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Has Liquidity</span>
                      <Badge variant={extractedInfo.hasLiquidity ? "default" : "destructive"}>
                        {extractedInfo.hasLiquidity ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/30 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed mb-4">{analysis.summary}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-gray-400">Confidence: {Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <Badge variant={getRiskBadgeVariant(analysis.riskLevel)} className="capitalize">
                        {analysis.riskLevel} Risk
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Risk Factors Preview */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Critical Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.riskFactors.slice(0, 3).map((factor, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        factor.severity === "critical" || factor.severity === "high"
                          ? "bg-red-400/10 border-red-400/20"
                          : factor.severity === "medium"
                          ? "bg-yellow-400/10 border-yellow-400/20"
                          : "bg-blue-400/10 border-blue-400/20"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          factor.severity === "critical" || factor.severity === "high"
                            ? "text-red-400"
                            : factor.severity === "medium"
                            ? "text-yellow-400"
                            : "text-blue-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-medium mb-1">{factor.factor}</div>
                        <div className="text-sm text-gray-400 mb-2">{factor.description}</div>
                        {factor.evidence && (
                          <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded mb-1">
                            <strong>Evidence:</strong> {factor.evidence}
                          </div>
                        )}
                        {factor.impact && (
                          <div className="text-xs text-gray-500">
                            <strong>Impact:</strong> {factor.impact}
                          </div>
                        )}
                      </div>
                      <Badge variant={getRiskBadgeVariant(factor.severity)} className="mt-1">
                        {factor.severity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              {analysis.riskFactors.map((factor, index) => (
                <Card key={index} className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-lg mb-1">{factor.factor}</div>
                        <p className="text-gray-400 text-sm mb-2">{factor.description}</p>
                        {factor.evidence && (
                          <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded">
                            Evidence: {factor.evidence}
                          </div>
                        )}
                        {factor.impact && (
                          <div className="text-xs text-gray-500 mt-1">
                            Impact: {factor.impact}
                          </div>
                        )}
                      </div>
                      <Badge variant={getRiskBadgeVariant(factor.severity)}>
                        {factor.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Recommendations */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scores" className="space-y-4">
              {Object.entries(analysis.categoryScores).map(([category, score]) => (
                <Card key={category} className="bg-gray-800/30 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-xl font-bold ${getTrustScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2 bg-gray-700" />
                  </CardContent>
                </Card>
              ))}
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
      <aside className="w-[380px] flex flex-col">
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
              onClick={() => setInput("Explain the liquidity risks for this token")}
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
};

export default AnalyticsPage;