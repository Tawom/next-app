import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET /api/user/check-admin
 *
 * Debug endpoint to check if current user is admin
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        isAdmin: false,
        message: "Not authenticated",
        session: null,
      });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select(
      "email name role"
    );

    return NextResponse.json({
      isAdmin: user?.role === "admin",
      session: {
        email: session.user.email,
        name: session.user.name,
      },
      user: user
        ? {
            email: user.email,
            name: user.name,
            role: user.role,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
