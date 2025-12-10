import Link from "next/link";
import Button from "@/components/Button";

/**
 * Custom 404 Not Found Page
 *
 * Shown when user navigates to non-existent route.
 *
 * Why custom 404?
 * - Better UX than default error page
 * - Maintains brand consistency
 * - Provides helpful navigation options
 * - Reduces user frustration
 */

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Go to Homepage</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
