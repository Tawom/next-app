"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import Button from "./Button";

/**
 * ReviewSection Component
 *
 * Main component that combines review form and review list
 *
 * Features:
 * - Shows review form for authenticated users
 * - Displays all reviews with pagination
 * - Handles authentication state
 * - Refreshes reviews after submission
 */

interface ReviewSectionProps {
  tourId: string;
}

export default function ReviewSection({ tourId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleWriteReview = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setShowForm(!showForm);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h2>
        <Button onClick={handleWriteReview}>
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form (Collapsible) */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Share Your Experience
          </h3>
          <ReviewForm
            tourId={tourId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      {/* Reviews List */}
      <ReviewList tourId={tourId} refreshTrigger={refreshTrigger} />
    </div>
  );
}
