import type { Tour } from "../types/index.ts";

/**
 * Mock Tour Data
 *
 * Sample tour data for development and testing.
 * In a real application, this would come from:
 * - Database (PostgreSQL, MongoDB, etc.)
 * - External API
 * - CMS (Content Management System)
 *
 * For now, we use static data to build and test the UI.
 */

export const mockTours: Tour[] = [
  {
    id: "1",
    name: "The Northern Lights Adventure",
    description:
      "Experience the magical Aurora Borealis in Iceland. This unforgettable journey takes you to the best viewing spots, including remote locations away from city lights.",
    price: 2499,
    duration: 7,
    maxGroupSize: 12,
    difficulty: "moderate",
    rating: 4.8,
    numReviews: 234,
    imageUrl:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80",
    location: "Reykjavik, Iceland",
    startDates: ["2024-12-01", "2024-12-15", "2025-01-10"],
    highlights: [
      "Northern Lights hunting with expert guides",
      "Visit to the Blue Lagoon",
      "Glacier hiking experience",
      "Traditional Icelandic cuisine",
    ],
  },
  {
    id: "2",
    name: "Tropical Paradise in Bali",
    description:
      "Discover the enchanting island of Bali with its stunning beaches, ancient temples, lush rice terraces, and vibrant culture.",
    price: 1899,
    duration: 10,
    maxGroupSize: 15,
    difficulty: "easy",
    rating: 4.9,
    numReviews: 412,
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    location: "Ubud, Bali",
    startDates: ["2024-11-20", "2024-12-10", "2025-01-15"],
    highlights: [
      "Sunrise trek to Mount Batur",
      "Rice terrace photography tour",
      "Traditional Balinese cooking class",
      "Beach sunset ceremonies",
    ],
  },
  {
    id: "3",
    name: "Machu Picchu Trek",
    description:
      "Hike the legendary Inca Trail to the ancient citadel of Machu Picchu. This challenging trek rewards you with breathtaking mountain views and rich history.",
    price: 3299,
    duration: 8,
    maxGroupSize: 10,
    difficulty: "difficult",
    rating: 4.7,
    numReviews: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    location: "Cusco, Peru",
    startDates: ["2024-11-01", "2024-12-05", "2025-02-01"],
    highlights: [
      "4-day Inca Trail trek",
      "Professional mountain guides",
      "Visit to Sacred Valley",
      "Sunrise at Machu Picchu",
    ],
  },
  {
    id: "4",
    name: "Safari in the Serengeti",
    description:
      "Witness the incredible wildlife of Tanzania on this luxury safari adventure. See the Big Five and experience the Great Migration.",
    price: 4599,
    duration: 12,
    maxGroupSize: 8,
    difficulty: "easy",
    rating: 5.0,
    numReviews: 156,
    imageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    location: "Serengeti, Tanzania",
    startDates: ["2024-11-15", "2025-01-20", "2025-03-10"],
    highlights: [
      "Daily game drives",
      "Luxury tented camps",
      "Hot air balloon safari",
      "Maasai village visit",
    ],
  },
  {
    id: "5",
    name: "Japanese Cultural Experience",
    description:
      "Immerse yourself in Japanese culture with visits to ancient temples, traditional tea ceremonies, and the bustling streets of Tokyo.",
    price: 2799,
    duration: 14,
    maxGroupSize: 16,
    difficulty: "easy",
    rating: 4.8,
    numReviews: 298,
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    location: "Tokyo & Kyoto, Japan",
    startDates: ["2024-11-25", "2024-12-20", "2025-03-15"],
    highlights: [
      "Traditional tea ceremony",
      "Sumo wrestling experience",
      "Mount Fuji day trip",
      "Authentic ryokan stay",
    ],
  },
  {
    id: "6",
    name: "Swiss Alps Adventure",
    description:
      "Explore the majestic Swiss Alps with hiking, mountain railways, and charming alpine villages. Perfect for nature lovers and adventure seekers.",
    price: 3499,
    duration: 9,
    maxGroupSize: 14,
    difficulty: "moderate",
    rating: 4.9,
    numReviews: 267,
    imageUrl:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    location: "Interlaken, Switzerland",
    startDates: ["2024-12-01", "2025-01-05", "2025-02-20"],
    highlights: [
      "Jungfrau railway to Top of Europe",
      "Paragliding in Interlaken",
      "Scenic Alpine hikes",
      "Swiss chocolate factory tour",
    ],
  },
];

/**
 * Helper function to get a tour by ID
 * Simulates fetching from a database
 */
export function getTourById(id: string): Tour | undefined {
  return mockTours.find((tour) => tour.id === id);
}

/**
 * Helper function to filter tours
 * Could be expanded for search/filter functionality
 */
export function filterTours(filters: {
  difficulty?: Tour["difficulty"];
  maxPrice?: number;
  minRating?: number;
}): Tour[] {
  return mockTours.filter((tour) => {
    if (filters.difficulty && tour.difficulty !== filters.difficulty)
      return false;
    if (filters.maxPrice && tour.price > filters.maxPrice) return false;
    if (filters.minRating && tour.rating < filters.minRating) return false;
    return true;
  });
}
