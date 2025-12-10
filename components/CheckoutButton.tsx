"use client";

import { useState } from "react";
import Button from "./Button";

/**
 * Checkout Button Component
 *
 * Handles the payment flow when user clicks "Book Now"
 *
 * Flow:
 * 1. User clicks button
 * 2. Create Stripe Checkout session via API
 * 3. Redirect to Stripe's hosted checkout page
 * 4. User completes payment
 * 5. Redirected back to success page
 *
 * Why client component?
 * - Needs to handle click events
 * - Manages loading state
 * - Redirects to Stripe Checkout
 */

interface CheckoutButtonProps {
  tourId: string;
  startDate: string;
  numberOfPeople: number;
  disabled?: boolean;
}

export default function CheckoutButton({
  tourId,
  startDate,
  numberOfPeople,
  disabled,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          startDate,
          numberOfPeople,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading ? "Processing..." : "Proceed to Payment"}
    </Button>
  );
}
