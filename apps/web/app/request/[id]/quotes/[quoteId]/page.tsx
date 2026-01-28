'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Star,
  Car,
  User,
  Phone,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  Info,
  Lock,
} from 'lucide-react';
import { format, addMinutes } from 'date-fns';

interface QuoteDetail {
  id: string;
  agency: {
    id: string;
    name: string;
    rating: number;
    totalTrips: number;
    isVerified: boolean;
    phone: string;
  };
  totalPrice: number;
  advanceAmount: number;
  balanceAmount: number;
  vehicleType: string;
  vehicleModel: string;
  etaMinutes: number;
  validUntil: Date;
  message?: string;
  tripDetails: {
    pickup: string;
    drop: string;
    date: Date;
    passengers: number;
    distance: number;
  };
  inclusions: string[];
  terms: string[];
}

const mockQuote: QuoteDetail = {
  id: 'q1',
  agency: {
    id: 'a1',
    name: 'Rewa Travels',
    rating: 4.5,
    totalTrips: 1250,
    isVerified: true,
    phone: '9876543210',
  },
  totalPrice: 3500,
  advanceAmount: 1000,
  balanceAmount: 2500,
  vehicleType: 'SUV',
  vehicleModel: 'Toyota Innova',
  etaMinutes: 15,
  validUntil: addMinutes(new Date(), 30),
  message: 'AC vehicle with experienced driver. Comfortable journey assured.',
  tripDetails: {
    pickup: 'Near Bus Stand, Rewa',
    drop: 'Civil Lines, Prayagraj',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    passengers: 2,
    distance: 185,
  },
  inclusions: [
    'AC vehicle',
    'Experienced driver',
    'Fuel charges included',
    'Toll taxes included',
    'State permit included',
  ],
  terms: [
    'Balance to be paid to driver at the end of trip',
    'Waiting charges: ₹100/hour after 30 mins',
    'Night charges (10 PM - 6 AM): ₹200 extra',
  ],
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setQuote(mockQuote);
      setLoading(false);
    }, 300);
  }, [params.quoteId]);

  // Timer
  useEffect(() => {
    if (!quote) return;

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
  }, [quote]);

  const handleProceed = () => {
    setProcessing(true);
    // In real app: Redirect to OTP verification then payment
    setTimeout(() => {
      router.push(`/verify?requestId=${params.id}&quoteId=${params.quoteId}&type=individual`);
    }, 500);
  };

  if (loading || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading quote details...</p>
        </div>
      </div>
    );
  }

  const isExpired = timeLeft === 'Expired';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href={`/request/${params.id}/quotes`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">Quote Details</h1>
            </div>

            {!isExpired && (
              <div className="flex items-center gap-2 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                Valid for {timeLeft}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agency Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {quote.agency.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {quote.agency.name}
                      </h2>
                      {quote.agency.isVerified && (
                        <Shield className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{quote.agency.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        {quote.agency.totalTrips.toLocaleString()} trips
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${quote.agency.phone}`}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://wa.me/91${quote.agency.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-200 transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {quote.message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 italic">"{quote.message}"</p>
                </div>
              )}
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trip Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-900">
                      {quote.tripDetails.pickup}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Drop</p>
                    <p className="font-medium text-gray-900">
                      {quote.tripDetails.drop}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {format(quote.tripDetails.date, 'EEEE, dd MMMM yyyy')} • 10:00 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <Car className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium text-gray-900">
                      {quote.vehicleModel} ({quote.vehicleType}) •{' '}
                      {quote.tripDetails.passengers} passengers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {quote.inclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
              <ul className="space-y-2">
                {quote.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-gray-400">•</span>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip fare</span>
                  <span className="text-gray-900">
                    ₹{quote.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{quote.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-teal-700 font-medium">Pay Now (Advance)</span>
                  <span className="text-teal-700 font-bold">
                    ₹{quote.advanceAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Pay to Driver</span>
                  <span>₹{quote.balanceAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={processing || isExpired}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : isExpired ? (
                  'Quote Expired'
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay ₹{quote.advanceAmount.toLocaleString()} Advance
                  </>
                )}
              </button>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Advance payment confirms your booking. Balance to be paid to
                  driver after trip completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
