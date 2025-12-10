import mongoose from "mongoose";
import Tour from "../models/Tour.ts";
import { mockTours } from "../lib/mockData.ts";
import 'dotenv/config';

async function seedTours() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not set in environment variables");
  }
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Remove existing tours
  await Tour.deleteMany({});
  console.log("Existing tours removed");

  // Insert mock tours
  await Tour.insertMany(mockTours);
  console.log(`Inserted ${mockTours.length} tours`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedTours()
  .then(() => {
    console.log("Tour seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding tours:", err);
    process.exit(1);
  });
