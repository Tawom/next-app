"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * WishlistButton Component
 *
 * Heart icon button to add/remove tours from wishlist
 *
 * Features:
 * - Toggle wishlist status
 * - Visual feedback (filled/empty heart)
 * - Requires authentication
 * - Optimistic UI updates
 */

interface WishlistButtonProps {
  tourId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function WishlistButton({
  tourId,
  size = "md",
  className = "",
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: "text-xl p-2",
    md: "text-2xl p-3",
    lg: "text-3xl p-4",
  };

  // Check if tour is in wishlist on mount
  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, tourId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const wishlist = await response.json();
        const inWishlist = wishlist.some(
          (item: { tour: { _id: string } | null }) =>
            item.tour && item.tour._id === tourId
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleToggle = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?tourId=${tourId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tourId }),
        });

        if (response.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 ${className}`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <span className="text-red-500">❤️</span>
      ) : (
        <span className="text-gray-400 hover:text-red-500 transition-colors">
          🤍
        </span>
      )}
    </button>
  );
}
