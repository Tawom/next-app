let stripeInstance: import("stripe").Stripe | null = null;

export function getStripe() {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    // Only require Stripe if the key exists
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require("stripe");
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

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
