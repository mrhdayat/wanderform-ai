import { generateTrip } from "../src/lib/mock-ai";

async function run() {
  console.log("Testing AI with 'Bali' prompt...");
  const baliTrip = await generateTrip("I want to go to Bali");
  console.log("Generated Trip:", baliTrip.destination, baliTrip.days.length, "days");

  console.log("Testing AI with 'Japan' prompt...");
  const japanTrip = await generateTrip("Japan trip");
  console.log("Generated Trip:", japanTrip.destination);
}

run().catch(console.error);
