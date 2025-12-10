"use client";

import { useEffect } from "react";
import Button from "@/components/Button";

/**
 * Global Error Handler
 *
 * Catches errors that occur during rendering in Server Components.
 *
 * Why needed?
 * - Server Component errors need special handling
 * - Provides consistent error UI
 * - Allows error recovery without full page reload
 * - Logs errors for debugging
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="space-y-3">
          <Button variant="primary" onClick={() => reset()} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </main>
  );
}
