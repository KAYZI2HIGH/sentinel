"use client";
import { ChevronDown, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { getSessionIdForToken } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptBox } from "./CustomInput";
import { AnalyticsData } from "@/type";
import { LoadingIndicator } from "../ui/hero-1";
import TypingDots from "./TypingDots";
import Image from "next/image";

interface AppSidebarProps {
  analysisData?: AnalyticsData | null;
}

export function AppSidebar({ analysisData }: AppSidebarProps) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello 👋 I can explain this token's trust analysis. Ask me anything about the security risks or patterns.",
    },
  ]);
  const [value, setValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (analysisData?.basicInfo?.address) {
      setSessionId(getSessionIdForToken(analysisData.basicInfo.address));
    }
  }, [analysisData]);

  const scrollToBottom = () => {
    const scrollArea = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: value }]);
    const input = value;
    setValue("");

    setisLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: input,
          analysis: analysisData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      setisLoading(false);

      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
        },
      ]);
    }
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-5 py-2 flex flex-row items-center justify-between">
        <div>
          <div className="font-semibold text-xl sm:text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight flex items-center gap-1">
            Sentinel{" "}
            <ChevronDown
              size={14}
              className="text-white"
            />
          </div>
          <p className="text-xs text-white/70 mt-[2px]">
            Ask questions about this analysis
          </p>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <Separator />

      <SidebarContent>
        <ScrollArea className="flex-1 p-5 pl-3 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-blue-500/20 ml-auto border border-blue-500/30 p-4"
                    : "mr-auto"
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.role === "model" && (
                    <div className="w-6 h-6 rounded-full  flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="relative size-[30px]">
                        <Image
                          src={"/logo.png"}
                          alt="Logo"
                          fill
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed prose prose-invert text-white/90 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isLoading && <TypingDots />}
        </ScrollArea>

        <PromptBox
          value={value}
          setValue={setValue}
          messages={messages}
          setMessages={setMessages}
          sendMessage={sendMessage}
        />
      </SidebarContent>
    </Sidebar>
  );
}
