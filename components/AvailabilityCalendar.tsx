"use client";

import { useState, useEffect } from "react";

/**
 * Availability Calendar Component
 *
 * Interactive calendar showing tour availability based on:
 * - Tour start dates (available dates)
 * - Existing bookings (may reduce capacity)
 * - Max group size
 *
 * Features:
 * - Visual calendar with available/unavailable dates
 * - Hover tooltips showing availability info
 * - Date selection for booking
 * - Month navigation
 */

interface AvailabilityCalendarProps {
  tourId: string;
  startDates: string[];
  maxGroupSize: number;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

interface DateAvailability {
  date: Date;
  available: boolean;
  spotsLeft: number;
  totalSpots: number;
}

export default function AvailabilityCalendar({
  tourId,
  startDates,
  maxGroupSize,
  onDateSelect,
  selectedDate,
}: AvailabilityCalendarProps) {
  // Initialize to the first available month with dates
  const getInitialMonth = () => {
    if (startDates.length === 0) return new Date();

    // Find the earliest future date or the first available date
    const now = new Date();
    const futureDates = startDates
      .map((d) => new Date(d))
      .filter((d) => d >= now)
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureDates.length > 0) {
      return futureDates[0]; // Use the earliest future date
    }

    // If no future dates, use the latest past date
    const allDates = startDates
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());
    return allDates[0] || new Date();
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/tours/${tourId}/availability?month=${currentMonth.toISOString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability || []);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, currentMonth]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getDateAvailability = (day: number): DateAvailability | null => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      0,
      0,
      0,
      0
    );

    return (
      availability.find((a) => {
        const availDate = new Date(a.date);
        availDate.setHours(0, 0, 0, 0);
        return availDate.getTime() === date.getTime();
      }) || null
    );
  };

  const isDateAvailable = (day: number): boolean => {
    const dateAvail = getDateAvailability(day);
    return dateAvail ? dateAvail.available && dateAvail.spotsLeft > 0 : false;
  };

  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      0,
      0,
      0,
      0
    );
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return date.getTime() === selected.getTime();
  };

  const handleDateClick = (day: number) => {
    if (!isDateAvailable(day)) return;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12, // Set to noon to avoid timezone issues
      0,
      0,
      0
    );
    onDateSelect?.(date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Check Availability
        </h3>
        <p className="text-sm text-gray-600">
          Select a date to see available spots
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 className="text-lg font-semibold text-gray-900">{monthName}</h4>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const available = isDateAvailable(day);
          const selected = isDateSelected(day);
          const dateAvail = getDateAvailability(day);
          const isPast =
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) <
            new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={day}
              className="aspect-square relative group"
              title={
                dateAvail
                  ? `${dateAvail.spotsLeft}/${dateAvail.totalSpots} spots available`
                  : "Not available"
              }
            >
              <button
                onClick={() => handleDateClick(day)}
                disabled={!available || isPast}
                className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                  selected
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : available
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : isPast
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {day}
              </button>

              {/* Tooltip on hover */}
              {dateAvail && !isPast && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    {dateAvail.available
                      ? `${dateAvail.spotsLeft} of ${dateAvail.totalSpots} spots available`
                      : "Fully booked"}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="text-gray-500">Loading availability...</div>
        </div>
      )}
    </div>
  );
}
