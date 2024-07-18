"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<"div">;
  className?: string;
}

export default function WordRotate({
  words,
  duration = 2500,
  framerProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rotateWord = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % words.length);
    setKey((prevKey) => prevKey + 1);
  }, [words.length]);

  useEffect(() => {
    if (words.length <= 1) return;

    const runRotation = () => {
      timeoutRef.current = setTimeout(() => {
        rotateWord();
        runRotation();
      }, duration);
    };

    runRotation();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, rotateWord, words.length]);

  if (words.length === 0) {
    return null;
  }

  return (
    <div className={cn("overflow-hidden py-2", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={key} {...framerProps}>
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}