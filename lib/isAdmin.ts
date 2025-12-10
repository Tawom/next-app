import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "./mongodb";
import User from "@/models/User";

/**
 * Check if the current user is an admin
 * Used in server components and API routes
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return false;
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  return user?.role === "admin";
}

/**
 * Get current user with role
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  await dbConnect();
  const user = await User.findOne({
    email: session.user.email,
  }).select("-password");

  return user;
}
