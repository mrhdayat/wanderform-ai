"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Wallet } from "lucide-react";

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
      if (match) newChips.push({ type: "location", label: match[0], icon: <MapPin className="w-3 h-3" /> });
    }

    // Detect Duration
    if (/\b(\d+)\s*(day|days|week|weeks)\b/i.test(newValue)) {
       const match = newValue.match(/\b(\d+)\s*(day|days|week|weeks)\b/i);
       if (match) newChips.push({ type: "duration", label: match[0], icon: <Calendar className="w-3 h-3" /> });
    }

    // Detect Budget
    if (/\b(budget|cheap|luxury|\d+\s*(million|k|thousand))\b/i.test(newValue)) {
       const match = newValue.match(/\b(budget|cheap|luxury|\d+\s*(million|k|thousand))\b/i);
       if (match) newChips.push({ type: "budget", label: match[0], icon: <Wallet className="w-3 h-3" /> });
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto p-6 md:p-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label htmlFor="narrative-input" className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">
          Where does your story begin?
        </label>

        <div className="relative group">
          <textarea
            id="narrative-input"
            value={value}
            onChange={handleInputChange}
            placeholder="I want to go to Bali for 6 days, focused on beaches and cafes..."
            className="w-full min-h-[200px] p-6 text-xl md:text-2xl bg-muted/30 border border-transparent focus:border-primary/20 rounded-xl resize-none outline-none transition-all placeholder:text-muted-foreground/50 shadow-inner group-focus-within:bg-background group-focus-within:shadow-xl group-focus-within:ring-1 ring-primary/10"
            disabled={isLoading}
          />

          {/* Floating Chips */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 pointer-events-none">
            <AnimatePresence>
              {chips.map((chip, i) => (
                <motion.div
                  key={chip.label + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium text-primary shadow-sm"
                >
                  {chip.icon}
                  <span className="capitalize">{chip.label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
           {isLoading && (
               <span className="text-sm text-muted-foreground animate-pulse">
                   Weaving your journey...
               </span>
           )}
           <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             <Sparkles className="w-4 h-4" />
             Generate Journey
           </button>
        </div>
      </form>
    </motion.div>
  );
}
