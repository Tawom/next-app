import Link from "next/link";
import Button from "@/components/Button";

/**
 * Not Found Page
 *
 * Displayed when:
 * - User visits /tours/999 (non-existent tour)
 * - Tour ID doesn't match any in our database
 * - notFound() is called in page.tsx
 *
 * Why create a custom 404?
 * - Better user experience (branded, helpful)
 * - Guide users back to working pages
 * - Maintains app's look and feel
 *
 * Default Next.js 404 is generic and plain.
 */

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🗺️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tour Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the tour you&apos;re looking for. It may
          have been removed or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Browse All Tours</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
