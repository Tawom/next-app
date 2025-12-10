import Image from "next/image";
import Link from "next/link";
import { Tour } from "@/types";
import Card from "./Card";
import Button from "./Button";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";

/**
 * TourCard Component
 *
 * Displays a single tour's key information in a visually appealing card format.
 * Used on the homepage and search results to showcase available tours.
 *
 * Features:
 * - Tour image with Next.js Image optimization (faster loading, automatic sizing)
 * - Key details: price, duration, rating, difficulty
 * - Quick action button to view details
 *
 * Why use Next.js Image component?
 * - Automatic image optimization (smaller file sizes)
 * - Lazy loading (images load only when visible)
 * - Prevents layout shift
 * - Responsive images
 *
 * @param tour - The tour object containing all tour information
 */

interface TourCardProps {
  tour: Tour;
  priority?: boolean;
}

export default function TourCard({ tour, priority = false }: TourCardProps) {
  // Handle both MongoDB _id and regular id
  const tourId =
    "_id" in tour ? String((tour as { _id: unknown })._id) : tour.id;

  return (
    <Card>
      {/* Tour Image */}
      <div className="relative h-48 w-full">
        <Image
          src={tour.imageUrl}
          alt={tour.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
        {/* Wishlist Button */}
        <div className="absolute top-4 left-4">
          <WishlistButton tourId={tourId} size="sm" />
        </div>
        {/* Difficulty Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold capitalize shadow-md ${
            tour.difficulty === "easy"
              ? "bg-green-500 text-white"
              : tour.difficulty === "moderate"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {tour.difficulty}
        </div>
      </div>

      {/* Tour Information */}
      <div className="p-6">
        {/* Location */}
        <p className="text-sm text-gray-500 mb-2">📍 {tour.location}</p>

        {/* Tour Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {tour.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tour.description}
        </p>

        {/* Tour Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>⏱️ {tour.duration} days</span>
            <span>👥 Max {tour.maxGroupSize}</span>
          </div>
          <div className="flex items-center">
            <StarRating rating={tour.rating} size="sm" />
            <span className="ml-1 text-gray-600">({tour.numReviews})</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-2xl font-bold text-blue-600">${tour.price}</p>
          </div>
          <Link href={`/tours/${tourId}`}>
            <Button variant="primary">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
