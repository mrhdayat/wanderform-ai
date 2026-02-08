"use client";

import { useTrip } from "@/context/TripContext";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function BudgetInsight() {
  const { trip } = useTrip();

  const costs = useMemo(() => {
    if (!trip) return { total: 0, categories: {} };

    const categories: Record<string, number> = {
      accommodation: trip.budget.breakdown.accommodation, // Fixed base cost
      food: trip.budget.breakdown.food,
      transport: trip.budget.breakdown.transport,
      activities: 0
    };

    // Sum up activities
    trip.days.forEach(day => {
      day.activities.forEach(act => {
        // Simple mapping based on category or just aggregate 'activities'
        // For this demo, let's assume activity price is always 'activities' or 'food'
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
    <div className="p-4 bg-white rounded-xl border border-border space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-foreground">Budget Overview</h3>
        <span className={cn("text-sm font-medium", isOverBudget ? "text-error" : "text-success")}>
          {(costs.total / 1000000).toFixed(1)}M / {(trip.budget.total / 1000000).toFixed(1)}M {trip.budget.currency}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", isOverBudget ? "bg-error" : "bg-primary")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm">
        {Object.entries(costs.categories).map(([category, amount]) => (
          <div key={category} className="flex justify-between text-muted-foreground">
            <span className="capitalize">{category}</span>
            <span>{(amount / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground pt-2 border-t border-border">
        {isOverBudget
          ? "You are slightly over budget. Consider replacing a fine dining dinner with a local warung."
          : "Great job! You have room for extra souvenirs or an upgrade."}
      </p>
    </div>
  );
}
