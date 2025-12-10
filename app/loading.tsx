/**
 * Global Loading Component
 *
 * Shows loading state while navigating between pages.
 *
 * Why needed?
 * - Provides feedback during page transitions
 * - Better UX for slow connections
 * - Matches application theme
 */

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </main>
  );
}
