export type SecurityAnalysis = {
  trustScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: {
    factor: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
  }[];
  recommendations: string[];
  confidence: number;
  summary: string;
  metadata: {
    tokenName: string;
    symbol: string;
    creator: string;
    createdAt: string;
    holders: number;
    liquidity: number;
    marketCap?: number;
  };
};

export interface AnalyticsData {
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
