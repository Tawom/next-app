"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./Card";

/**
 * BookingHistory Component
 *
 * Displays user's booking history with status
 *
 * Features:
 * - List all bookings
 * - Filter by status
 * - View booking details
 * - Quick actions
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
  status: string;
  createdAt: string;
}

interface BookingHistoryProps {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BookingHistory({ userId }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const result = await response.json();
      if (response.ok) {
        // API returns { success, count, data } structure
        const data = result.data || result;
        // Ensure data is an array
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        // Update local state
        setBookings(
          bookings.map((b) =>
            b._id === bookingId ? { ...b, status: "cancelled" } : b
          )
        );
        alert("Booking cancelled successfully");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (
      !confirm(
        "Confirm this booking? You won't be able to cancel it after confirmation."
      )
    ) {
      return;
    }

    setConfirmingId(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (response.ok) {
        // Update local state
        setBookings(
          bookings.map((b) =>
            b._id === bookingId ? { ...b, status: "confirmed" } : b
          )
        );
        alert("Booking confirmed successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to confirm booking");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Error confirming booking");
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredBookings = Array.isArray(bookings)
    ? filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter)
    : [];

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse flex gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {["all", "confirmed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No bookings found</p>
            <p className="text-gray-400 text-sm mb-6">
              Start exploring our amazing tours!
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking._id}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Tour Image */}
                <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={booking.tour.imageUrl}
                    alt={booking.tour.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover"
                  />
                </div>

                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.tour.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        📍 {booking.tour.location}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {booking.tour.duration} days
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Guests</p>
                      <p className="font-semibold text-gray-900">
                        {booking.numberOfPeople}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Price</p>
                      <p className="font-semibold text-blue-600">
                        ${booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/bookings/${booking._id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View Details →
                    </Link>
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          disabled={confirmingId === booking._id}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {confirmingId === booking._id
                            ? "Confirming..."
                            : "Confirm Booking"}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="text-sm text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
