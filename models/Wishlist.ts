import mongoose from "mongoose";

/**
 * Wishlist Model
 *
 * Stores user's favorite tours
 *
 * Features:
 * - One-to-many relationship (user can have many wishlist items)
 * - Prevents duplicate entries
 * - Timestamps for sorting
 */

interface IWishlist {
  user: string; // User email
  tour: mongoose.Types.ObjectId;
  createdAt: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    user: {
      type: String,
      required: [true, "Wishlist must belong to a user"],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Wishlist must have a tour"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate wishlist items
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

// Index for faster queries
wishlistSchema.index({ user: 1, createdAt: -1 });

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
