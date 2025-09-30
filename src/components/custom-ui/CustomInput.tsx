"use client";
import * as React from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptBoxProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  messages: { role: string; text: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; text: string }[]>
  >;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const PromptBox = React.forwardRef<HTMLTextAreaElement, PromptBoxProps>(
  (
    {
      className,
      value,
      setValue,
      messages,
      setMessages,
      sendMessage,
      ...props
    },
    ref
  ) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);

    // Auto-resize textarea
    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    const hasValue = value.trim().length > 0 || imagePreview;

    return (
      <form
        onSubmit={sendMessage}
        className={cn(
          "flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-white border dark:bg-[#18181B] dark:border-transparent cursor-text",
          className
        )}
      >
        <textarea
          ref={internalTextareaRef}
          rows={1}
          value={value}
          onChange={handleInputChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const form = e.currentTarget.closest("form");
              if (form) {
                form.requestSubmit();
              }
            }
          }}
          placeholder="Message..."
          className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-300 focus:ring-0 focus-visible:outline-none min-h-12"
          {...props}
        />

        <div className="mt-0.5 p-1 pt-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground dark:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151]"
            >
              <Plus className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground dark:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151]"
            >
              <Mic className="h-5 w-5" />
            </button>

            <div className="ml-auto">
              <button
                type="submit"
                disabled={!hasValue}
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 disabled:bg-black/40 dark:disabled:bg-[#515151]"
              >
                <ArrowUp className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
);

PromptBox.displayName = "PromptBox";
