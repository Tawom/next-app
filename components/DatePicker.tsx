"use client";

/**
 * DatePicker Component
 *
 * A simple date picker for selecting tour start dates.
 *
 * Features:
 * - Only allows future dates (can't book in the past)
 * - Shows available dates for the tour
 * - Highlights selected date
 * - Responsive design
 *
 * Why not use a library?
 * - Keeps bundle size small
 * - Full control over styling and behavior
 * - HTML5 date input has good browser support
 */

interface DatePickerProps {
  availableDates: Date[];
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  label?: string;
}

export default function DatePicker({
  availableDates,
  selectedDate,
  onDateChange,
  label = "Select Start Date",
}: DatePickerProps) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      onDateChange(new Date(dateValue));
    }
  };

  // Get min date (today)
  const today = new Date();
  const minDate = formatDateForInput(today);

  return (
    <div className="space-y-3">
      <label
        htmlFor="date-picker"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {/* Date Input */}
      <input
        id="date-picker"
        type="date"
        min={minDate}
        value={selectedDate ? formatDateForInput(selectedDate) : ""}
        onChange={handleDateChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      />

      {/* Available Dates */}
      {availableDates.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Available Departure Dates:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((date, index) => {
              const isSelected =
                selectedDate &&
                formatDateForInput(date) === formatDateForInput(selectedDate);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onDateChange(date)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
