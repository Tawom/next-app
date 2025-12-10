/**
 * Tour Type Definitions
 *
 * These interfaces define the structure of tour-related data in our application.
 *
 * Why use TypeScript interfaces?
 * - Catch errors at compile time, not runtime
 * - Self-documenting code (you can see what properties exist)
 * - Better IDE support (autocomplete, refactoring)
 * - Easier to maintain as the app grows
 */

export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  maxGroupSize: number;
  difficulty: "easy" | "moderate" | "difficult";
  rating: number; // 0-5
  numReviews: number;
  imageUrl: string;
  location: string;
  startDates: string[]; // ISO date strings
  highlights: string[];
}

/**
 * Booking interface for when users book a tour
 * We'll use this later when building the booking flow
 */
export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  startDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

/**
 * User interface for customer accounts
 * Will be expanded when adding authentication
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
