/**
 * Contact Page
 *
 * Placeholder page for contact information and form.
 * Will be expanded with contact form, email, phone, address, etc.
 */

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Coming soon - Get in touch with our travel experts.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">📧 Email: info@travelhub.com</p>
            <p className="text-gray-600">📞 Phone: +1 (555) 123-4567</p>
            <p className="text-gray-600">⏰ Hours: Mon-Fri 9am-6pm EST</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Contact Us - TravelHub",
  description:
    "Get in touch with TravelHub for any questions about our tours and services.",
};
