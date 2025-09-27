import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AnalyticsSection = () => {
  const analyticsData = [
    {
      token: "USDC Token",
      creator: "Verified Labs",
      score: "95%",
      liquidity: "$4.2M",
      lastScan: "2 mins ago",
      status: "Safe",
      statusColor: "text-green-400",
    },
    {
      token: "RuggyCoin",
      creator: "Unknown",
      score: "21%",
      liquidity: "$120K",
      lastScan: "10 mins ago",
      status: "⚠ Risky",
      statusColor: "text-red-400",
    },
    {
      token: "NFT Apes",
      creator: "ApeLabs",
      score: "72%",
      liquidity: "$900K",
      lastScan: "30 mins ago",
      status: "Moderate",
      statusColor: "text-yellow-400",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 py-16">
      <Card className="w-full max-w-5xl mx-auto bg-neutral-900/70 border-neutral-800 rounded-3xl p-6 py-10">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-2xl font-semibold tracking-wide text-white">
            Recent Community Analytics
          </CardTitle>
          <Button
            variant="ghost"
            className="text-violet-400 hover:text-violet-300 px-0 h-auto"
          >
            View all →
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-6 gap-6 text-sm text-zinc-300 font-medium border-b border-neutral-800 pb-3 px-6">
              <div>Token</div>
              <div>Creator</div>
              <div>Trust Score</div>
              <div>Liquidity</div>
              <div>Last Scan</div>
              <div>Status</div>
            </div>

            <div className="divide-y divide-neutral-800">
              {analyticsData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-6 py-4 text-sm text-zinc-400 px-6 hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="font-medium">{item.token}</div>
                  <div>{item.creator}</div>
                  <div className="font-semibold">{item.score}</div>
                  <div>{item.liquidity}</div>
                  <div>{item.lastScan}</div>
                  <Badge
                    variant="outline"
                    className={cn("font-semibold border-0", item.statusColor)}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {analyticsData.map((item, index) => (
              <div
                key={index}
                className="bg-neutral-800/60 rounded-xl p-4 text-sm text-zinc-300 border border-neutral-700 hover:border-neutral-600 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{item.token}</span>
                  <Badge
                    variant="outline"
                    className={cn("font-semibold border-0", item.statusColor)}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p>
                  <span className="text-zinc-400">Creator: </span>
                  {item.creator}
                </p>
                <p>
                  <span className="text-zinc-400">Trust Score: </span>
                  <span className="font-semibold">{item.score}</span>
                </p>
                <p>
                  <span className="text-zinc-400">Liquidity: </span>
                  {item.liquidity}
                </p>
                <p className="text-zinc-400 text-xs mt-2">
                  Last Scan: {item.lastScan}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
