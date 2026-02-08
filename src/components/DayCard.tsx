"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Day, Activity } from "@/types/trip";
import { Edit2, MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { useTrip } from "@/context/TripContext";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-border overflow-hidden"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div>
          <h3 className="text-lg font-semibold text-primary">Day {index + 1}</h3>
          <p className="text-sm font-medium text-foreground">{day.title}</p>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-6 bg-muted/5">
              <p className="text-sm text-muted-foreground italic mb-4">&quot;{day.summary}&quot;</p>

              {["morning", "afternoon", "evening"].map((time) => {
                const activities = day.activities.filter((a) => a.timeOfDay === time);
                if (activities.length === 0) return null;

                return (
                  <div key={time}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{time}</h4>
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="bg-white p-3 rounded-lg border border-border/50 shadow-sm relative group">
                          {editingActivityId === activity.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full text-sm font-semibold border-b border-primary/20 focus:border-primary outline-none py-1"
                                autoFocus
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full text-xs text-muted-foreground border border-border rounded p-2 outline-none resize-none focus:border-primary/20"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={cancelEditing} className="p-1 hover:bg-muted rounded text-muted-foreground">
                                  <X className="w-4 h-4" />
                                </button>
                                <button onClick={() => saveEditing(activity.id)} className="p-1 hover:bg-success/10 text-success rounded">
                                  <Save className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <h5 className="text-sm font-semibold text-foreground">{activity.title}</h5>
                                <button
                                  onClick={(e) => { e.stopPropagation(); startEditing(activity); }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 mb-2 leading-relaxed">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {activity.durationHours}h
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" /> {(activity.priceEstimate / 1000).toFixed(0)}k
                                </span>
                                <span className="flex items-center gap-1 truncate max-w-[120px]">
                                  <MapPin className="w-3 h-3" /> {activity.location.name}
                                </span>
                              </div>
                            </>
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
