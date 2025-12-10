import mongoose from "mongoose";

/**
 * MongoDB Connection Utility
 *
 * Why this pattern?
 * - Next.js serverless functions are stateless
 * - Each API request might run in a new instance
 * - We need to reuse connections instead of creating new ones
 * - Prevents "too many connections" errors
 *
 * How it works:
 * 1. Check if already connected → reuse connection
 * 2. If not connected → create new connection
 * 3. Cache connection globally for reuse
 *
 * @returns Promise that resolves when connected
 */

// Global cache to prevent multiple connections
const globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, reuse connection
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    console.log("🔄 Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
