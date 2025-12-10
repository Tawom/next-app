import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tour from "@/models/Tour";
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

    // Get total counts
    const totalTours = await Tour.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get recent bookings with tour details
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("tour", "name")
      .lean();

    // Get user names for bookings
    const userEmails = [...new Set(recentBookings.map((b) => b.user))];
    const users = await User.find({ email: { $in: userEmails } }).select(
      "email name"
    );
    const userMap = new Map(users.map((u) => [u.email, u.name]));

    const formattedBookings = recentBookings.map((booking) => ({
      _id: booking._id.toString(),
      tourName:
        (booking.tour as unknown as { name: string })?.name || "Unknown Tour",
      userName: userMap.get(booking.user) || "Unknown User",
      userEmail: booking.user,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({
      totalTours,
      totalBookings,
      totalUsers,
      totalRevenue,
      recentBookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
