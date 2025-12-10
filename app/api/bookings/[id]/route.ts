import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Tour from "@/models/Tour"; // Required for .populate("tour")
import User from "@/models/User";
import { sendBookingConfirmation, sendBookingCancellation } from "@/lib/email";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const booking = await Booking.findById(id).populate("tour");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking belongs to user
    if (booking.user !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking belongs to user
    if (booking.user !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Users can only update pending bookings
    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending bookings can be updated" },
        { status: 400 }
      );
    }

    // Users can confirm or cancel their pending bookings
    if (status !== "confirmed" && status !== "cancelled") {
      return NextResponse.json(
        { error: "You can only confirm or cancel your bookings" },
        { status: 400 }
      );
    }

    // Update booking status
    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Populate tour details for email
    await booking.populate("tour");

    // Get user details
    const user = await User.findOne({ email: booking.user });

    // Send email notification based on status change
    if (user && booking.tour) {
      const emailData = {
        userName: user.name,
        userEmail: user.email,
        tourName: (booking.tour as unknown as { name: string }).name,
        tourLocation: (booking.tour as unknown as { location: string })
          .location,
        startDate: booking.startDate.toISOString(),
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        bookingId: booking._id.toString(),
      };

      if (status === "confirmed" && previousStatus === "pending") {
        // Send confirmation email
        sendBookingConfirmation(emailData).catch((error) => {
          console.error("Failed to send confirmation email:", error);
        });
      } else if (status === "cancelled") {
        // Send cancellation email
        sendBookingCancellation(emailData).catch((error) => {
          console.error("Failed to send cancellation email:", error);
        });
      }
    }

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking updated successfully. Email notification sent!",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
