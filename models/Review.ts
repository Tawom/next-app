import mongoose from "mongoose";

/**
 * Review Model
 *
 * Stores user reviews and ratings for tours.
 *
 * Features:
 * - Star ratings (1-5)
 * - Text review
 * - User reference
 * - Tour reference
 * - Timestamps
 * - Helpful votes
 *
 * Relationships:
 * - Each review belongs to one user
 * - Each review belongs to one tour
 * - User can only review a tour once
 */

interface IReview {
  tour: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string; // Cached for performance
  userAvatar?: string; // Cached for performance
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  helpfulVotes: number;
  verified: boolean; // True if user has booked this tour
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    userAvatar: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Review title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
reviewSchema.index({ tour: 1, createdAt: -1 }); // Get reviews for a tour, newest first
reviewSchema.index({ user: 1, tour: 1 }, { unique: true }); // One review per user per tour

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function (tourId: string) {
  const stats = await this.aggregate([
    {
      $match: { tour: new mongoose.Types.ObjectId(tourId) },
    },
    {
      $group: {
        _id: "$tour",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
      numReviews: stats[0].numReviews,
    });
  } else {
    // No reviews, set defaults
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      rating: 4.5,
      numReviews: 0,
    });
  }
};

// Update tour rating after save
reviewSchema.post("save", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.constructor as any).calcAverageRating(this.tour);
});

// Update tour rating after delete
reviewSchema.post(
  /^findOneAnd/,
  async function (doc: mongoose.Document & IReview) {
    if (doc) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (doc.constructor as any).calcAverageRating(doc.tour);
    }
  }
);

const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
