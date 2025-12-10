import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WishlistContent from "@/components/WishlistContent";

/**
 * Wishlist Page
 *
 * Shows user's saved favorite tours
 *
 * Features:
 * - Protected page (requires authentication)
 * - Grid display of favorite tours
 * - Quick remove functionality
 * - Empty state with CTA
 */

export const metadata = {
  title: "My Wishlist - TravelHub",
  description: "View your saved favorite tours",
};

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            Save your favorite tours and book them later
          </p>
        </div>

        <WishlistContent />
      </div>
    </main>
  );
}
