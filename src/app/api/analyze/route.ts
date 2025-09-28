import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { tokenData } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a blockchain security analyst. Analyze this token data and return ONLY JSON.
      TOKEN DATA:
      ${JSON.stringify(tokenData.extractedInfo, null, 2)}
      
      FULL DATA CONTEXT:
      ${JSON.stringify(tokenData, null, 2)}

      ANALYSIS CRITERIA:

      CONTRACT SAFETY:
      - Verified contract: +20 points
      - No mint function: +15 points  
      - Immutable contract: +10 points
      - Audited: +15 points

      LIQUIDITY & MARKET:
      - Liquidity > $1M: +20 points
      - Liquidity $100K-$1M: +10 points
      - Liquidity < $10K: -20 points
      - Locked liquidity: +15 points

      CREATOR & DISTRIBUTION:
      - Known/verified creator: +15 points
      - Fair launch: +10 points
      - Top 10 holders < 20%: +15 points
      - Top 10 holders > 60%: -20 points

      TOKEN AGE & ACTIVITY:
      - Age > 1 year: +20 points
      - Age 6-12 months: +15 points
      - Age 1-6 months: +5 points
      - Age < 30 days: -15 points
      - High trading volume: +10 points

      SCORING SYSTEM:
      - 90-100: Excellent (Very safe)
      - 80-89: Good (Low risk)
      - 70-79: Fair (Moderate risk)  
      - 60-69: Caution (Elevated risk)
      - 50-59: High risk
      - 0-49: Critical risk

      BASE SCORE STARTS AT 50. Add/subtract points based on above criteria.

      IMPORTANT: For well-known legitimate tokens (like USDC, USDT, SOL, etc.), prioritize their established reputation.

      Return ONLY this JSON format, no other text:
      {
        "trustScore": 85,
        "riskLevel": "low",
        "riskFactors": [
          {
            "factor": "Contract Verification",
            "severity": "low",
            "description": "Contract is verified on-chain",
            "evidence": "Public verification available",
            "impact": "Positive trust indicator"
          }
        ],
        "recommendations": ["Monitor liquidity changes"],
        "confidence": 0.9,
        "summary": "Token shows strong security indicators",
        "metadata": ${JSON.stringify(tokenData.extractedInfo)},
        "alerts": [],
        "categoryScores": {
          "contractSecurity": 85,
          "marketIntegrity": 80,
          "creatorCredibility": 75,
          "transactionPatterns": 70,
          "communityTrust": 65
        }
      }`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log("AI Analysis Complete:", analysis);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
