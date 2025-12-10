"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import Card from "./Card";

/**
 * ReviewList Component
 *
 * Displays list of reviews for a tour
 *
 * Features:
 * - Paginated reviews
 * - User avatars
 * - Verified purchase badge
 * - Helpful votes
 * - Load more functionality
 */

interface Review {
  _id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulVotes: number;
  createdAt: string;
}

interface ReviewListProps {
  tourId: string;
  refreshTrigger?: number;
}

export default function ReviewList({
  tourId,
  refreshTrigger = 0,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchReviews = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reviews?tourId=${tourId}&page=${pageNum}&limit=5`
      );
      const data = await response.json();

      if (response.ok) {
        setReviews(append ? [...reviews, ...data.reviews] : data.reviews);
        setHasMore(data.pagination.hasMore);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, refreshTrigger]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
          <p className="text-gray-400 text-sm">
            Be the first to share your experience!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Reviews ({total})</h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={
                      review.userAvatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`
                    }
                    alt={review.userName}
                    fill
                    sizes="48px"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <StarRating rating={review.rating} size="sm" />

              {/* Review Content */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Helpful Votes */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  👍 Helpful ({review.helpfulVotes})
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  );
}
