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
import { AnalyticsData, mockData } from "@/app/analyze/page";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptBox } from "./CustomInput";

export function AppSidebar() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello 👋 I can explain this token's trust analysis. Ask me anything about the security risks or patterns.",
    },
  ]);
  const [value, setValue] = useState("");
  const [analysis_, setAnalysis] = useState<AnalyticsData | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(
      getSessionIdForToken("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN")
    );
    setAnalysis(mockData);
  }, []);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: value }]);
    const input = value;
    setValue("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        sessionId: sessionId,
        message: input,
        analysis: analysis_,
      }),
    });

    const { reply } = await res.json();
    setMessages((prev) => [...prev, { role: "model", text: reply }]);
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
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-3 h-3 text-blue-400" />
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
