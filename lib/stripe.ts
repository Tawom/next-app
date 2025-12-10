import Stripe from "stripe";

/**
 * Stripe Server-side Configuration
 *
 * This file initializes the Stripe SDK for server-side operations.
 *
 * Why Stripe?
 * - Industry-standard payment processing
 * - Built-in security and PCI compliance
 * - Supports multiple payment methods
 * - Excellent documentation and support
 * - Webhooks for real-time payment updates
 *
 * Security Notes:
 * - Secret key is only used on the server
 * - Never expose secret key in client code
 * - Use environment variables for all keys
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

/**
 * Format amount for Stripe
 * Stripe expects amounts in cents (smallest currency unit)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount from Stripe
 * Convert cents back to dollars
 */
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
