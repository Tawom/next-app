import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Tour from "@/models/Tour";
import User from "@/models/User";
import { sendBookingConfirmation } from "@/lib/email";

/**
 * POST /api/bookings - Create a new booking
 *
 * Why this endpoint?
 * - Handles booking creation securely on server
 * - Validates user is authenticated
 * - Checks tour availability
 * - Prevents overbooking (checks max group size)
 *
 * Request Body:
 * - tourId: Tour to book
 * - startDate: Departure date
 * - guests: Number of guests
 * - totalPrice: Calculated total
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { tourId, startDate, numberOfPeople, totalPrice } = body;

    // Validation
    if (!tourId || !startDate || !numberOfPeople || !totalPrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    // Check guest count doesn't exceed max
    if (numberOfPeople > tour.maxGroupSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${tour.maxGroupSize} guests allowed`,
        },
        { status: 400 }
      );
    }

    // Verify price calculation is correct
    const expectedPrice = tour.price * numberOfPeople;
    if (Math.abs(totalPrice - expectedPrice) > 0.01) {
      return NextResponse.json(
        {
          success: false,
          error: "Price mismatch. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      tour: tourId,
      user: session.user.email, // Using email as user identifier
      startDate: new Date(startDate),
      numberOfPeople,
      totalPrice,
      status: "pending", // Initial status
      createdAt: new Date(),
    });

    // Get user details for email
    const user = await User.findOne({ email: session.user.email });

    // Send confirmation email (non-blocking)
    if (user) {
      sendBookingConfirmation({
        userName: user.name,
        userEmail: user.email,
        tourName: tour.name,
        tourLocation: tour.location,
        startDate: startDate,
        numberOfPeople,
        totalPrice,
        bookingId: booking._id.toString(),
      }).catch((error) => {
        // Log error but don't fail the booking
        console.error("Failed to send confirmation email:", error);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully. Confirmation email sent!",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings - Get user's bookings
 *
 * Returns all bookings for the authenticated user.
 * Useful for "My Bookings" page.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find all bookings for this user, populate tour details
    const bookings = await Booking.find({ user: session.user.email })
      .populate("tour")
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    // Filter out bookings where tour was deleted (tour is null)
    const validBookings = bookings.filter(
      (booking: any) => booking.tour !== null
    );

    return NextResponse.json({
      success: true,
      count: validBookings.length,
      data: validBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
