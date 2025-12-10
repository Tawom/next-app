import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";
import Booking from "@/models/Booking";

/**
 * GET /api/tours/[id]/availability
 *
 * Get tour availability for a specific month
 *
 * Calculates available spots for each tour start date by:
 * 1. Getting all tour start dates in the month
 * 2. Counting confirmed bookings for each date
 * 3. Calculating remaining spots (maxGroupSize - booked people)
 *
 * Query params:
 * - month: ISO date string for any day in the month to check
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");

    if (!monthParam) {
      return NextResponse.json(
        { error: "Month parameter required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get tour
    const tour = await Tour.findById(id);
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Parse requested month
    const requestedMonth = new Date(monthParam);
    const reqYear = requestedMonth.getFullYear();
    const reqMonth = requestedMonth.getMonth();

    // Get all start dates in this month - compare year and month components
    const startDatesInMonth = tour.startDates.filter((date: Date) => {
      const startDate = new Date(date);
      // Get local date components to avoid timezone issues
      const year = startDate.getFullYear();
      const month = startDate.getMonth();

      // Check if the date is in the requested month
      return year === reqYear && month === reqMonth;
    });

    // Calculate availability for each date
    const availability = await Promise.all(
      startDatesInMonth.map(async (startDate: Date) => {
        // Normalize the date for comparison (remove time component)
        const normalizedDate = new Date(startDate);
        normalizedDate.setHours(0, 0, 0, 0);

        // Count people already booked for this exact date
        const bookings = await Booking.find({
          tour: id,
          status: { $in: ["pending", "confirmed"] },
        });

        // Filter bookings that match this specific date
        const matchingBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.startDate);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === normalizedDate.getTime();
        });

        const bookedPeople = matchingBookings.reduce(
          (sum, booking) => sum + booking.numberOfPeople,
          0
        );

        const spotsLeft = tour.maxGroupSize - bookedPeople;

        return {
          date: normalizedDate.toISOString(),
          available: spotsLeft > 0,
          spotsLeft: Math.max(0, spotsLeft),
          totalSpots: tour.maxGroupSize,
        };
      })
    );

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
