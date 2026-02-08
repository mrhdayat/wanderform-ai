"use client";

import { useState } from "react";
import { TripProvider, useTrip } from "@/context/TripContext";
import { LandingHero } from "@/components/LandingHero";
import { NarrativeInput } from "@/components/NarrativeInput";
import { ThinkingState } from "@/components/ThinkingState";
import { DayCard } from "@/components/DayCard";
import { StylizedMap } from "@/components/StylizedMap";
import { BudgetInsight } from "@/components/BudgetInsight";
import { Changelog } from "@/components/Changelog";
import { ExportView } from "@/components/ExportView";
import { Map, ArrowLeft, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PlannerApp() {
  const { trip, isLoading, generateItinerary } = useTrip();
  const [showInput, setShowInput] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);

  if (trip) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden text-foreground antialiased selection:bg-primary/20">
        {/* Minimal Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 bg-background/80 backdrop-blur-md z-30 sticky top-0 border-b border-border/40">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.reload()} className="text-xl font-bold tracking-tight text-foreground hover:opacity-70 transition-opacity">
              WanderForm
            </button>
            <div className="hidden lg:flex items-center text-sm font-medium text-muted-foreground ml-4 pl-4 border-l border-border/50 h-5">
               <span className="text-foreground">{trip.destination}</span>
               <span className="mx-2 text-border">•</span>
               <span>{trip.durationDays} Days</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
               className="lg:hidden p-3 text-foreground hover:bg-muted/50 rounded-full transition-colors relative z-50 shadow-subtle bg-white border border-border/50"
               onClick={() => setShowMapMobile(!showMapMobile)}
             >
               {showMapMobile ? <ArrowLeft className="w-5 h-5" /> : <Map className="w-5 h-5" />}
             </button>

             {/* Simple Budget Indicator */}
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full border border-border/40 text-sm font-medium text-foreground">
               <span className="w-2 h-2 rounded-full bg-primary" />
               {(trip.budget.total / 1000000).toFixed(1)}M {trip.budget.currency}
             </div>

             <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Timeline (Left/Center) */}
          <div className={`flex-1 overflow-y-auto p-4 lg:p-12 transition-opacity duration-300 scroll-smooth ${showMapMobile ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
            <div className="max-w-3xl mx-auto pb-32">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
                 className="mb-12 text-center lg:text-left"
               >
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance text-foreground">Your Journey</h2>
                 <p className="text-xl text-muted-foreground font-light max-w-2xl text-balance">
                    A carefully curated narrative based on your preferences. Feel free to adjust the flow.
                 </p>
               </motion.div>

               <div className="space-y-8">
                {trip.days.map((day, index) => (
                    <DayCard key={day.id} day={day} index={index} />
                ))}
               </div>
            </div>
          </div>

          {/* Map & Tools (Right - Desktop / Overlay - Mobile) */}
          <div className={`
            absolute inset-0 lg:static lg:w-[480px] xl:w-[550px] border-l border-border/40 bg-white/50 backdrop-blur-sm z-20 lg:z-auto transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col h-full shadow-floating lg:shadow-none
            ${showMapMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-hide">
              <div className="w-full aspect-square max-h-[400px] shrink-0 rounded-3xl overflow-hidden border border-border/50 shadow-subtle bg-white relative group">
                <StylizedMap />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/20 to-transparent" />
              </div>

              <div className="bg-muted/20 rounded-2xl p-6 border border-border/30 backdrop-blur-sm">
                <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wider opacity-70">AI Assistant</h4>
                <p className="text-base text-muted-foreground font-light leading-relaxed italic">
                    &quot;I&apos;ve balanced your days between relaxation and adventure. The route minimizes travel time, giving you more moments to enjoy.&quot;
                </p>
              </div>

              <div className="space-y-6">
                <BudgetInsight />
                <Changelog />
              </div>
            </div>

            <div className="p-6 border-t border-border/30 bg-white/80 backdrop-blur shrink-0">
               <ExportView />
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ThinkingState />;
  }

  if (showInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <button
          onClick={() => setShowInput(false)}
          className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 px-4 py-2 hover:bg-white rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <NarrativeInput onGenerate={generateItinerary} isLoading={isLoading} />
      </div>
    );
  }

  return <LandingHero onStart={() => setShowInput(true)} />;
}

export default function Page() {
  return (
    <TripProvider>
      <PlannerApp />
    </TripProvider>
  );
}
