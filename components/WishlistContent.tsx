"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TourCard from "./TourCard";
import { Tour } from "@/types";

/**
 * WishlistContent Component
 *
 * Displays user's wishlist with tour cards
 *
 * Features:
 * - Grid layout of favorite tours
 * - Remove from wishlist functionality
 * - Empty state
 * - Loading state
 */

interface WishlistItem {
  _id: string;
  tour: Tour;
  createdAt: string;
}

export default function WishlistContent() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Start adding tours you love to your wishlist!
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Explore Tours
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-gray-600">
        {wishlist.length} {wishlist.length === 1 ? "tour" : "tours"} saved
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <TourCard key={item._id} tour={item.tour} />
        ))}
      </div>
    </div>
  );
}
