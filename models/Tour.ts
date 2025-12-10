import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Tour Model for MongoDB
 *
 * Replaces mockData.ts with real database storage
 *
 * Why MongoDB for tours?
 * - Flexible schema (easy to add new fields)
 * - Fast queries for filtering/searching
 * - Scalable for thousands of tours
 * - Built-in indexing for performance
 */

export interface ITour extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "moderate" | "difficult";
  rating: number;
  numReviews: number;
  imageUrl: string;
  images?: string[]; // Gallery images
  location: string;
  startDates: Date[];
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [100, "Tour name must be less than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      min: [0, "Price must be a positive number"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
      min: [1, "Duration must be at least 1 day"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
      min: [1, "Group size must be at least 1"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "moderate", "difficult"],
        message: "Difficulty must be easy, moderate, or difficult",
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must be at most 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },
    imageUrl: {
      type: String,
      required: [true, "A tour must have an image"],
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    location: {
      type: String,
      required: [true, "A tour must have a location"],
    },
    startDates: {
      type: [Date],
      required: [true, "A tour must have start dates"],
      validate: {
        validator: function (dates: Date[]) {
          return dates.length > 0;
        },
        message: "A tour must have at least one start date",
      },
    },
    highlights: {
      type: [String],
      required: [true, "A tour must have highlights"],
      validate: {
        validator: function (highlights: string[]) {
          return highlights.length > 0;
        },
        message: "A tour must have at least one highlight",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
TourSchema.index({ price: 1, rating: -1 }); // For sorting
TourSchema.index({ difficulty: 1 }); // For filtering
TourSchema.index({ location: 1 }); // For location-based search

const Tour: Model<ITour> =
  mongoose.models.Tour || mongoose.model<ITour>("Tour", TourSchema);

export default Tour;
