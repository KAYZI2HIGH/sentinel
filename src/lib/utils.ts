import { AnalyticsData } from "@/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getScoreData = (analysis: {
  trustScore: number;
  riskLevel: string;
  riskFactors: {
    factor: string;
    severity: string;
    description: string;
    evidence?: string | undefined;
    impact?: string | undefined;
  }[];
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
}) => {
  return Object.entries(analysis.categoryScores).map(([category, score]) => ({
    category: category.replace(/([A-Z])/g, " $1").trim(),
    score,
    fill: getTrustScoreColor(score),
  }));
};

export const getRiskBadgeVariant = (riskLevel: string) => {
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

export const getTrustScoreColor = (score: number) => {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#facc15";
  return "#f87171";
};

export function generateAnalysisId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatLargeNumber(num: number | string): string {
  if (typeof num === "string") {
    num = parseFloat(num.replace(/,/g, ""));
  }
  if (isNaN(num as number)) return "0";
  const value = num as number;
  if (value === 0) return "0";
  if (value < 1) return value.toFixed(4);
  if (value < 1_000) return Math.round(value).toString();
  if (value < 1_000_000) return (value / 1_000).toFixed(1) + "K";
  if (value < 1_000_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value < 1_000_000_000_000)
    return (value / 1_000_000_000).toFixed(1) + "B";
  return (value / 1_000_000_000_000).toFixed(1) + "T";
}

export function formatLargeNumberRounded(num: number | string): string {
  if (typeof num === "string") {
    num = parseFloat(num.replace(/,/g, ""));
  }
  if (isNaN(num as number)) return "0";
  const value = num as number;
  if (value === 0) return "0";
  if (value < 1_000) return Math.round(value).toString();
  if (value < 1_000_000) return Math.round(value / 1_000) + "K";
  if (value < 1_000_000_000) return Math.round(value / 1_000_000) + "M";
  if (value < 1_000_000_000_000) return Math.round(value / 1_000_000_000) + "B";
  return Math.round(value / 1_000_000_000_000) + "T";
}

export function formatCurrency(value: number | string): string {
  if (typeof value === "string") {
    value = parseFloat(value.replace(/[$,]/g, ""));
  }
  if (isNaN(value as number)) return "$0";
  const num = value as number;
  return "$" + formatLargeNumber(num);
}

export function calculateDaysFromNow(targetDate: string | Date): number {
  const target =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffTime = now.getTime() - target.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDaysDifference(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days > 0) return `${days} days ago`;
  if (days === -1) return "in 1 day";
  return `in ${Math.abs(days)} days`;
}

//Helper function from my old codebase
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries > 0) {
      // && err.message.includes('503')) {
      console.warn(`Retrying after 503 error. Attempts left: ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

export function getSessionIdForToken(tokenId: string): string {
  const key = `sessionId:token:${tokenId}`;

  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // sessionId = Math.random().toString(36).slice(2, 12)

    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}
