"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NarrativeInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function NarrativeInput({ onGenerate, isLoading }: NarrativeInputProps) {
  const [value, setValue] = useState("");
  const [chips, setChips] = useState<{ type: string; label: string; icon: React.ReactNode }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const newChips = [];

    // Detect Location
    if (/\b(bali|japan|paris|london|rome|new york)\b/i.test(newValue)) {
      const match = newValue.match(/\b(bali|japan|paris|london|rome|new york)\b/i);
      if (match) newChips.push({ type: "location", label: match[0], icon: <MapPin className="w-3 h-3 text-primary" /> });
    }

    // Detect Duration
    if (/\b(\d+)\s*(day|days|week|weeks)\b/i.test(newValue)) {
       const match = newValue.match(/\b(\d+)\s*(day|days|week|weeks)\b/i);
       if (match) newChips.push({ type: "duration", label: match[0], icon: <Calendar className="w-3 h-3 text-primary" /> });
    }

    // Detect Budget
    if (/\b(budget|cheap|luxury|\d+\s*(million|k|thousand))\b/i.test(newValue)) {
       const match = newValue.match(/\b(budget|cheap|luxury|\d+\s*(million|k|thousand))\b/i);
       if (match) newChips.push({ type: "budget", label: match[0], icon: <Wallet className="w-3 h-3 text-primary" /> });
    }

    setChips(newChips);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onGenerate(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto p-4 md:p-8"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label htmlFor="narrative-input" className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight">
          Where does your story begin?
        </label>

        <div className="relative group">
          <textarea
            id="narrative-input"
            value={value}
            onChange={handleInputChange}
            placeholder="I want to go to Bali for 6 days, focused on beaches and cafes..."
            className="w-full min-h-[220px] p-8 text-xl md:text-2xl bg-white border border-transparent hover:border-border/50 focus:border-primary/20 rounded-2xl resize-none outline-none transition-all placeholder:text-muted-foreground/40 shadow-subtle group-focus-within:shadow-floating ring-1 ring-transparent group-focus-within:ring-primary/10"
            disabled={isLoading}
          />

          {/* Subtle Chips */}
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 pointer-events-none">
            <AnimatePresence>
              {chips.map((chip, i) => (
                <motion.div
                  key={chip.label + i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 border border-muted-foreground/10 rounded-full text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
                >
                  {chip.icon}
                  <span className="capitalize opacity-80">{chip.label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 mt-2">
           {isLoading && (
               <span className="text-sm text-muted-foreground animate-pulse font-medium">
                   Designing your journey...
               </span>
           )}
           <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-semibold shadow-subtle hover:bg-foreground/90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm tracking-wide"
           >
             Generate Journey
           </button>
        </div>
      </form>
    </motion.div>
  );
}
