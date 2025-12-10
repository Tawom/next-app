import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/reviews
 *
 * Fetch reviews for a specific tour
 *
 * Query params:
 * - tourId: Tour ID to fetch reviews for
 * - limit: Number of reviews to return (default 10)
 * - page: Page number for pagination (default 1)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get("tourId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    if (!tourId) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ tour: tourId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ tour: tourId });

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + reviews.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 *
 * Create a new review for a tour
 *
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { tourId, rating, title, comment } = body;

    // Validation
    if (!tourId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this tour
    const existingReview = await Review.findOne({
      tour: tourId,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this tour" },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      tour: tourId,
      user: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.image,
      rating,
      title,
      comment,
      verified: false, // TODO: Check if user has booked this tour
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
