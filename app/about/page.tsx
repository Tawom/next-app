/**
 * About Page
 *
 * Placeholder page for company information.
 * Will be expanded with company history, mission, team, etc.
 */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About TravelHub
        </h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Coming soon - Learn more about our mission to provide unforgettable
            travel experiences around the world.
          </p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "About Us - TravelHub",
  description:
    "Learn more about TravelHub and our mission to create unforgettable travel experiences.",
};
