"use client";

import { useState, useEffect } from "react";
import TourForm from "./TourForm";

interface Tour {
  _id: string;
  name: string;
  price: number;
  duration: number;
  difficulty: string;
  rating: number;
  numReviews: number;
  location: string;
  maxGroupSize: number;
}

export default function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/admin/tours");
      if (response.ok) {
        const data = await response.json();
        setTours(data.tours || []);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTours(tours.filter((tour) => tour._id !== tourId));
        alert("Tour deleted successfully!");
      } else {
        alert("Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("Error deleting tour");
    }
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTour(null);
    fetchTours();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tours...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tour Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Tour
        </button>
      </div>

      {showForm && <TourForm tour={editingTour} onClose={handleFormClose} />}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tour.name}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {tour.difficulty}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tour.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${tour.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tour.duration} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ⭐ {tour.rating.toFixed(1)} ({tour.numReviews})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(tour)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tours found. Click &quot;Add New Tour&quot; to create one.
        </div>
      )}
    </div>
  );
}
