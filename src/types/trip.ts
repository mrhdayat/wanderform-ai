export interface Trip {
  id: string;
  destination: string;
  durationDays: number;
  budget: Budget;
  days: Day[];
  createdAt: string; // ISO date string
}

export interface Budget {
  total: number;
  currency: string;
  breakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    other: number;
  };
}

export interface Day {
  id: string; // e.g., "day-1"
  date: string; // ISO date string (relative to trip start)
  title: string; // e.g., "Day 1: Arrival & Sunset"
  summary: string;
  activities: Activity[];
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface Activity {
  id: string;
  timeOfDay: TimeOfDay;
  title: string;
  description: string;
  location: {
    name: string;
    lat?: number;
    lng?: number;
    address?: string;
  };
  priceEstimate: number;
  durationHours: number;
  category: 'food' | 'sightseeing' | 'relaxation' | 'adventure' | 'culture';
}
