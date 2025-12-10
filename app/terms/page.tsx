import Link from "next/link";
import Button from "@/components/Button";

export const metadata = {
  title: "Terms of Service",
  description: "TravelHub terms of service and user agreement.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">Last updated: December 9, 2025</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using TravelHub, you accept and agree to be bound
              by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Booking and Reservations
            </h2>
            <p className="text-gray-700 mb-4">
              All bookings are subject to availability and confirmation. Prices
              are subject to change until payment is received and booking is
              confirmed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Cancellation Policy
            </h2>
            <p className="text-gray-700 mb-4">
              Free cancellation is available up to 24 hours before the tour
              start date. Cancellations made within 24 hours may incur fees as
              specified in your booking confirmation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your
              account and password, and for all activities that occur under your
              account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              TravelHub acts as an intermediary between customers and tour
              operators. We are not liable for any injuries, damages, or losses
              incurred during tours provided by third-party operators.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued
              use of the service after changes constitutes acceptance of the new
              terms.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link href="/">
              <Button variant="outline">Back to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
