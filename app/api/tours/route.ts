import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";

/**
 * GET /api/tours - Fetch tours with filtering and sorting
 *
 * Why a dedicated API route?
 * - Separates data fetching logic from UI
 * - Reusable endpoint for different pages
 * - Server-side filtering is faster than client-side
 * - Better for SEO and performance
 *
 * Query Parameters:
 * - search: Text search for name/location
 * - difficulty: Filter by difficulty level
 * - minPrice, maxPrice: Price range
 * - minDuration, maxDuration: Duration range
 * - sortBy: Sort order (price-asc, price-desc, rating, name)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "all";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 999999;
    const minDuration = Number(searchParams.get("minDuration")) || 0;
    const maxDuration = Number(searchParams.get("maxDuration")) || 999;
    const sortBy = searchParams.get("sortBy") || "rating";

    // Build query object
    // Why use an object? MongoDB expects filter criteria in object format
    const query: Record<string, unknown> = {
      price: { $gte: minPrice, $lte: maxPrice },
      duration: { $gte: minDuration, $lte: maxDuration },
    };

    // Add difficulty filter if specified
    if (difficulty !== "all") {
      query.difficulty = difficulty;
    }

    // Add text search if provided
    // $or operator searches in multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // 'i' = case insensitive
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sort order
    let sort: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case "price-asc":
        sort = { price: 1 }; // 1 = ascending
        break;
      case "price-desc":
        sort = { price: -1 }; // -1 = descending
        break;
      case "rating":
        sort = { rating: -1 }; // highest rated first
        break;
      case "name":
        sort = { name: 1 }; // alphabetical
        break;
      default:
        sort = { rating: -1 };
    }

    // Execute query with sorting
    const tours = await Tour.find(query).sort(sort).lean();

    // lean() returns plain JavaScript objects instead of Mongoose documents
    // This improves performance and reduces response size

    return NextResponse.json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
