/**
 * Admin Setup Script
 *
 * Use this to make a user an admin.
 * Run: node scripts/makeAdmin.js your-email@example.com
 *
 * Or update a user directly in MongoDB Compass/Atlas:
 * 1. Open Users collection
 * 2. Find your user by email
 * 3. Change "role" field from "user" to "admin"
 * 4. Save
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`✅ User ${email} is already an admin`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ Successfully made ${email} an admin!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: node scripts/makeAdmin.js your-email@example.com");
  process.exit(1);
}

makeAdmin(email);
