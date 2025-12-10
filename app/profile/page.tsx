import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileContent from "@/components/ProfileContent";

/**
 * User Profile Page
 *
 * Protected page showing user information and settings
 *
 * Features:
 * - View/edit profile information
 * - Update profile picture
 * - Change password
 * - Account settings
 */

export const metadata = {
  title: "My Profile - TravelHub",
  description: "Manage your TravelHub profile and settings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <ProfileContent user={session.user} />
      </div>
    </main>
  );
}
