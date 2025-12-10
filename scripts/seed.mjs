/**
 * Database Seeder Script
 *
 * Populates MongoDB with initial tour data from mockData.ts
 *
 * Usage:
 * - npm run seed
 * - tsx (TypeScript executor) will run this file
 *
 * What it does:
 * 1. Connects to MongoDB
 * 2. Clears existing tours
 * 3. Inserts mock tours
 * 4. Closes connection
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

// Simple MongoDB connection for seeder
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI not found in .env.local");
  console.log(
    "\n💡 Please create .env.local file with your MongoDB connection string"
  );
  console.log("   See .env.local.example for reference\n");
  process.exit(1);
}

/**
 * Mock tour data
 */
const mockTours = [
  {
    name: "The Northern Lights Adventure",
    description:
      "Experience the magical Aurora Borealis in Iceland. This unforgettable journey takes you to the best viewing spots, including remote locations away from city lights.",
    price: 2499,
    duration: 7,
    maxGroupSize: 12,
    difficulty: "moderate",
    rating: 4.8,
    numReviews: 234,
    imageUrl:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80",
    location: "Reykjavik, Iceland",
    startDates: ["2025-12-15", "2026-01-10", "2026-01-25"],
    highlights: [
      "Northern Lights hunting with expert guides",
      "Visit to the Blue Lagoon",
      "Glacier hiking experience",
      "Traditional Icelandic cuisine",
    ],
  },
  {
    name: "Tropical Paradise in Bali",
    description:
      "Discover the enchanting island of Bali with its stunning beaches, ancient temples, lush rice terraces, and vibrant culture.",
    price: 1899,
    duration: 10,
    maxGroupSize: 15,
    difficulty: "easy",
    rating: 4.9,
    numReviews: 412,
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    location: "Ubud, Bali",
    startDates: ["2025-12-20", "2026-01-15", "2026-02-10"],
    highlights: [
      "Sunrise trek to Mount Batur",
      "Rice terrace photography tour",
      "Traditional Balinese cooking class",
      "Beach sunset ceremonies",
    ],
  },
  {
    name: "Machu Picchu Trek",
    description:
      "Hike the legendary Inca Trail to the ancient citadel of Machu Picchu. This challenging trek rewards you with breathtaking mountain views and rich history.",
    price: 3299,
    duration: 8,
    maxGroupSize: 10,
    difficulty: "difficult",
    rating: 4.7,
    numReviews: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    location: "Cusco, Peru",
    startDates: ["2025-12-15", "2026-01-20", "2026-03-01"],
    highlights: [
      "4-day Inca Trail trek",
      "Professional mountain guides",
      "Visit to Sacred Valley",
      "Sunrise at Machu Picchu",
    ],
  },
  {
    name: "Safari in the Serengeti",
    description:
      "Witness the incredible wildlife of Tanzania on this luxury safari adventure. See the Big Five and experience the Great Migration.",
    price: 4599,
    duration: 12,
    maxGroupSize: 8,
    difficulty: "easy",
    rating: 5.0,
    numReviews: 156,
    imageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    location: "Serengeti, Tanzania",
    startDates: ["2025-12-18", "2026-01-22", "2026-03-15"],
    highlights: [
      "Daily game drives",
      "Luxury tented camps",
      "Hot air balloon safari",
      "Maasai village visit",
    ],
  },
  {
    name: "Japanese Cultural Experience",
    description:
      "Immerse yourself in Japanese culture with visits to ancient temples, traditional tea ceremonies, and the bustling streets of Tokyo.",
    price: 2799,
    duration: 14,
    maxGroupSize: 16,
    difficulty: "easy",
    rating: 4.8,
    numReviews: 298,
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    location: "Tokyo & Kyoto, Japan",
    startDates: ["2025-12-20", "2026-01-25", "2026-03-20"],
    highlights: [
      "Traditional tea ceremony",
      "Sumo wrestling experience",
      "Mount Fuji day trip",
      "Authentic ryokan stay",
    ],
  },
  {
    name: "Swiss Alps Adventure",
    description:
      "Explore the majestic Swiss Alps with hiking, mountain railways, and charming alpine villages. Perfect for nature lovers and adventure seekers.",
    price: 3499,
    duration: 9,
    maxGroupSize: 14,
    difficulty: "moderate",
    rating: 4.9,
    numReviews: 267,
    imageUrl:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    location: "Interlaken, Switzerland",
    startDates: ["2025-12-15", "2026-01-10", "2026-02-25"],
    highlights: [
      "Jungfrau railway to Top of Europe",
      "Paragliding in Interlaken",
      "Scenic Alpine hikes",
      "Swiss chocolate factory tour",
    ],
  },
];

/**
 * Simple Tour schema for seeding
 */
const TourSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    duration: Number,
    maxGroupSize: Number,
    difficulty: String,
    rating: Number,
    numReviews: Number,
    imageUrl: String,
    location: String,
    startDates: [Date],
    highlights: [String],
  },
  { timestamps: true }
);

const Tour = mongoose.models.Tour || mongoose.model("Tour", TourSchema);

/**
 * Seed Tours into Database
 */
async function seedTours() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Clear existing tours
    console.log("🗑️  Clearing existing tours...");
    await Tour.deleteMany({});
    console.log("✅ Existing tours cleared\n");

    // Insert mock tours
    console.log("📝 Inserting tours...");
    const tours = await Tour.insertMany(mockTours);
    console.log(`✅ ${tours.length} tours inserted successfully!\n`);

    // Display inserted tours
    console.log("Inserted tours:");
    tours.forEach((tour, index) => {
      console.log(`  ${index + 1}. ${tour.name} - $${tour.price}`);
    });

    console.log("\n🎉 Database seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run seeder
seedTours();
