"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  // Correct width measurement
  useEffect(() => {
    if (measureRef.current) {
      setContainerWidth(measureRef.current.offsetWidth);
    }
  }, [index, words]);

  return (
    <motion.span
      className="inline-block overflow-hidden align-bottom max-md:hidden"
      animate={{ width: containerWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Animated visible word */}
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={cn(
            "inline-block text-indigo-400 font-semibold",
            className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>

      {/* Hidden measurement element */}
      <span
        ref={measureRef}
        className={cn("absolute opacity-0 pointer-events-none", className)}
      >
        {words[index]}
      </span>
    </motion.span>
  );
}
