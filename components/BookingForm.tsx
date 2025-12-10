"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import Button from "./Button";

/**
 * BookingForm Component
 *
 * Handles tour booking with date and guest selection.
 *
 * Features:
 * - Date selection from available dates
 * - Guest count selector (1 to max group size)
 * - Real-time price calculation
 * - Form validation
 * - Authentication check
 * - API submission
 *
 * Why client component?
 * - Interactive form with state
 * - User authentication check
 * - API calls on submit
 */

interface BookingFormProps {
  tourId: string;
  basePrice: number;
  maxGroupSize: number;
  availableDates: Date[];
}

export default function BookingForm({
  tourId,
  basePrice,
  maxGroupSize,
  availableDates,
}: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate total price
  const totalPrice = basePrice * guestCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!session) {
      setError("Please sign in to book a tour");
      router.push("/auth/signin");
      return;
    }

    if (!selectedDate) {
      setError("Please select a departure date");
      return;
    }

    if (guestCount < 1 || guestCount > maxGroupSize) {
      setError(`Guest count must be between 1 and ${maxGroupSize}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          startDate: selectedDate.toISOString(),
          numberOfPeople: guestCount,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to confirmation page
        router.push(`/bookings/${data.data._id}`);
      } else {
        setError(data.error || "Failed to create booking");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Availability Calendar */}
      <AvailabilityCalendar
        tourId={tourId}
        startDates={availableDates.map((d) => d.toISOString())}
        maxGroupSize={maxGroupSize}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Count */}
        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Number of Guests
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold text-gray-900"
              disabled={guestCount <= 1}
            >
              −
            </button>
            <input
              id="guests"
              type="number"
              min="1"
              max={maxGroupSize}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-20 px-4 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-bold text-lg"
            />
            <button
              type="button"
              onClick={() =>
                setGuestCount(Math.min(maxGroupSize, guestCount + 1))
              }
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-semibold text-gray-900"
              disabled={guestCount >= maxGroupSize}
            >
              +
            </button>
            <span className="text-sm text-gray-700">
              (Max {maxGroupSize} guests)
            </span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-800">
            <span>Price per person:</span>
            <span className="font-semibold">${basePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-800">
            <span>Number of guests:</span>
            <span className="font-semibold">× {guestCount}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
            <span>Total:</span>
            <span className="text-blue-600">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !selectedDate}
          className="w-full py-4 text-lg"
        >
          {loading
            ? "Processing..."
            : `Book Now - $${totalPrice.toLocaleString()}`}
        </Button>

        {/* Info */}
        {!session && (
          <p className="text-sm text-gray-700 text-center">
            You need to{" "}
            <a
              href="/auth/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              sign in
            </a>{" "}
            to book this tour
          </p>
        )}
      </form>
    </div>
  );
}
