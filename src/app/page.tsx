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
import { Map, ArrowLeft } from "lucide-react";

function PlannerApp() {
  const { trip, isLoading, generateItinerary } = useTrip();
  const [showInput, setShowInput] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);

  if (trip) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.reload()} className="text-primary font-bold tracking-tight hover:opacity-80 transition-opacity">
              WanderForm
            </button>
            <div className="h-6 w-px bg-border mx-2 hidden lg:block" />
            <h1 className="text-sm font-medium text-foreground hidden lg:block">{trip.destination} · {trip.durationDays} Days</h1>
          </div>
          <div className="flex items-center gap-2">
             <button
               className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-full"
               onClick={() => setShowMapMobile(!showMapMobile)}
             >
               {showMapMobile ? <ArrowLeft className="w-5 h-5" /> : <Map className="w-5 h-5" />}
             </button>
             <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
               {(trip.budget.total / 1000000).toFixed(1)}M {trip.budget.currency}
             </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Timeline (Left/Center) */}
          <div className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-opacity duration-300 ${showMapMobile ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
               <div className="mb-8">
                 <h2 className="text-3xl font-serif font-medium mb-2">Your Itinerary</h2>
                 <p className="text-muted-foreground">Drag and drop activities to adjust your flow.</p>
               </div>

               {trip.days.map((day, index) => (
                 <DayCard key={day.id} day={day} index={index} />
               ))}
            </div>
          </div>

          {/* Map & Tools (Right - Desktop / Overlay - Mobile) */}
          <div className={`
            absolute inset-0 lg:static lg:w-[450px] border-l border-border bg-white z-20 lg:z-auto transition-transform duration-300 transform flex flex-col h-full
            ${showMapMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="w-full h-[250px] shrink-0">
                <StylizedMap />
              </div>

              <div className="bg-muted/10 rounded-xl p-4 border border-border/40">
                <h4 className="font-semibold text-foreground mb-1 text-sm">AI Assistant</h4>
                <p className="text-xs text-muted-foreground italic">&quot;I&apos;ve balanced your days between relaxation and adventure. The route minimizes travel time.&quot;</p>
              </div>

              <BudgetInsight />

              <div className="space-y-2">
                 <Changelog />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/5 shrink-0">
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
          className="absolute top-8 left-8 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
