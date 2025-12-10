import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { isAdmin } from "@/lib/isAdmin";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("tour", "name")
      .lean();

    // Get user names
    const userEmails = [...new Set(bookings.map((b) => b.user))];
    const users = await User.find({ email: { $in: userEmails } }).select(
      "email name"
    );
    const userMap = new Map(users.map((u) => [u.email, u.name]));

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id.toString(),
      tourName:
        (booking.tour as unknown as { name: string })?.name || "Unknown Tour",
      userName: userMap.get(booking.user) || "Unknown User",
      userEmail: booking.user,
      startDate: booking.startDate,
      numberOfPeople: booking.numberOfPeople,
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
