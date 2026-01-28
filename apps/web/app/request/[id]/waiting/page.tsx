'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, MapPin, Calendar, Clock, Lightbulb } from 'lucide-react';

const tips = [
  "You'll receive multiple quotes from verified agencies",
  'Compare prices and choose the best offer',
  'A small advance confirms your booking',
  'Driver details are shared after confirmation',
  'Cancel for free before paying advance',
];

export default function WaitingForQuotesPage() {
  const params = useParams();
  const router = useRouter();
  const [currentTip, setCurrentTip] = useState(0);
  const [quotesCount, setQuotesCount] = useState(0);

  // Simulate quotes coming in
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuotesCount((prev) => {
        if (prev >= 3) {
          clearInterval(quoteInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Rotate tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, []);

  // Redirect to quotes page when we have quotes
  useEffect(() => {
    if (quotesCount >= 2) {
      const timeout = setTimeout(() => {
        router.push(`/request/${params.id}/quotes`);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [quotesCount, params.id, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <Link
              href="/request"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Finding Quotes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          {/* Animated Loader */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-teal-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">{quotesCount}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {quotesCount === 0
              ? 'Finding drivers near you...'
              : quotesCount === 1
              ? '1 quote received!'
              : `${quotesCount} quotes received!`}
          </h2>
          <p className="text-gray-500 mb-8">
            {quotesCount < 2
              ? "We're connecting you with local agencies"
              : 'Preparing your quotes...'}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i < quotesCount
                    ? 'bg-teal-600 scale-110'
                    : 'bg-gray-200 animate-pulse'
                }`}
              />
            ))}
          </div>

          {/* Request Summary */}
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Your Request</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Rewa → Prayagraj</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Tomorrow, 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Sedan • 2 passengers</span>
              </div>
            </div>
          </div>

          {/* Tips Carousel */}
          <div className="bg-teal-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-teal-600 shrink-0" />
              <p className="text-sm text-teal-700 text-left animate-fade-in">
                {tips[currentTip]}
              </p>
            </div>
          </div>
        </div>

        {/* View Quotes Button (shown when quotes available) */}
        {quotesCount >= 2 && (
          <Link
            href={`/request/${params.id}/quotes`}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition"
          >
            View {quotesCount} Quotes
          </Link>
        )}
      </main>
    </div>
  );
}
