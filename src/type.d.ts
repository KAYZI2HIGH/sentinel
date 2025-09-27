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
