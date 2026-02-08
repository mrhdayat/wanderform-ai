"use client";

import { useTrip } from "@/context/TripContext";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function BudgetInsight() {
  const { trip } = useTrip();

  const costs = useMemo(() => {
    if (!trip) return { total: 0, categories: {} };

    const categories: Record<string, number> = {
      accommodation: trip.budget.breakdown.accommodation,
      food: trip.budget.breakdown.food,
      transport: trip.budget.breakdown.transport,
      activities: 0
    };

    trip.days.forEach(day => {
      day.activities.forEach(act => {
        if (act.category === 'food') {
           categories.food += act.priceEstimate;
        } else {
           categories.activities += act.priceEstimate;
        }
      });
    });

    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    return { total, categories };
  }, [trip]);

  if (!trip) return null;

  const percentage = Math.min((costs.total / trip.budget.total) * 100, 100);
  const isOverBudget = costs.total > trip.budget.total;

  return (
    <div className="p-6 bg-white rounded-2xl border border-border/40 shadow-subtle space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Budget Overview</h3>
        <span className={cn("text-2xl font-bold tracking-tight", isOverBudget ? "text-error" : "text-success")}>
          {(costs.total / 1000000).toFixed(1)}M <span className="text-sm font-medium text-muted-foreground font-normal">/ {(trip.budget.total / 1000000).toFixed(1)}M {trip.budget.currency}</span>
        </span>
      </div>

      {/* Minimal Progress Bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
        <div
          className={cn("h-full transition-all duration-700 ease-out rounded-full", isOverBudget ? "bg-error" : "bg-foreground")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Clean Breakdown */}
      <div className="space-y-3 pt-2">
        {Object.entries(costs.categories).map(([category, amount]) => (
          <div key={category} className="flex justify-between items-center text-sm group hover:bg-muted/30 p-2 rounded-lg transition-colors -mx-2">
            <span className="capitalize text-muted-foreground font-medium flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${category === 'accommodation' ? 'bg-primary/80' : 'bg-muted-foreground/30'}`} />
                {category}
            </span>
            <span className="font-semibold text-foreground tabular-nums tracking-wide">{(amount / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-4 border-t border-border/40 font-light">
        {isOverBudget
          ? "You are slightly over budget. Consider replacing a fine dining dinner with a local warung."
          : "You're on track. Great job managing your expenses."}
      </p>
    </div>
  );
}
