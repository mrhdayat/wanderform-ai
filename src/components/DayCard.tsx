"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Day, Activity } from "@/types/trip";
import { Edit2, MapPin, Clock, DollarSign, Save, X } from "lucide-react";
import { useTrip } from "@/context/TripContext";
import { cn } from "@/lib/utils";

interface DayCardProps {
  day: Day;
  index: number;
}

export function DayCard({ day, index }: DayCardProps) {
  const { updateActivity } = useTrip();
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState<{ title: string; description: string }>({ title: "", description: "" });

  const startEditing = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setEditForm({ title: activity.title, description: activity.description });
  };

  const cancelEditing = () => {
    setEditingActivityId(null);
  };

  const saveEditing = (activityId: string) => {
    updateActivity(day.id, activityId, editForm);
    setEditingActivityId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 md:p-8 mb-6 border border-border/40 hover:border-border/80 transition-all shadow-subtle hover:shadow-floating"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex flex-col gap-2"
      >
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Day {index + 1}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-snug">
            {day.title}
        </h3>
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
            {day.summary}
        </p>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-8 pt-6 border-t border-border/30"
          >
            <div className="space-y-10 pl-4 border-l-2 border-border/30 ml-2">
              {["morning", "afternoon", "evening"].map((time) => {
                const activities = day.activities.filter((a) => a.timeOfDay === time);
                if (activities.length === 0) return null;

                return (
                  <div key={time} className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-border ring-4 ring-white" />
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4 pl-4">{time}</h4>
                    <div className="space-y-6 pl-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="relative group">
                          {editingActivityId === activity.id ? (
                            <div className="space-y-4 bg-muted/30 p-4 rounded-xl -ml-4 border border-primary/10">
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full text-lg font-semibold bg-transparent border-b border-primary/20 focus:border-primary outline-none py-1 text-foreground"
                                autoFocus
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full text-sm text-muted-foreground bg-white border border-border rounded-lg p-3 outline-none resize-none focus:border-primary/20"
                                rows={3}
                              />
                              <div className="flex justify-end gap-3 pt-2">
                                <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-medium hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                  Cancel
                                </button>
                                <button onClick={() => saveEditing(activity.id)} className="px-3 py-1.5 text-xs font-medium bg-foreground text-background hover:opacity-90 rounded-full transition-colors flex items-center gap-1">
                                  <Save className="w-3 h-3" /> Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="group relative pr-8">
                              <div className="flex justify-between items-baseline mb-1">
                                <h5 className="text-xl font-medium text-foreground tracking-tight">{activity.title}</h5>
                                <button
                                  onClick={(e) => { e.stopPropagation(); startEditing(activity); }}
                                  className="opacity-0 group-hover:opacity-100 transition-all p-2 text-muted-foreground hover:text-primary bg-white rounded-full shadow-subtle absolute right-0 top-0"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-base text-muted-foreground leading-relaxed mb-3 font-light">
                                {activity.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium opacity-80">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-primary/70" /> {activity.durationHours}h
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <DollarSign className="w-4 h-4 text-primary/70" /> {(activity.priceEstimate / 1000).toFixed(0)}k
                                </span>
                                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                                  <MapPin className="w-4 h-4 text-primary/70" /> {activity.location.name}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
