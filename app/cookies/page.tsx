import Link from "next/link";
import Button from "@/components/Button";

export const metadata = {
  title: "Cookie Policy",
  description: "TravelHub cookie policy and usage information.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Cookie Policy
          </h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">Last updated: December 9, 2025</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. What Are Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and enabling essential
              features.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-700 mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Authentication - to keep you signed in</li>
              <li>Preferences - to remember your settings</li>
              <li>Analytics - to understand how you use our service</li>
              <li>Security - to protect against fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Types of Cookies We Use
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Essential Cookies:</strong> Required for the website to
              function properly, including authentication and security.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Functional Cookies:</strong> Remember your preferences and
              choices to provide enhanced features.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with our website to improve user experience.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Managing Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies in your browser settings.
              However, disabling certain cookies may limit your ability to use
              some features of our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Third-Party Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that set their own cookies to
              provide features like analytics. These third parties have their
              own privacy policies.
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
