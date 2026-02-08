"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Trip, Activity } from "@/types/trip";
import { generateTrip } from "@/lib/mock-ai";

interface TripContextType {
  trip: Trip | null;
  isLoading: boolean;
  history: string[];
  generateItinerary: (prompt: string) => Promise<void>;
  updateActivity: (dayId: string, activityId: string, updates: Partial<Activity>) => void;
  moveActivity: (fromDayId: string, toDayId: string, activityId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generateItinerary = useCallback(async (prompt: string) => {
    setIsLoading(true);
    try {
      const result = await generateTrip(prompt);
      setTrip(result);
      setHistory((prev) => [...prev, `Generated trip for: "${prompt}"`]);
    } catch (error) {
      console.error("Failed to generate trip", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateActivity = useCallback((dayId: string, activityId: string, updates: Partial<Activity>) => {
    setTrip((prev) => {
      if (!prev) return null;
      const newDays = prev.days.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          activities: day.activities.map((act) =>
            act.id === activityId ? { ...act, ...updates } : act
          ),
        };
      });

      // Calculate budget impact (mock logic)
      // In a real app, we would recalculate total here based on new prices

      return { ...prev, days: newDays };
    });
    setHistory((prev) => [...prev, `Updated activity ${activityId} on ${dayId}`]);
  }, []);

  const moveActivity = useCallback((fromDayId: string, toDayId: string, activityId: string) => {
    setTrip((prev) => {
        if (!prev) return null;

        let activityToMove: Activity | undefined;

        // Remove from source
        const daysAfterRemoval = prev.days.map(day => {
            if (day.id === fromDayId) {
                activityToMove = day.activities.find(a => a.id === activityId);
                return { ...day, activities: day.activities.filter(a => a.id !== activityId) };
            }
            return day;
        });

        if (!activityToMove) return prev; // Should not happen

        // Add to target
        const daysAfterAdd = daysAfterRemoval.map(day => {
            if (day.id === toDayId) {
                return { ...day, activities: [...day.activities, activityToMove!] };
            }
            return day;
        });

        return { ...prev, days: daysAfterAdd };
    });
    setHistory((prev) => [...prev, `Moved activity from ${fromDayId} to ${toDayId}`]);
  }, []);

  return (
    <TripContext.Provider
      value={{
        trip,
        isLoading,
        history,
        generateItinerary,
        updateActivity,
        moveActivity,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
