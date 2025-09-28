import { NextResponse } from "next/server";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || address.length < 32 || address.length > 44) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token address format",
          basicInfo: {
            address: address,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    console.log("Fetching data for token:", address);

    const [metadataResult, priceResult, transactionsResult, supplyResult] =
      await Promise.allSettled([
        (async () => {
          const metadataResponse = await fetch(
            `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: "1",
                method: "getAsset",
                params: { id: address },
              }),
            }
          );

          if (!metadataResponse.ok) {
            throw new Error(`Helius API error: ${metadataResponse.status}`);
          }

          const metadataData = await metadataResponse.json();

          if (metadataData.error || !metadataData.result) {
            throw new Error(metadataData.error?.message || "Token not found");
          }

          return metadataData.result;
        })(),
        (async () => {
          let priceData = null;
          let priceSource = "none";
          try {
            const birdeyeResponse = await fetch(
              `https://public-api.birdeye.so/public/price?address=${address}`,
              {
                headers: {
                  "X-API-KEY": process.env.BIRDEYE_API_KEY || "",
                  "Content-Type": "application/json",
                },
              }
            );

            if (birdeyeResponse.ok) {
              const birdeyeData = await birdeyeResponse.json();
              if (birdeyeData.data && birdeyeData.data.value) {
                priceData = birdeyeData.data;
                priceSource = "birdeye";
                console.log("✅ Got price from Birdeye");
                return { priceData, priceSource };
              }
            }
          } catch  {
            console.log("Birdeye price failed, trying fallbacks...");
          }

          try {
            const dexscreenerResponse = await fetch(
              `https://api.dexscreener.com/latest/dex/tokens/${address}`,
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            if (dexscreenerResponse.ok) {
              const dexscreenerData = await dexscreenerResponse.json();
              const pair = dexscreenerData.pairs?.[0];
              if (pair && pair.priceUsd) {
                priceData = {
                  value: parseFloat(pair.priceUsd),
                  updateUnixTime: pair.timestamp,
                  liquidity: pair.liquidity?.usd || 0,
                  priceChange24h: pair.priceChange?.h24 || 0,
                };
                priceSource = "dexscreener";
                console.log("✅ Got price from DexScreener");
              }
            }
          } catch {
            console.log("DexScreener also failed");
          }

          return { priceData, priceSource };
        })(),

        (async () => {
          try {
            const transactionsResponse = await fetch(
              `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=10`,
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              console.log("✅ Got transaction history");
              return transactionsData;
            }
            return [];
          } catch {
            console.log("Transaction history unavailable");
            return [];
          }
        })(),
        (async () => {
          try {
            const supplyResponse = await fetch(
              `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  id: "1",
                  method: "getTokenSupply",
                  params: [address],
                }),
              }
            );
            const supplyResult = await supplyResponse.json();
            console.log("Supply result:", supplyResult);
            return supplyResult.result;
          } catch {
            console.log("Supply data unavailable");
            return null;
          }
        })(),
      ]);

    if (metadataResult.status === "rejected") {
      const error = metadataResult.reason;
      console.error("Helius metadata error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Token not found or invalid address",
          details: error.message || "Token does not exist",
          basicInfo: {
            address: address,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    const asset = metadataResult.value;

    if (
      asset.interface !== "Fungible" &&
      asset.interface !== "FungibleAsset" &&
      asset.interface !== "FungibleToken"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset is not a fungible token",
          details: `This appears to be a ${
            asset.interface || "NFT/Other asset"
          }, not a fungible token`,
          basicInfo: {
            address: address,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 422 }
      );
    }

    let createdAt = null;
    let holderCount = null;

    if (asset) {
      // Check if we have minimal required data
      const hasName = !!asset?.content?.metadata?.name;
      const hasSymbol = !!asset?.content?.metadata?.symbol;
      const hasSupply = !!asset?.token_info?.supply;

      if (!hasName || !hasSymbol || !hasSupply) {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient token data available",
            details:
              "Token exists but lacks essential information (name, symbol, or supply)",
            basicInfo: {
              address: address,
              timestamp: new Date().toISOString(),
            },
            partialData: {
              tokenName: asset?.content?.metadata?.name || null,
              symbol: asset?.content?.metadata?.symbol || null,
              hasSupply: !!asset?.token_info?.supply,
            },
          },
          { status: 422 }
        );
      }

      if (asset.created_at) {
        createdAt = new Date(asset.created_at).toISOString().split("T")[0];
      } else if (asset.compression?.compressed) {
        createdAt = asset.compression.tree_created_at
          ? new Date(asset.compression.tree_created_at * 1000)
              .toISOString()
              .split("T")[0]
          : null;
      }

      if (asset.ownership) {
        holderCount = asset.ownership.owner_count || null;
      }
    }

    const priceInfo =
      priceResult.status === "fulfilled"
        ? priceResult.value
        : { priceData: null, priceSource: "none" };
    const transactionsData =
      transactionsResult.status === "fulfilled" ? transactionsResult.value : [];
    const supplyData =
      supplyResult.status === "fulfilled" ? supplyResult.value : null;

    const { priceData, priceSource } = priceInfo;

    if (!createdAt && transactionsData.length > 0) {
      const sortedTransactions = transactionsData.sort(
      //eslint-disable-next-line
        (a: any, b: any) => (a.timestamp || 0) - (b.timestamp || 0)
      );
      const firstTx = sortedTransactions[0];
      if (firstTx.timestamp) {
        createdAt = new Date(firstTx.timestamp * 1000)
          .toISOString()
          .split("T")[0];
        console.log(
          "Estimated creation date from first transaction:",
          createdAt
        );
      }
    }

    if (!holderCount && supplyData && priceData?.value) {
      const supplyValue = supplyData.value?.amount || supplyData.value;
      const estimatedHolders = Math.round(
        (supplyValue * priceData.value) / 100
      );
      holderCount = Math.max(1, estimatedHolders);
      console.log("Estimated holder count:", holderCount);
    }

    const responseData = {
      success: true,
      metadata: asset,
      price: priceData,
      priceSource: priceSource,
      transactions: transactionsData,
      supply: supplyData,
      extractedInfo: {
        tokenName: asset.content.metadata.name,
        symbol: asset.content.metadata.symbol,
        creator: asset.ownership.owner || "Unknown",
        createdAt: createdAt || "Unknown",
        holders: holderCount || "Data unavailable",
        liquidity:
          priceData?.liquidity ||
          asset?.token_info?.price_info?.total_liquidity ||
          0,
        marketCap:
          supplyData?.value && priceData?.value
            ? (supplyData.value.amount || supplyData.value) * priceData.value
            : 0,
        price: priceData?.value || 0,
        volume24h: priceData?.priceChange24h || 0,
        isMutable: asset.mutable || false,
        royaltyModel: asset.royalty?.royalty_model || "None",
        hasPriceData: !!priceData,
        hasLiquidity: !!(
          priceData?.liquidity || asset?.token_info?.price_info?.total_liquidity
        ),
      },
      basicInfo: {
        address: address,
        timestamp: new Date().toISOString(),
      },
    };

    console.log("Enhanced data collection completed:", {
      name: responseData.extractedInfo.tokenName,
      symbol: responseData.extractedInfo.symbol,
      holders: responseData.extractedInfo.holders,
      created: responseData.extractedInfo.createdAt,
      hasPrice: responseData.extractedInfo.hasPriceData,
      hasLiquidity: responseData.extractedInfo.hasLiquidity,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Token API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch token data",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        basicInfo: {
          address: (await params).address,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
