/**
 * TourCardSkeleton Component
 *
 * Loading placeholder for TourCard while data is fetching.
 *
 * Why use skeletons?
 * - Better UX than blank screen or spinners
 * - Shows structure of content before it loads
 * - Reduces perceived loading time
 * - Matches actual component layout
 */

export default function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-1/3" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Stats */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}
