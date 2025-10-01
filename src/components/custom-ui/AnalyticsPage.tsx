"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SecurityBarChart } from "@/components/ui/BarChat";
import {
  cn,
  formatCurrency,
  formatLargeNumber,
  formatLargeNumberRounded,
  getRiskBadgeVariant,
  getScoreData,
  getSessionIdForToken,
  getTrustScoreColor,
} from "@/lib/utils";
import { AnalyticsData } from "@/type";

const AnalyticsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [analysisData, setAnalysisData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setAnalysisData(decodedData);
      } catch (err) {
        setError("Invalid data format");
        console.error("Error parsing analysis data:", err);
      }
    } else {
      setError("No analysis data found");
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#18181B] rounded-xl">
        <div className="text-white">Loading analysis...</div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#18181B] rounded-xl">
        <div className="text-red-400 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Analysis Failed</p>
          <p className="text-gray-400">{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  const { extractedInfo, analysis } = analysisData;

  if (!extractedInfo || !analysis) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#18181B] rounded-xl">
        <div className="text-red-400 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Invalid Data</p>
          <p className="text-gray-400">
            Analysis data is incomplete or malformed
          </p>
        </div>
      </div>
    );
  }

  const safeExtractedInfo = {
    tokenName: extractedInfo.tokenName || "Unknown Token",
    symbol: extractedInfo.symbol || "UNKNOWN",
    creator: extractedInfo.creator || "Unknown",
    createdAt: extractedInfo.createdAt || "Unknown",
    holders: extractedInfo.holders || 0,
    liquidity: extractedInfo.liquidity || 0,
    marketCap: extractedInfo.marketCap || 0,
    price: extractedInfo.price || 0,
    volume24h: extractedInfo.volume24h || 0,
    isMutable: extractedInfo.isMutable || false,
    royaltyModel: extractedInfo.royaltyModel || "Unknown",
    hasLiquidity: extractedInfo.hasLiquidity || false,
  };

  const safeAnalysis = {
    trustScore: analysis.trustScore || 0,
    riskLevel: analysis.riskLevel || "unknown",
    riskFactors: analysis.riskFactors || [],
    categoryScores: analysis.categoryScores || {
      contractSecurity: 0,
      marketIntegrity: 0,
      creatorCredibility: 0,
      transactionPatterns: 0,
      communityTrust: 0,
    },
    recommendations: analysis.recommendations || [],
    alerts: analysis.alerts || [],
    summary: analysis.summary || "No analysis summary available.",
    confidence: analysis.confidence || 0,
  };

  return (
    <ScrollArea className="h-full flex-1">
      <div className=" bg-[#18181B] rounded-xl p-8 ml-2 shadow-sm border w-full mb-20">
        {/* Header with quick stats */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex max-md:flex-col md:items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">
                {safeExtractedInfo.tokenName} ({safeExtractedInfo.symbol})
              </h2>
              <Badge
                className={cn("text-sm")}
                style={{
                  backgroundColor: `${getTrustScoreColor(
                    safeAnalysis.trustScore
                  )} !important`,
                }}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {safeAnalysis.riskLevel.toUpperCase()} (Risk)
              </Badge>
            </div>
            <p className="text-sm text-gray-400">
              Solana token created {safeExtractedInfo.createdAt} •{" "}
              {formatLargeNumberRounded(safeExtractedInfo.holders)} holders
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
        <Card className="bg-transparent border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Overall Trust Score</span>
              <span
                className={`text-2xl font-bold `}
                style={{ color: getTrustScoreColor(analysis.trustScore) }}
              >
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

        {/* Tabs */}
        <Tabs
          defaultValue="analysis"
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 !bg-transparent">
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
              value="scores"
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Scores
            </TabsTrigger>
            <TabsTrigger
              value="similar"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Similar
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="analysis"
            className="space-y-6 !w-full"
          >
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-transparent border-white/20 ">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-lg font-bold">
                    {formatCurrency(extractedInfo.liquidity)}
                  </div>
                  <div className="text-xs text-gray-400">Liquidity</div>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-white/20 ">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-lg font-bold">
                    ${formatLargeNumber(extractedInfo.marketCap)}
                  </div>
                  <div className="text-xs text-gray-400">Market Cap</div>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-white/20 ">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <div className="text-lg font-bold">
                    {formatLargeNumber(extractedInfo.holders)}
                  </div>
                  <div className="text-xs text-gray-400">Holders</div>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-white/20 ">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-lg font-bold">
                    {extractedInfo.volume24h > 0 ? "+" : ""}
                    {extractedInfo.volume24h}%
                  </div>
                  <div className="text-xs text-gray-400">24h Change</div>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-white/20 ">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <div className="text-lg font-bold">
                    {formatCurrency(extractedInfo.price)}
                  </div>
                  <div className="text-xs text-gray-400">Current Price</div>
                </CardContent>
              </Card>
            </div>

            {/* Security Score Breakdown Chart */}
            <SecurityBarChart chartData={getScoreData(analysis)} />

            {/* Token Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-transparent border-white/20 ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Token Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address</span>
                    <span className="text-sm font-mono">
                      {analysisData.basicInfo.address.slice(0, 8)}...
                      {analysisData.basicInfo.address.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator</span>
                    <span className="text-sm">{extractedInfo.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mutable</span>
                    <Badge
                      variant={
                        extractedInfo.isMutable ? "destructive" : "default"
                      }
                    >
                      {extractedInfo.isMutable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Royalty Model</span>
                    <span className="text-sm capitalize">
                      {extractedInfo.royaltyModel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Has Liquidity</span>
                    <Badge
                      variant={
                        extractedInfo.hasLiquidity ? "default" : "destructive"
                      }
                    >
                      {extractedInfo.hasLiquidity ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent border-white/20 ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    AI Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analysis.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-gray-400">
                        Confidence: {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>
                    <Badge
                      variant={getRiskBadgeVariant(analysis.riskLevel)}
                      className="capitalize"
                    >
                      {analysis.riskLevel} Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Risk Factors Preview */}
            <Card className="bg-transparent border-white/20 ">
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
                      factor.severity === "critical" ||
                      factor.severity === "high"
                        ? "bg-red-400/10 border-red-400/20"
                        : factor.severity === "medium"
                        ? "bg-yellow-400/10 border-yellow-400/20"
                        : "bg-blue-400/10 border-blue-400/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        factor.severity === "critical" ||
                        factor.severity === "high"
                          ? "text-red-400"
                          : factor.severity === "medium"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium mb-1">{factor.factor}</div>
                      <div className="text-sm text-gray-400 mb-2">
                        {factor.description}
                      </div>
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
                    <Badge
                      variant={getRiskBadgeVariant(factor.severity)}
                      className="mt-1"
                    >
                      {factor.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="risks"
            className="space-y-4 !w-full"
          >
            {analysis.riskFactors.map((factor, index) => (
              <Card
                key={index}
                className="bg-transparent border-white/20 "
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-lg mb-1">
                        {factor.factor}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {factor.description}
                      </p>
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
            <Card className="bg-transparent border-white/20 ">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="scores"
            className="space-y-4"
          >
            {Object.entries(analysis.categoryScores).map(
              ([category, score]) => (
                <Card
                  key={category}
                  className="bg-transparent border-white/20 "
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className={`text-xl font-bold ${getTrustScoreColor(
                          score
                        )}`}
                      >
                        {score}%
                      </span>
                    </div>
                    <Progress
                      value={score}
                      className="h-2 bg-gray-700"
                    />
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>

          <TabsContent value="similar">
            <div className="text-center py-8 text-gray-400">
              Similar tokens analysis coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default AnalyticsPage;
