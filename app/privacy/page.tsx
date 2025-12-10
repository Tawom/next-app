import Link from "next/link";
import Button from "@/components/Button";

export const metadata = {
  title: "Privacy Policy",
  description: "TravelHub privacy policy and data protection information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">Last updated: December 9, 2025</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, including your
              name, email address, and booking details when you create an
              account or make a reservation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to provide, maintain, and
              improve our services, process your bookings, and communicate with
              you about your reservations and account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share your
              information with tour operators to fulfill your bookings and with
              service providers who assist us in operating our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your
              personal information, including encryption and secure data
              storage.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal
              information at any time by contacting us or managing your account
              settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us
              at privacy@travelhub.com.
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
