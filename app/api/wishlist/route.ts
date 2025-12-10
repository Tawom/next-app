import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Tour from "@/models/Tour";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/wishlist
 *
 * Get all wishlist items for authenticated user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const wishlist = await Wishlist.find({ user: session.user.email })
      .populate("tour")
      .sort({ createdAt: -1 })
      .lean();

    // Filter out items where tour was deleted (tour is null)
    const validWishlist = wishlist.filter((item: any) => item.tour !== null);

    // Clean up orphaned wishlist items (optional background cleanup)
    const orphanedIds = wishlist
      .filter((item: any) => item.tour === null)
      .map((item: any) => item._id);
    if (orphanedIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: orphanedIds } });
    }

    return NextResponse.json(validWishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 *
 * Add tour to wishlist
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { tourId } = body;

    if (!tourId) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: session.user.email,
      tour: tourId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tour already in wishlist" },
        { status: 400 }
      );
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: session.user.email,
      tour: tourId,
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wishlist
 *
 * Remove tour from wishlist
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get("tourId");

    if (!tourId) {
      return NextResponse.json(
        { error: "Tour ID is required" },
        { status: 400 }
      );
    }

    const result = await Wishlist.findOneAndDelete({
      user: session.user.email,
      tour: tourId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
