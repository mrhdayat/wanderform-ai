"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Understanding your travel style...",
  "Searching for hidden gems...",
  "Calculating realistic budgets...",
  "Finding the best coffee spots...",
  "Creating your perfect timeline...",
];

export function ThinkingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500); // Change message every 1.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="mb-8 text-primary"
      >
        <Loader2 className="w-8 h-8 opacity-50" />
      </motion.div>

      <div className="h-12 relative overflow-hidden w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-serif text-secondary italic absolute w-full"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="mt-8 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
        We are checking thousands of data points to ensure your trip flows naturally.
      </p>
    </div>
  );
}
