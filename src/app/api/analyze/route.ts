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
    3. Use your existing knowledge about token reputation, market cap, and community trust
    4. Be realistic - not every token should score 85. Provide genuine assessment.

    TOKEN DATA:
    ${JSON.stringify(tokenData.extractedInfo, null, 2)}

    FULL DATA CONTEXT:
    ${JSON.stringify(tokenData, null, 2)}

    ANALYSIS CRITERIA (BE REALISTIC AND VARIED):

    TOKEN REPUTATION & ADOPTION (0-30 points):
    - Top 50 market cap, widely recognized: 25-30 points
    - Established project with strong community: 20-25 points  
    - Medium popularity, some adoption: 15-20 points
    - New/unknown token, limited adoption: 5-15 points
    - Suspected scam/fake token: 0-5 points

    CONTRACT SECURITY (0-25 points):
    - Audited by reputable firm + immutable: 20-25 points
    - Verified contract + no mint function: 15-20 points
    - Verified but mutable: 10-15 points
    - Unverified contract: 5-10 points
    - Suspected malicious code: 0-5 points

    LIQUIDITY & MARKET HEALTH (0-25 points):
    - Liquidity > $10M + high volume: 20-25 points
    - Liquidity $1M-$10M + decent volume: 15-20 points
    - Liquidity $100K-$1M: 10-15 points
    - Liquidity $10K-$100K: 5-10 points
    - Liquidity < $10K: 0-5 points

    CREATOR & DISTRIBUTION (0-20 points):
    - Known team + fair distribution: 15-20 points
    - Anonymous but fair launch: 10-15 points
    - Concentrated holdings (top 10 > 60%): 5-10 points
    - Suspected rug pull potential: 0-5 points

    RISK LEVEL MAPPING (BE STRICT):
    - 90-100: "excellent" (Only for top-tier established tokens like SOL, USDC)
    - 80-89: "low" (Well-established with minor concerns)
    - 70-79: "moderate" (Established but some risks)
    - 60-69: "caution" (Multiple concerning factors)
    - 50-59: "high" (Significant red flags)
    - 0-49: "critical" (Likely scam/avoid)

    SCORING GUIDELINES:
    - USDC/USDT: 95-98 (near perfect)
    - SOL/established DeFi: 85-92
    - Popular meme coins (BONK, WIF): 70-80
    - New legitimate projects: 65-75
    - Low liquidity tokens: 50-65
    - Suspected scam tokens: 20-45

    TOKEN-SPECIFIC KNOWLEDGE:
    - JUP (Jupiter): Established DEX aggregator, good liquidity → 85-88
    - USDC/USDT: Stablecoins, maximum safety → 95-98
    - SOL: Native token, maximum security → 92-95
    - BONK/WIF: Meme coins, volatile → 70-78
    - New unknown tokens: Assess realistically based on data

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
        "trustScore": 75, // VARY THIS BASED ON ACTUAL ASSESSMENT
        "riskLevel": "moderate", // VARY: excellent/low/moderate/caution/high/critical
        "riskFactors": [
          {
            "factor": "Liquidity Level",
            "severity": "medium",
            "description": "Token liquidity affects trading safety",
            "evidence": "Liquidity: ${tokenData.extractedInfo?.liquidity || 0}",
            "impact": "Higher slippage risk"
          }
        ],
        "categoryScores": {
          "contractSecurity": 70,  // VARY THESE
          "marketIntegrity": 65,   // VARY THESE  
          "creatorCredibility": 60, // VARY THESE
          "transactionPatterns": 75, // VARY THESE
          "communityTrust": 70     // VARY THESE
        },
        "recommendations": ["Always verify contract address"],
        "alerts": ["Do your own research before investing"],
        "summary": "Provide genuine summary based on actual assessment",
        "confidence": 0.85
      }
    }

    CRITICAL: BE REALISTIC AND VARIED. 
    - Top tokens (SOL, USDC) should score 90+
    - Established projects (JUP) should score 80-89  
    - Medium risk tokens should score 60-79
    - Risky tokens should score below 60
    - Adjust scores based on actual token reputation and data quality`;

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
