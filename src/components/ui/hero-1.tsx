"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../hero/Header";
import { HeroContent } from "../hero/HeroContent";
import { AnalyticsSection } from "../hero/AnalyticsSection";
import TypingDots from "../custom-ui/TypingDots";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useRouter } from "next/navigation";

const Hero1 = () => {
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const router = useRouter()

  const handleSendMessage = () => {
    if (value.trim()) {
      React.startTransition(() => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setValue("");
          adjustHeight(true);
        }, 8000);
router.push('/analyze/12345')
      });
    }
  };

  return (
    <main className="bg-[#0c0414] text-white pb-10">
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Gradient Backgrounds */}
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

// Loading Indicator Component
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
