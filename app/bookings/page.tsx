"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import Button from "@/components/Button";

/**
 * My Bookings Page
 *
 * Shows all bookings for the authenticated user.
 *
 * Features:
 * - Lists all user bookings
 * - Shows booking status
 * - Links to tour details
 * - Protected route (requires authentication)
 */

interface Booking {
  _id: string;
  tour: {
    _id: string;
    name: string;
    location: string;
    imageUrl: string;
    duration: number;
  };
  startDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function MyBookingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your upcoming and past tour bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your adventure by booking a tour!
              </p>
              <Link href="/">
                <Button variant="primary">Browse Tours</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings
              .filter((booking) => booking.tour)
              .map((booking) => (
                <Card key={booking._id}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Tour Image */}
                    <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                      <Image
                        src={booking.tour.imageUrl}
                        alt={booking.tour.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.tour.name}
                          </h3>
                          <p className="text-gray-600">
                            📍 {booking.tour.location}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Departure Date
                          </p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">
                            {booking.tour.duration} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p className="font-semibold text-gray-900">
                            {booking.numberOfPeople}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="font-semibold text-blue-600">
                            ${booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link href={`/bookings/${booking._id}`}>
                          <Button variant="primary">View Details</Button>
                        </Link>
                        <Link href={`/tours/${booking.tour._id}`}>
                          <Button variant="outline">View Tour</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
