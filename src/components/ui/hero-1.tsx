"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../hero/Header";
import { HeroContent } from "../hero/HeroContent";
import { AnalyticsSection } from "../hero/AnalyticsSection";
import TypingDots from "../custom-ui/TypingDots";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateAnalysisId } from "@/lib/utils";

const Hero1 = () => {
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const router = useRouter();
const handleSendMessage = async () => {
  if (value.trim()) {
    setIsLoading(true);

    try {
      const tokenRes = await fetch(`/api/token/${value.trim()}`);
      if (!tokenRes.ok) {
        let errorMessage = "Failed to fetch token data";

        try {
          const errorData = await tokenRes.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (parseError) {
          errorMessage = tokenRes.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const tokenResult = await tokenRes.json();
      console.log("Complete Token Data:", tokenResult);

      if (!tokenResult.success) {
        throw new Error(
          tokenResult.error ||
            tokenResult.details ||
            "Invalid token data received"
        );
      }
      if (!tokenResult.extractedInfo?.symbol) {
        throw new Error(
          "This token doesn't have sufficient data for analysis. It may be invalid or too new."
        );
      }

      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenData: tokenResult }),
      });

      if (!analysisRes.ok) {
        throw new Error("Analysis failed due to server error");
      }

      const analysis = await analysisRes.json();
      if (!analysis || !analysis.metadata || !analysis.metadata.symbol) {
        throw new Error("Invalid analysis data received");
      }

      console.log("Enhanced Analysis Result:", analysis);
      const analysisId = generateAnalysisId();
      router.push(
        `/analyze/${analysisId}?data=${encodeURIComponent(
          JSON.stringify(analysis)
        )}`
      );
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(`Analysis failed: ${error.message}`, {
        className: "!bg-gradient-to-r !from-red-500 !to-yellow-500 !text-white",
        duration: 5000,
      });
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  }
};
  
  return (
    <main className="bg-[#0c0414] text-white pb-10">
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <GradientBackgrounds />
        <Header />
        <HeroContent
          value={value}
          onChange={setValue}
          onSend={handleSendMessage}
          isLoading={isLoading}
          textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
          adjustHeight={adjustHeight}
        />
        <AnimatePresence>{isLoading && <LoadingIndicator />}</AnimatePresence>
      </div>
      <AnalyticsSection />
    </main>
  );
};

export const GradientBackgrounds = () => (
  <>
    <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
    </div>
    <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[20rem]  bg-linear-90 from-white to-blue-300"></div>
    </div>
    <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
      <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
      <div className="w-[10rem] h-[30rem]  bg-linear-90 from-white to-blue-300"></div>
    </div>
  </>
);

const LoadingIndicator = () => (
  <motion.div
    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-4 py-2 shadow-lg border border-white/[0.05]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-7 rounded-full bg-white/[0.05] flex items-center justify-center">
        <span className="text-xs font-medium text-white/90 mb-0.5">STG</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Analyzing</span>
        <TypingDots />
      </div>
    </div>
  </motion.div>
);

export { Hero1 };
