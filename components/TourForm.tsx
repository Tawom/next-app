"use client";

import { useState, useEffect } from "react";

interface TourFormProps {
  tour?: any;
  onClose: () => void;
}

export default function TourForm({ tour, onClose }: TourFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "moderate",
    imageUrl: "",
    images: [""],
    location: "",
    highlights: [""],
    startDates: [""],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || "",
        description: tour.description || "",
        price: tour.price?.toString() || "",
        duration: tour.duration?.toString() || "",
        maxGroupSize: tour.maxGroupSize?.toString() || "",
        difficulty: tour.difficulty || "moderate",
        imageUrl: tour.imageUrl || "",
        images: tour.images && tour.images.length > 0 ? tour.images : [""],
        location: tour.location || "",
        highlights: tour.highlights || [""],
        startDates: tour.startDates?.map(
          (d: any) => new Date(d).toISOString().split("T")[0]
        ) || [""],
      });
    }
  }, [tour]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: "highlights" | "startDates" | "images"
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: "highlights" | "startDates" | "images") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (
    index: number,
    field: "highlights" | "startDates" | "images"
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = tour ? `/api/admin/tours/${tour._id}` : "/api/admin/tours";
      const method = tour ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          maxGroupSize: parseInt(formData.maxGroupSize),
          highlights: formData.highlights.filter((h) => h.trim() !== ""),
          startDates: formData.startDates.filter((d) => d.trim() !== ""),
          images: formData.images.filter((img) => img.trim() !== ""),
        }),
      });

      if (response.ok) {
        alert(
          tour ? "Tour updated successfully!" : "Tour created successfully!"
        );
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save tour");
      }
    } catch (error) {
      console.error("Error saving tour:", error);
      alert("Error saving tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">
            {tour ? "Edit Tour" : "Add New Tour"}
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tour Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Group Size *
              </label>
              <input
                type="number"
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Main tour image (will be shown in tour list)
              </p>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Images (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Additional images for the tour gallery. First image is the main
              image above.
            </p>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "images")
                  }
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, "images")}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("images")}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add Gallery Image
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Highlights
            </label>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "highlights")
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter highlight"
                />
                {formData.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, "highlights")}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("highlights")}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add Highlight
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Start Dates *
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-800 font-medium mb-1">
                📅 Set Tour Departure Dates
              </p>
              <p className="text-xs text-blue-700">
                Add the dates when this tour will depart. These dates will
                appear in the availability calendar for customers to book. You
                can add multiple dates for different departure times.
              </p>
            </div>
            {formData.startDates.map((date, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "startDates")
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                  aria-label={`Departure date ${index + 1}`}
                />
                {formData.startDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, "startDates")}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("startDates")}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
            >
              + Add Another Departure Date
            </button>
          </div>
        </form>

        <div className="p-6 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : tour ? "Update Tour" : "Create Tour"}
          </button>
        </div>
      </div>
    </div>
  );
}
