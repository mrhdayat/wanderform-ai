"use client";

import { useTrip } from "@/context/TripContext";
import { Printer, Download, Share2 } from "lucide-react";
import { useState } from "react";

export function ExportView() {
  const { trip } = useTrip();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Itinerary exported to PDF!");
    }, 1500);
  };

  if (!trip) return null;

  return (
    <div className="p-4 bg-white rounded-xl border border-border flex gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {isExporting ? <Printer className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
        PDF
      </button>
      <button className="flex items-center justify-center p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
