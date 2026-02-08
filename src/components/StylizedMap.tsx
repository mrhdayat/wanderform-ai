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
      x: ((p.lng - minLng) / lngSpan) * 70 + 15, // 15% padding
      y: 100 - (((p.lat - minLat) / latSpan) * 70 + 15), // Invert Y for SVG
      id: p.id
    }));
  }, [trip]);

  if (!trip) return null;

  return (
    <div className="w-full h-full bg-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      <svg className="w-full h-full absolute inset-0 drop-shadow-sm" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Soft Route Line */}
        <motion.path
          d={`M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          strokeOpacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        {/* Connection Points */}
        {points.map((p, i) => (
          <motion.g
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15, type: "spring" }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="var(--background)"
              stroke="var(--primary)"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-4 transition-all duration-300"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="1"
              fill="var(--primary)"
            />
          </motion.g>
        ))}
      </svg>

      <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-subtle border border-white/50 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground z-10">
        Route Preview
      </div>
    </div>
  );
}
