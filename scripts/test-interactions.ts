import { Trip, Day, Activity } from "../src/types/trip";

// Mock Data Setup
const mockActivity: Activity = {
    id: "a1",
    timeOfDay: "morning",
    title: "Surf Lesson",
    description: "Learn to surf",
    location: { name: "Kuta Beach" },
    priceEstimate: 200000,
    durationHours: 2,
    category: "adventure"
};

const mockDay1: Day = {
    id: "d1",
    date: "2023-01-01",
    title: "Day 1",
    summary: "Start",
    activities: [mockActivity]
};

const mockDay2: Day = {
    id: "d2",
    date: "2023-01-02",
    title: "Day 2",
    summary: "Next",
    activities: []
};

const mockTrip: Trip = {
    id: "t1",
    destination: "Bali",
    durationDays: 2,
    budget: { total: 1000000, currency: "IDR", breakdown: { accommodation: 0, food: 0, activities: 0, transport: 0, other: 0 } },
    days: [mockDay1, mockDay2],
    createdAt: "2023-01-01"
};

// Logic to Test (Mirrors TripContext)
function updateActivity(trip: Trip, dayId: string, activityId: string, updates: Partial<Activity>): Trip {
    const newDays = trip.days.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          activities: day.activities.map((act) =>
            act.id === activityId ? { ...act, ...updates } : act
          ),
        };
      });
      return { ...trip, days: newDays };
}

function moveActivity(trip: Trip, fromDayId: string, toDayId: string, activityId: string): Trip {
    let activityToMove: Activity | undefined;

    // Remove from source
    const daysAfterRemoval = trip.days.map(day => {
        if (day.id === fromDayId) {
            activityToMove = day.activities.find(a => a.id === activityId);
            return { ...day, activities: day.activities.filter(a => a.id !== activityId) };
        }
        return day;
    });

    if (!activityToMove) throw new Error("Activity not found");

    // Add to target
    const daysAfterAdd = daysAfterRemoval.map(day => {
        if (day.id === toDayId) {
            return { ...day, activities: [...day.activities, activityToMove!] };
        }
        return day;
    });

    return { ...trip, days: daysAfterAdd };
}

// Run Tests
function runTests() {
    console.log("Starting Interaction Tests...");

    // Test Update
    console.log("Test: Update Activity Title");
    const updatedTrip = updateActivity(mockTrip, "d1", "a1", { title: "Advanced Surf" });
    const updatedAct = updatedTrip.days[0].activities.find(a => a.id === "a1");
    if (updatedAct?.title === "Advanced Surf") {
        console.log("PASS: Title updated");
    } else {
        console.error("FAIL: Title not updated", updatedAct);
    }

    // Test Move
    console.log("Test: Move Activity from D1 to D2");
    const movedTrip = moveActivity(mockTrip, "d1", "d2", "a1");

    const d1Activities = movedTrip.days[0].activities;
    const d2Activities = movedTrip.days[1].activities;

    if (d1Activities.length === 0 && d2Activities.length === 1 && d2Activities[0].id === "a1") {
        console.log("PASS: Activity moved successfully");
    } else {
        console.error("FAIL: Move failed", { d1: d1Activities, d2: d2Activities });
    }
}

runTests();
