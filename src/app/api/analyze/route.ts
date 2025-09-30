import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { tokenData } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a blockchain security analyst. Analyze this token data and return ONLY JSON.

    IMPORTANT REQUIREMENTS:
    1. Return ONLY valid JSON - no other text, markdown, or explanations
    2. NO field can be empty/null - provide estimates based on your knowledge
    3. Use your existing knowledge about well-known tokens when data is limited
    4. If token data is incomplete, make reasonable estimates based on token reputation and market standards

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

    SCORING SYSTEM (BASE SCORE: 50):
    - 90-100: Excellent (Very safe)
    - 80-89: Good (Low risk)
    - 70-79: Fair (Moderate risk)  
    - 60-69: Caution (Elevated risk)
    - 50-59: High risk
    - 0-49: Critical risk

    RISK LEVEL MAPPING:
    - 90-100: "excellent"
    - 80-89: "low" 
    - 70-79: "moderate"
    - 60-69: "high"
    - 0-59: "critical"

    Return EXACTLY this JSON format - ALL fields are REQUIRED:

    {
      "success": true,
      "price": {
        "value": ${tokenData.extractedInfo?.price || 0},
        "liquidity": ${tokenData.extractedInfo?.liquidity || 0},
        "priceChange24h": ${tokenData.price?.priceChange24h || 0}
      },
      "extractedInfo": ${JSON.stringify(tokenData.extractedInfo)},
      "basicInfo": {
        "address": "${tokenData.extractedInfo?.address || ""}",
        "timestamp": "${new Date().toISOString()}"
      },
      "transactions": [],
      "analysis": {
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
        "categoryScores": {
          "contractSecurity": 85,
          "marketIntegrity": 80,
          "creatorCredibility": 75,
          "transactionPatterns": 70,
          "communityTrust": 65
        },
        "recommendations": ["Monitor liquidity changes regularly"],
        "alerts": ["Verify token address against official sources"],
        "summary": "Token shows strong security indicators with established market presence",
        "confidence": 0.9
      }
    }

    CRITICAL: If analyzing well-known legitimate tokens (like JUP, SOL, USDC, USDT, etc.), use your knowledge of their established reputation, security audits, and market position to provide accurate scores. Do not rely solely on the provided data if you know the token has strong fundamentals.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    const requiredFields = [
      "success",
      "price",
      "extractedInfo",
      "basicInfo",
      "analysis",
    ];
    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log("AI Analysis Complete:", analysis);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis failed:", error);

    // Fallback response with estimated data
    const fallbackResponse = {
      success: true,
      price: {
        value: 0,
        liquidity: 0,
        priceChange24h: 0,
      },
      extractedInfo: {},
      basicInfo: {
        address: "",
        timestamp: new Date().toISOString(),
      },
      transactions: [],
      analysis: {
        trustScore: 50,
        riskLevel: "high",
        riskFactors: [
          {
            factor: "Analysis Failed",
            severity: "medium",
            description: "Unable to complete full analysis",
            evidence: "API error occurred",
            impact: "Limited visibility",
          },
        ],
        categoryScores: {
          contractSecurity: 50,
          marketIntegrity: 50,
          creatorCredibility: 50,
          transactionPatterns: 50,
          communityTrust: 50,
        },
        recommendations: ["Re-run analysis when service is available"],
        alerts: ["Analysis service temporarily unavailable"],
        summary: "Limited analysis due to service issues",
        confidence: 0.1,
      },
    };

    return NextResponse.json(fallbackResponse, { status: 500 });
  }
}
