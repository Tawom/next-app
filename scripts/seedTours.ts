import mongoose from "mongoose";
import Tour from "../models/Tour.ts";
import User from "../models/User.ts";
import { mockTours } from "../lib/mockData.ts";
import { mockUsers } from "../lib/mockUsers.ts";
import "dotenv/config";

async function seedToursAndUsers() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not set in environment variables");
  }
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Remove existing tours and users
  await Tour.deleteMany({});
  console.log("Existing tours removed");
  await User.deleteMany({});
  console.log("Existing users removed");

  // Insert mock tours
  await Tour.insertMany(mockTours);
  console.log(`Inserted ${mockTours.length} tours`);

  // Insert mock users
  await User.insertMany(mockUsers);
  console.log(`Inserted ${mockUsers.length} users`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedToursAndUsers()
  .then(() => {
    console.log("Tour and user seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding tours and users:", err);
    process.exit(1);
  });
