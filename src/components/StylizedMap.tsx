"use client";

import { useTrip } from "@/context/TripContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function StylizedMap() {
  const { trip } = useTrip();

  const points = useMemo(() => {
    if (!trip) return [];

    // Flatten activities to get all locations
    const allActivities = trip.days.flatMap(d => d.activities);
    const validPoints = allActivities
      .filter(a => a.location.lat && a.location.lng)
      .map(a => ({ lat: a.location.lat!, lng: a.location.lng!, id: a.id }));

    if (validPoints.length < 2) return validPoints;

    // Calculate bounds
    const lats = validPoints.map(p => p.lat);
    const lngs = validPoints.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Padding
    const latSpan = maxLat - minLat || 0.01;
    const lngSpan = maxLng - minLng || 0.01;

    return validPoints.map(p => ({
      x: ((p.lng - minLng) / lngSpan) * 80 + 10, // 10% padding
      y: 100 - (((p.lat - minLat) / latSpan) * 80 + 10), // Invert Y for SVG
      id: p.id
    }));
  }, [trip]);

  if (!trip) return null;

  return (
    <div className="w-full h-full min-h-[300px] bg-muted/20 rounded-2xl relative overflow-hidden border border-border/50">
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection Lines */}
        <motion.path
          d={`M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="opacity-50"
        />

        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="var(--primary)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="cursor-pointer hover:r-2 transition-all"
          />
        ))}
      </svg>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs text-muted-foreground border border-border/50">
        Stylized Route View
      </div>
    </div>
  );
}
