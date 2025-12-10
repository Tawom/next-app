import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Tour from "@/models/Tour";
import Button from "@/components/Button";

/**
 * Booking Confirmation Page
 *
 * Displays booking details after successful creation.
 *
 * Why a separate page?
 * - Provides confirmation to user
 * - Can be shared/bookmarked
 * - Shows all booking details
 * - Includes next steps
 */

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingConfirmationPage({ params }: PageProps) {
  const { id } = await params;

  await connectDB();

  // Ensure Tour model is registered
  Tour;

  const booking = await Booking.findById(id).populate("tour").lean();

  if (!booking) {
    notFound();
  }

  // Tour is populated from the booking
  const tour = booking.tour as unknown as {
    _id: unknown;
    name: string;
    location: string;
    duration: number;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Your tour has been successfully booked. A confirmation email has
              been sent to your inbox.
            </p>
          </div>

          {/* Booking Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Booking Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold text-gray-900">
                  {booking._id.toString().slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tour:</span>
                <span className="font-semibold text-gray-900">{tour.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-900">
                  📍 {tour.location}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Departure Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(booking.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">
                  {tour.duration} days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Number of Guests:</span>
                <span className="font-semibold text-gray-900">
                  {booking.numberOfPeople}{" "}
                  {booking.numberOfPeople === 1 ? "guest" : "guests"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 capitalize">
                  {booking.status}
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${booking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              What&apos;s Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ You&apos;ll receive a confirmation email shortly</li>
              <li>✓ Payment instructions will be sent within 24 hours</li>
              <li>✓ Our team will contact you 48 hours before departure</li>
              <li>✓ Free cancellation up to 24 hours before start date</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/bookings" className="flex-1">
              <Button variant="primary" className="w-full">
                View All Bookings
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse More Tours
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Questions? Contact us at{" "}
            <a
              href="mailto:support@travelhub.com"
              className="text-blue-600 hover:underline"
            >
              support@travelhub.com
            </a>{" "}
            or call <span className="font-semibold">1-800-TRAVEL</span>
          </p>
        </div>
      </div>
    </main>
  );
}
