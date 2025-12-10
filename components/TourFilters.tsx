"use client";

import { useState } from "react";

/**
 * TourFilters Component
 *
 * Provides filtering and sorting options for tours
 *
 * Features:
 * - Search by name/location
 * - Filter by difficulty (easy, moderate, difficult)
 * - Filter by price range
 * - Filter by duration
 * - Sort by price, rating, or name
 *
 * Why 'use client'?
 * - Interactive form elements
 * - State management for filters
 * - Real-time updates
 */

export interface FilterOptions {
  search: string;
  difficulty: string;
  minPrice: number;
  maxPrice: number;
  minDuration: number;
  maxDuration: number;
  sortBy: "price-asc" | "price-desc" | "rating" | "name";
}

interface TourFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function TourFilters({ onFilterChange }: TourFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    difficulty: "all",
    minPrice: 0,
    maxPrice: 10000,
    minDuration: 0,
    maxDuration: 30,
    sortBy: "rating",
  });

  const handleChange = (field: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      search: "",
      difficulty: "all",
      minPrice: 0,
      maxPrice: 10000,
      minDuration: 0,
      maxDuration: 30,
      sortBy: "rating",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Tours
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Search by name or location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label
          htmlFor="difficulty"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Difficulty Level
        </label>
        <select
          id="difficulty"
          value={filters.difficulty}
          onChange={(e) => handleChange("difficulty", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          <option value="all">All Levels</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label
          htmlFor="maxPrice"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="space-y-3">
          <input
            id="maxPrice"
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", Number(e.target.value))}
              placeholder="Min"
              aria-label="Minimum price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
              placeholder="Max"
              aria-label="Maximum price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Duration: {filters.minDuration} - {filters.maxDuration} days
        </label>
        <input
          id="duration"
          type="range"
          min="0"
          max="30"
          step="1"
          value={filters.maxDuration}
          onChange={(e) => handleChange("maxDuration", Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Sort By */}
      <div>
        <label
          htmlFor="sortBy"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Sort By
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) =>
            handleChange("sortBy", e.target.value as FilterOptions["sortBy"])
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
