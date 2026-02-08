"use client";

import { useTrip } from "@/context/TripContext";
import { motion, AnimatePresence } from "framer-motion";

export function Changelog() {
  const { history } = useTrip();

  if (history.length === 0) return null;

  return (
    <div className="p-4 bg-muted/5 rounded-xl border border-border/50 max-h-[300px] overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-1">
        Change Log
      </h3>
      <ul className="space-y-3 relative">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span className="text-primary font-mono opacity-50 select-none">v1.{i}</span>
              <span className="leading-relaxed">{entry}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
