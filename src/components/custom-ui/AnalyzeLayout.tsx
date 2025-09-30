"use client";
import AnalyticsHeader from "@/components/custom-ui/AnalyticsHeader";
import { AppSidebar } from "@/components/custom-ui/AppSidebar";
import { GradientBackgrounds } from "@/components/ui/hero-1";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsData } from "@/type";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AnalyzeLayout({ children }: LayoutProps) {
  const searchParams = useSearchParams();
  const [analysisData, setAnalysisData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setAnalysisData(decodedData);
      } catch (err) {
        console.error("Error parsing analysis data in layout:", err);
      }
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <AppSidebar analysisData={analysisData} />
      <main className="h-dvh flex flex-col relative overflow-hidden w-full">
        <GradientBackgrounds />
        <AnalyticsHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
