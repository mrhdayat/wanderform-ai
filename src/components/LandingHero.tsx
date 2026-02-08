"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  onStart: () => void;
  className?: string;
}

export function LandingHero({ onStart, className }: LandingHeroProps) {
  return (
    <section className={cn("flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-4xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-sm font-medium tracking-widest text-primary uppercase mb-4 block">
          WanderForm AI
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-foreground tracking-tight leading-[1.1] mb-6">
          Plan your trip like a story, <br className="hidden md:block" />
          <span className="italic text-secondary">not a spreadsheet.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          An editorial approach to travel planning. Tell us your dream, and we&apos;ll craft a narrative itinerary just for you.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
        >
          Start Planning
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </section>
  );
}
