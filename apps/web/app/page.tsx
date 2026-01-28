'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  CheckCircle,
  Shield,
  Clock,
  Phone,
  Star,
  ArrowRight,
  Play,
  Smartphone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

const popularRoutes = [
  { from: 'Rewa', to: 'Prayagraj (Allahabad)', slug: 'rewa-prayagraj' },
  { from: 'Rewa', to: 'Satna', slug: 'rewa-satna' },
  { from: 'Rewa', to: 'Varanasi', slug: 'rewa-varanasi' },
  { from: 'Rewa', to: 'Jabalpur', slug: 'rewa-jabalpur' },
  { from: 'Rewa', to: 'Katni', slug: 'rewa-katni' },
];

const testimonials = [
  {
    quote: 'Booked Rewa to Prayagraj in 2 minutes. Clear pricing, easy payment.',
    name: 'Rohit',
    location: 'Rewa',
  },
  {
    quote: 'I requested a private cab and got multiple quotes. Picked the best one.',
    name: 'Neha',
    location: 'Rewa',
  },
  {
    quote: 'Simple and reliable. Support team responded quickly.',
    name: 'Amit',
    location: 'Satna',
  },
];

const faqs = [
  {
    question: 'Do I need to login to search rides?',
    answer:
      'No. You can browse freely. Mobile verification is needed only at payment.',
  },
  {
    question: 'Do group rides require full payment?',
    answer: 'Yes. Full payment confirms your seat.',
  },
  {
    question: 'How does private cab booking work?',
    answer:
      'You request a ride, agencies send quotes, you choose one and pay advance to confirm.',
  },
  {
    question: 'Is online payment safe?',
    answer: 'Yes. Payments are processed through secure Instamojo checkout.',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchForm, setSearchForm] = useState({
    from: 'Rewa',
    to: '',
    date: '',
    passengers: 1,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rewa Cabs</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link
                href="/search"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Routes
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
                How it works
              </Link>
              <Link href="#support" className="text-gray-600 hover:text-gray-900 font-medium">
                Support
              </Link>
            </div>
            <Link
              href="/search"
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-teal-50 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Book Rewa Cabs in Minutes —{' '}
                <span className="text-primary-600">Group Rides & Private Cabs</span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed">
                Scheduled rides like Rewa → Prayagraj and custom cab requests with
                instant quotes from verified agencies. Pay securely online and travel
                stress-free.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-primary-600/25"
                >
                  Find Rides
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/request"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition border-2 border-gray-200"
                >
                  Request a Private Cab
                </Link>
              </div>

              {/* App Store Buttons */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                >
                  <Play className="h-5 w-5" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Get it on</div>
                    <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Download on the</div>
                    <div className="text-sm font-semibold -mt-0.5">App Store</div>
                  </div>
                </a>
              </div>

              {/* Trust Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Verified drivers & agencies
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure payments via Instamojo
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Live booking updates
                </span>
              </div>
            </div>

            {/* Right - Search Box */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Search Rides
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = `/search?from=${searchForm.from}&to=${searchForm.to}&date=${searchForm.date}&passengers=${searchForm.passengers}`;
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchForm.from}
                        onChange={(e) =>
                          setSearchForm({ ...searchForm, from: e.target.value })
                        }
                        placeholder="Pickup location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
                      <input
                        type="text"
                        value={searchForm.to}
                        onChange={(e) =>
                          setSearchForm({ ...searchForm, to: e.target.value })
                        }
                        placeholder="Drop location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={searchForm.date}
                          onChange={(e) =>
                            setSearchForm({ ...searchForm, date: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Passengers
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={searchForm.passengers}
                          onChange={(e) =>
                            setSearchForm({
                              ...searchForm,
                              passengers: parseInt(e.target.value),
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'passenger' : 'passengers'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    Search Rides
                  </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                  No login needed. Verify mobile only at payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Ways to Travel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Two Ways to Travel
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose what works best for your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Group Rides */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 border border-primary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Pre-Scheduled Group Rides
              </h3>
              <p className="text-gray-600 mb-6">
                Book your seat on fixed routes with fixed departure times. See price
                upfront and reserve instantly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-primary-600 shrink-0" />
                  Fixed departure time + expected arrival time
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-primary-600 shrink-0" />
                  Seat availability shown live
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-primary-600 shrink-0" />
                  Full payment confirms your seat
                </li>
              </ul>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                View Scheduled Rides
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Private Cabs */}
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-teal-100">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="h-7 w-7 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h8m-8 4h4m-4 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Request a Private Cab
              </h3>
              <p className="text-gray-600 mb-6">
                Share your pickup and drop. Agencies send you quotes — you choose the
                best one and confirm with a small advance.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-teal-600 shrink-0" />
                  Multiple quotes from local agencies
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-teal-600 shrink-0" />
                  Transparent advance amount
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-teal-600 shrink-0" />
                  Driver assigned after confirmation
                </li>
              </ul>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
              >
                Request Quotes
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Popular Routes from Rewa
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Frequently traveled destinations with daily scheduled rides
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route) => (
              <Link
                key={route.slug}
                href={`/search?from=${route.from}&to=${route.to}`}
                className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {route.from} → {route.to}
                    </p>
                    <p className="text-sm text-gray-500">View available rides</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-primary-600 transition" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Search All Routes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why People Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Built for Rewa. Designed for comfort.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Why thousands of travelers trust us for their journeys
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transparent pricing
              </h3>
              <p className="text-gray-600">
                See total cost before you pay — no hidden charges
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified agencies
              </h3>
              <p className="text-gray-600">
                All our partners are verified local agencies you can trust
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure payments
              </h3>
              <p className="text-gray-600">
                Instamojo checkout with instant confirmation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast booking
              </h3>
              <p className="text-gray-600">
                No login until payment — browse and book instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Support when you need it
              </h3>
              <p className="text-gray-600">
                Call or WhatsApp assistance available
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Local expertise
              </h3>
              <p className="text-gray-600">
                Built specifically for Rewa and nearby routes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Book your ride in 3 simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Group Rides */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </span>
                For Group Rides
              </h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Search a scheduled ride
                    </h4>
                    <p className="text-gray-600">
                      Enter your route and date to see available group rides
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Choose seats + enter passenger details
                    </h4>
                    <p className="text-gray-600">
                      Select how many seats you need and fill in basic details
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Pay full amount and confirm your seat
                    </h4>
                    <p className="text-gray-600">
                      Complete payment securely and your seat is reserved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Cabs */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7h8m-8 4h4m-4 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                  </svg>
                </span>
                For Private Cabs
              </h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Request a cab</h4>
                    <p className="text-gray-600">
                      Share your pickup, drop, date, and preferences
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Receive quotes and select one
                    </h4>
                    <p className="text-gray-600">
                      Compare quotes from multiple agencies and pick the best
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Pay advance to confirm the booking
                    </h4>
                    <p className="text-gray-600">
                      A small advance secures your booking and driver
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Get the Rewa Cab App
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Faster bookings, saved trips, instant updates, and easy re-booking for
                your frequent routes.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-200" />
                  <span className="text-lg">One-tap rebook your last route</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-200" />
                  <span className="text-lg">Booking updates & driver details</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-200" />
                  <span className="text-lg">Offers and priority slots</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-200" />
                  <span className="text-lg">Faster checkout</span>
                </li>
              </ul>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  <Play className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Get it on</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Download on the</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* App Preview Placeholder */}
            <div className="relative flex justify-center">
              <div className="w-64 h-[500px] bg-white/10 rounded-[3rem] border-4 border-white/20 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Smartphone className="h-16 w-16 mx-auto mb-4" />
                  <p>App Preview</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative - App not ready */}
          <div className="mt-12 bg-white/10 rounded-2xl p-6 max-w-xl mx-auto">
            <p className="text-white text-center mb-4">
              App launching soon. Enter your number and we'll send the download link.
            </p>
            <form className="flex gap-3">
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Send App Link
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What Our Travelers Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real experiences from people who travel with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="#support"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to travel?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Find a ride in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
            >
              Find Rides
            </Link>
            <Link
              href="/request"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition border border-primary-400"
            >
              Request a Private Cab
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold">Rewa Cabs</span>
              </div>
              <p className="text-gray-400">
                Your trusted travel partner for Rewa and nearby routes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/search" className="hover:text-white transition">
                    Find Rides
                  </Link>
                </li>
                <li>
                  <Link href="/request" className="hover:text-white transition">
                    Request a Cab
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className="hover:text-white transition">
                    My Bookings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-white transition">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+919876543210" className="hover:text-white transition">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <a
                    href="https://wa.me/919876543210"
                    className="hover:text-white transition"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <Link href="/help" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Rewa Cabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
