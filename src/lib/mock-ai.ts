import { Trip } from "@/types/trip";

const MOCK_TRIP_BALI: Trip = {
  id: "trip-bali-001",
  destination: "Bali, Indonesia",
  durationDays: 6,
  createdAt: new Date().toISOString(),
  budget: {
    total: 7000000,
    currency: "IDR",
    breakdown: {
      accommodation: 3000000,
      food: 1500000,
      activities: 1500000,
      transport: 500000,
      other: 500000,
    },
  },
  days: [
    {
      id: "day-1",
      date: new Date().toISOString(),
      title: "Arrival & Jimbaran Sunset",
      summary: "Arrive in Bali, settle into your villa, and enjoy a fresh seafood dinner on the beach.",
      activities: [
        {
          id: "act-1-1",
          timeOfDay: "afternoon",
          title: "Check-in at Villa",
          description: "Relax after your flight at a private villa in Jimbaran.",
          location: { name: "Jimbaran Area", lat: -8.78, lng: 115.17 },
          priceEstimate: 0,
          durationHours: 2,
          category: "relaxation",
        },
        {
          id: "act-1-2",
          timeOfDay: "evening",
          title: "Seafood Dinner at Jimbaran Bay",
          description: "Watch the sunset while eating fresh grilled fish by the ocean.",
          location: { name: "Menega Cafe", lat: -8.77, lng: 115.16 },
          priceEstimate: 350000,
          durationHours: 3,
          category: "food",
        },
      ],
    },
    {
      id: "day-2",
      date: new Date(Date.now() + 86400000).toISOString(),
      title: "Uluwatu Cliffs & Culture",
      summary: "Explore the southern tip of Bali with stunning cliffs and the famous Kecak dance.",
      activities: [
        {
          id: "act-2-1",
          timeOfDay: "morning",
          title: "Breakfast at Suka Espresso",
          description: "Start the day with high-quality coffee and avocado toast.",
          location: { name: "Suka Espresso", lat: -8.81, lng: 115.15 },
          priceEstimate: 120000,
          durationHours: 1.5,
          category: "food",
        },
        {
          id: "act-2-2",
          timeOfDay: "afternoon",
          title: "Padang Padang Beach",
          description: "Sunbathe and swim at one of Bali's most iconic surf beaches.",
          location: { name: "Padang Padang Beach", lat: -8.81, lng: 115.10 },
          priceEstimate: 50000,
          durationHours: 3,
          category: "relaxation",
        },
        {
          id: "act-2-3",
          timeOfDay: "evening",
          title: "Uluwatu Temple & Kecak Dance",
          description: "Witness the dramatic fire dance performance at sunset on a cliff.",
          location: { name: "Uluwatu Temple", lat: -8.82, lng: 115.08 },
          priceEstimate: 150000,
          durationHours: 2,
          category: "culture",
        },
      ],
    },
    // Add more days as needed for a 6-day trip, but kept short for demo
    {
        id: "day-3",
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        title: "Canggu Cafe Hopping",
        summary: "Experience the vibrant digital nomad scene and beach clubs.",
        activities: [
            {
                id: "act-3-1",
                timeOfDay: "morning",
                title: "Yoga at The Practice",
                description: "Rejuvenate with a morning yoga session.",
                location: { name: "The Practice", lat: -8.65, lng: 115.13 },
                priceEstimate: 150000,
                durationHours: 1.5,
                category: "relaxation"
            },
             {
                id: "act-3-2",
                timeOfDay: "afternoon",
                title: "Work & Chill at specialized cafe",
                description: "Get some work done or read a book.",
                location: { name: "Crate Cafe", lat: -8.64, lng: 115.14 },
                priceEstimate: 100000,
                durationHours: 3,
                category: "food"
            },
             {
                id: "act-3-3",
                timeOfDay: "evening",
                title: "Sunset at The Lawn",
                description: "Cocktails and music by the beach.",
                location: { name: "The Lawn", lat: -8.65, lng: 115.12 },
                priceEstimate: 300000,
                durationHours: 3,
                category: "adventure"
            }
        ]
    }
  ],
};

export async function generateTrip(prompt: string): Promise<Trip> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Basic mock reasoning based on prompt keywords
  if (prompt.toLowerCase().includes("japan")) {
     // Return a Japan trip (mock implementation would go here, defaulting to Bali for now to save space)
     // For this demo, let's just modify the destination name to show it reacts
     return {
         ...MOCK_TRIP_BALI,
         id: "trip-japan-001",
         destination: "Tokyo, Japan",
         budget: { ...MOCK_TRIP_BALI.budget, currency: "JPY", total: 200000 },
         days: MOCK_TRIP_BALI.days.map(d => ({...d, title: d.title.replace("Jimbaran", "Shinjuku").replace("Uluwatu", "Shibuya")}))
     }
  }

  // Default to Bali
  return MOCK_TRIP_BALI;
}
