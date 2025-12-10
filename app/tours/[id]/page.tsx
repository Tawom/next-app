import { notFound } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";
import BookingForm from "@/components/BookingForm";
import ReviewSection from "@/components/ReviewSection";
import WishlistButton from "@/components/WishlistButton";
import ImageGallery from "@/components/ImageGallery";

/**
 * Tour Detail Page - Dynamic Route with Database Integration
 *
 * This page displays detailed information about a specific tour from MongoDB.
 *
 * How Dynamic Routing Works:
 * - File location: app/tours/[id]/page.tsx
 * - The [id] folder creates a dynamic route segment
 * - URL /tours/1 → params.id = "1"
 * - URL /tours/machu-picchu → params.id = "machu-picchu"
 *
 * Why Server Component?
 * - Direct database access (no API route needed)
 * - Better SEO (fully rendered HTML)
 * - Automatic static generation for better performance
 *
 * @param params - Contains the dynamic route parameter (id)
 */

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  // Await the params (Next.js 15+ async params)
  const { id } = await params;

  // Fetch tour from database
  await connectDB();
  const tour = await Tour.findById(id).lean();

  // If tour doesn't exist, show 404 page
  if (!tour) {
    notFound();
  }

  // Fallback image if imageUrl is null or empty
  const imageUrl =
    tour.imageUrl ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Gallery or Single Image */}
      <div className="relative w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wishlist Button - Positioned over gallery */}
          <div className="absolute top-12 right-12 z-10">
            <WishlistButton tourId={tour._id.toString()} size="lg" />
          </div>

          {/* Image Gallery or Single Image */}
          {tour.images && tour.images.length > 0 ? (
            <ImageGallery
              images={[imageUrl, ...tour.images]}
              tourName={tour.name}
            />
          ) : (
            <div className="relative h-96 w-full rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={tour.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          {/* Tour Title & Info Below Gallery */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                  tour.difficulty === "easy"
                    ? "bg-green-500 text-white"
                    : tour.difficulty === "moderate"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {tour.difficulty}
              </span>
              <span className="flex items-center text-gray-700">
                <span className="text-yellow-400">⭐</span>
                <span className="ml-1 font-semibold">{tour.rating}</span>
                <span className="ml-1">({tour.numReviews} reviews)</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {tour.name}
            </h1>
            <p className="text-xl text-gray-600">📍 {tour.location}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                Quick Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">⏱️</span>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-600">
                      {tour.duration} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">👥</span>
                  <div>
                    <p className="text-sm text-gray-500">Max Group Size</p>
                    <p className="font-semibold text-gray-600">
                      {tour.maxGroupSize} people
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold capitalize text-gray-600">
                      {tour.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Tour
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tour Highlights
              </h2>
              <ul className="space-y-3">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1 text-xl">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Dates */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Available Dates
              </h2>
              <div className="flex flex-wrap gap-3">
                {tour.startDates.map((date, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-700 font-medium"
                  >
                    📅{" "}
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Price per person</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${tour.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{tour.duration} days</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Max Group Size</span>
                  <span className="font-semibold">
                    {tour.maxGroupSize} people
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">⭐ {tour.rating}/5</span>
                </div>
              </div>

              {/* Booking Form */}
              <BookingForm
                tourId={tour._id.toString()}
                basePrice={tour.price}
                maxGroupSize={tour.maxGroupSize}
                availableDates={tour.startDates.map((date) => new Date(date))}
              />

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  ✓ Free cancellation up to 24 hours before
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ✓ Reserve now, pay later
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewSection tourId={tour._id.toString()} />
        </div>
      </div>
    </main>
  );
}

/**
 * Generate Static Params (Optional but Recommended)
 *
 * This function tells Next.js which tour IDs exist at build time.
 * Benefits:
 * - Pre-renders all tour pages (faster loading)
 * - Better SEO (pages exist without JavaScript)
 * - Reduces server load
 *
 * Fetches all tour IDs from database to pre-render pages
 */
export async function generateStaticParams() {
  await connectDB();
  const tours = await Tour.find({}).select("_id").lean();

  return tours.map((tour) => ({
    id: tour._id.toString(),
  }));
}

/**
 * Generate Metadata for SEO
 *
 * Dynamic metadata for each tour page.
 * Improves SEO by setting unique titles and descriptions.
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  await connectDB();
  const tour = await Tour.findById(id).lean();

  if (!tour) {
    return {
      title: "Tour Not Found",
    };
  }

  return {
    title: `${tour.name} - TravelHub`,
    description: tour.description,
  };
}
