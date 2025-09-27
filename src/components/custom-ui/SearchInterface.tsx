"use client";

import * as React from "react";
import { ArrowUpIcon, LoaderIcon, Paperclip, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTypewriterPlaceholder } from "@/hooks/useTypeWriterAnimation";

interface SearchInterfaceProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  adjustHeight: (reset?: boolean) => void;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  textareaRef,
  adjustHeight,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="relative bg-neutral-900/50 rounded-xl border border-neutral-800 max-w-[700px] mx-auto">
      <div className="overflow-y-hidden h-10">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={useTypewriterPlaceholder()}
          className={cn(
            "w-full px-4 py-0 pt-3 resize-none bg-transparent border-none text-white text-lg",
            "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-neutral-500 placeholder:text-lg max-md:placeholder:text-sm placeholder:font-[var(--font-geist-mono)]",
            "min-h-[80px]"
          )}
          style={{ overflow: "hidden" }}
        />
      </div>

      <div className="flex items-center justify-between pt-0 p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="group p-2 hover:bg-neutral-800 rounded-lg h-auto"
          >
            <Paperclip className="w-4 h-4 text-white" />
            <span className="text-xs text-zinc-400 hidden group-hover:inline ml-1">
              Attach
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2 py-1 rounded-lg text-zinc-400 border-dashed hover:border-zinc-600 hover:bg-zinc-800"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Project
          </Button>
          <Button
            size="sm"
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              "px-1.5 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600",
              value.trim()
                ? "bg-white hover:bg-white/80 text-black"
                : "text-zinc-400 bg-transparent"
            )}
          >
            {isLoading ? (
              <LoaderIcon className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
