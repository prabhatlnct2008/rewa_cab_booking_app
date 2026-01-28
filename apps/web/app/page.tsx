import Link from 'next/link';

// Popular routes data
const POPULAR_ROUTES = [
  { from: 'Rewa', to: 'Prayagraj', slug: 'rewa-to-prayagraj', price: 400 },
  { from: 'Rewa', to: 'Satna', slug: 'rewa-to-satna', price: 200 },
  { from: 'Rewa', to: 'Varanasi', slug: 'rewa-to-varanasi', price: 600 },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">RewaCab</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-primary-200">
                Home
              </Link>
              <Link href="/routes" className="hover:text-primary-200">
                Routes
              </Link>
              <Link href="/how-it-works" className="hover:text-primary-200">
                How It Works
              </Link>
              <Link href="/support" className="hover:text-primary-200">
                Support
              </Link>
            </div>
            <Link
              href="/search"
              className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Trusted Cab Partner in Rewa
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Book affordable and reliable cab services from Rewa to Prayagraj,
              Satna, Varanasi and more. Verified drivers, secure payments.
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto text-left">
              <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rewa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Prayagraj"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Find Rides
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {POPULAR_ROUTES.map((route) => (
              <Link
                key={route.slug}
                href={`/routes/${route.slug}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary-600 font-semibold">
                    {route.from}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-accent-600 font-semibold">
                    {route.to}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Starting from</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{route.price}
                  </span>
                </div>
                <div className="mt-4 text-primary-600 group-hover:text-primary-700 font-medium">
                  View Rides →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose RewaCab?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Drivers</h3>
              <p className="text-gray-600">
                All our drivers are verified and trained for your safety.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Pay securely online via Instamojo. No hidden charges.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our support team is available round the clock to help you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Search & Select</h3>
                <p className="text-gray-600">
                  Enter your route and date. Browse available rides and choose
                  the best one.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">
                  Book & Pay Securely
                </h3>
                <p className="text-gray-600">
                  Fill in passenger details and complete payment securely via
                  Instamojo.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2">Travel & Enjoy</h3>
                <p className="text-gray-600">
                  Get driver details, track your ride, and enjoy a comfortable
                  journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">RewaCab</h4>
              <p className="text-sm">
                Your trusted cab partner in Rewa. Safe, affordable, and
                reliable travel.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/routes" className="hover:text-white">
                    Routes
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Popular Routes</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/routes/rewa-to-prayagraj"
                    className="hover:text-white"
                  >
                    Rewa to Prayagraj
                  </Link>
                </li>
                <li>
                  <Link href="/routes/rewa-to-satna" className="hover:text-white">
                    Rewa to Satna
                  </Link>
                </li>
                <li>
                  <Link
                    href="/routes/rewa-to-varanasi"
                    className="hover:text-white"
                  >
                    Rewa to Varanasi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📞 +91 98765 43210</li>
                <li>✉️ support@rewacab.com</li>
                <li>📍 Rewa, Madhya Pradesh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2024 RewaCab. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
