'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Star,
  Car,
  ChevronRight,
  Timer,
  CheckCircle,
} from 'lucide-react';
import { format, addMinutes } from 'date-fns';

interface Quote {
  id: string;
  agency: {
    id: string;
    name: string;
    rating: number;
    totalTrips: number;
    isVerified: boolean;
  };
  totalPrice: number;
  advanceAmount: number;
  vehicleType: string;
  etaMinutes: number;
  validUntil: Date;
  message?: string;
}

const mockQuotes: Quote[] = [
  {
    id: 'q1',
    agency: {
      id: 'a1',
      name: 'Rewa Travels',
      rating: 4.5,
      totalTrips: 1250,
      isVerified: true,
    },
    totalPrice: 3500,
    advanceAmount: 1000,
    vehicleType: 'Toyota Innova (SUV)',
    etaMinutes: 15,
    validUntil: addMinutes(new Date(), 30),
    message: 'AC vehicle with experienced driver. Comfortable journey assured.',
  },
  {
    id: 'q2',
    agency: {
      id: 'a2',
      name: 'MP Cabs',
      rating: 4.8,
      totalTrips: 890,
      isVerified: true,
    },
    totalPrice: 3200,
    advanceAmount: 800,
    vehicleType: 'Maruti Ertiga (SUV)',
    etaMinutes: 20,
    validUntil: addMinutes(new Date(), 25),
  },
  {
    id: 'q3',
    agency: {
      id: 'a3',
      name: 'Vindhya Tours',
      rating: 4.2,
      totalTrips: 560,
      isVerified: true,
    },
    totalPrice: 3800,
    advanceAmount: 1200,
    vehicleType: 'Toyota Innova Crysta (SUV)',
    etaMinutes: 10,
    validUntil: addMinutes(new Date(), 45),
    message: 'Premium vehicle with extra luggage space.',
  },
];

export default function QuotesListPage() {
  const params = useParams();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'eta'>('price');

  useEffect(() => {
    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 500);
  }, []);

  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.totalPrice - b.totalPrice;
      case 'rating':
        return b.agency.rating - a.agency.rating;
      case 'eta':
        return a.etaMinutes - b.etaMinutes;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <Link
              href="/request"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {quotes.length} Quotes Available
              </h1>
              <p className="text-sm text-gray-500">Choose the best one for you</p>
            </div>
          </div>
        </div>
      </header>

      {/* Request Summary */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Rewa → Prayagraj
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Tomorrow
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              10:00 AM
            </span>
            <span className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              SUV • 2 passengers
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
          {[
            { id: 'price', label: 'Lowest Price' },
            { id: 'rating', label: 'Highest Rated' },
            { id: 'eta', label: 'Fastest' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id as typeof sortBy)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                sortBy === option.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Quotes List */}
        <div className="space-y-4">
          {sortedQuotes.map((quote, index) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              requestId={params.id as string}
              isBestPrice={index === 0 && sortBy === 'price'}
            />
          ))}
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          All prices are final. No hidden charges.
        </p>
      </main>
    </div>
  );
}

function QuoteCard({
  quote,
  requestId,
  isBestPrice,
}: {
  quote: Quote;
  requestId: string;
  isBestPrice: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = quote.validUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [quote.validUntil]);

  const isExpired = timeLeft === 'Expired';

  return (
    <Link
      href={isExpired ? '#' : `/request/${requestId}/quotes/${quote.id}`}
      className={`block bg-white rounded-xl border overflow-hidden transition-all ${
        isExpired
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-gray-200 hover:border-teal-300 hover:shadow-lg'
      }`}
      onClick={(e) => isExpired && e.preventDefault()}
    >
      {/* Best Price Badge */}
      {isBestPrice && !isExpired && (
        <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 text-center">
          Best Price
        </div>
      )}

      <div className="p-5">
        {/* Agency Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">
                {quote.agency.name[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{quote.agency.name}</p>
                {quote.agency.isVerified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {quote.agency.rating}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {quote.agency.totalTrips} trips
                </span>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isExpired ? 'text-red-500' : 'text-teal-600'
            }`}
          >
            <Timer className="h-4 w-4" />
            {timeLeft}
          </div>
        </div>

        {/* Vehicle & Message */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Car className="h-4 w-4" />
            {quote.vehicleType}
          </div>
          {quote.message && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              "{quote.message}"
            </p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{quote.totalPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Advance: ₹{quote.advanceAmount.toLocaleString()}
            </p>
          </div>

          {!isExpired && (
            <span className="flex items-center gap-1 text-teal-600 font-medium">
              Select
              <ChevronRight className="h-5 w-5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
