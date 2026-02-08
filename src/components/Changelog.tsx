"use client";

import { useTrip } from "@/context/TripContext";
import { motion, AnimatePresence } from "framer-motion";

export function Changelog() {
  const { history } = useTrip();

  if (history.length === 0) return null;

  return (
    <div className="p-6 bg-white rounded-2xl border border-border/40 shadow-subtle max-h-[300px] overflow-y-auto mt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 sticky top-0 bg-white z-10 py-1 border-b border-border/20">
        Change Log
      </h3>
      <ul className="space-y-4 relative">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 text-sm text-foreground/80 font-light"
            >
              <span className="text-xs font-mono text-muted-foreground/50 select-none bg-muted px-1.5 py-0.5 rounded-md mt-0.5">v1.{i}</span>
              <span className="leading-relaxed">{entry}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
