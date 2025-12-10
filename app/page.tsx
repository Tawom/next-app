"use client";

import { useState, useEffect } from "react";
import TourCard from "@/components/TourCard";
import TourCardSkeleton from "@/components/TourCardSkeleton";
import TourFilters, { FilterOptions } from "@/components/TourFilters";
import { Tour } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Home Page - Tour Listings with Search & Filter
 *
 * Why 'use client'?
 * - Interactive filtering requires state management
 * - Real-time search and filter updates
 * - Fetches data from API route based on user input
 *
 * Component Architecture:
 * - TourFilters: Sidebar with all filter controls
 * - TourCard Grid: Displays filtered results
 * - API Integration: Fetches tours from /api/tours with query params
 * - Debounced Search: Waits 500ms after typing before searching
 */

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    difficulty: "all",
    minPrice: 0,
    maxPrice: 10000,
    minDuration: 0,
    maxDuration: 30,
    sortBy: "rating",
  });

  // Debounce search to reduce API calls while typing
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch tours whenever filters change
  // Why useEffect? Automatically refetch when user changes filters
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        // Build query string from filters
        const params = new URLSearchParams({
          search: debouncedSearch, // Use debounced search
          difficulty: filters.difficulty,
          minPrice: filters.minPrice.toString(),
          maxPrice: filters.maxPrice.toString(),
          minDuration: filters.minDuration.toString(),
          maxDuration: filters.maxDuration.toString(),
          sortBy: filters.sortBy,
        });

        const response = await fetch(`/api/tours?${params}`);
        const data = await response.json();

        if (data.success) {
          setTours(data.data);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [
    debouncedSearch,
    filters.difficulty,
    filters.minPrice,
    filters.maxPrice,
    filters.minDuration,
    filters.maxDuration,
    filters.sortBy,
  ]); // Re-run when filters change

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Unforgettable tours and experiences around the world
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <TourFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Tours Grid */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? "Loading..." : `${tours.length} Tours Available`}
              </h2>
              <p className="text-gray-600">
                Explore amazing destinations worldwide
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-600 text-lg">
                  No tours match your filters. Try adjusting your search
                  criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour, index) => (
                  <TourCard
                    key={
                      "_id" in tour
                        ? String((tour as { _id: unknown })._id)
                        : tour.id
                    }
                    tour={tour}
                    priority={index < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Book With TravelHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4 text-green-600">✓</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Best Price Guarantee
              </h3>
              <p className="text-gray-700">
                Find a lower price and we&apos;ll match it plus give you 10% off
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Expert Guides
              </h3>
              <p className="text-gray-700">
                Local guides with years of experience and insider knowledge
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                24/7 Support
              </h3>
              <p className="text-gray-700">
                Round-the-clock customer support for peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
