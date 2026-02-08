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
    <section className={cn("flex flex-col items-center justify-center min-h-[85vh] px-6 text-center max-w-5xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-sm font-semibold tracking-wide text-primary uppercase mb-6 block opacity-80">
          WanderForm AI
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-foreground tracking-tight leading-[1.05] mb-8 text-balance">
          Plan your journey, <br className="hidden md:block" />
          <span className="text-muted-foreground font-medium">like a story.</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-balance font-light">
          An editorial approach to travel planning. Simple, human, and tailored to your narrative.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background text-lg font-semibold rounded-full hover:bg-foreground/90 transition-all shadow-subtle hover:shadow-lg"
        >
          Start Planning
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </section>
  );
}
