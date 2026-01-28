'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Lock,
  Shield,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingSummary {
  id: string;
  ride: {
    route: {
      fromCity: string;
      toCity: string;
    };
    departureTime: Date;
    pickupPoint: string;
  };
  seats: number;
  seatPrice: number;
  passengerName: string;
  passengerPhone: string;
}

const mockBooking: BookingSummary = {
  id: 'BK-2024-001',
  ride: {
    route: {
      fromCity: 'Rewa',
      toCity: 'Prayagraj',
    },
    departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    pickupPoint: 'Near Bus Stand, Rewa',
  },
  seats: 2,
  seatPrice: 450,
  passengerName: 'John Doe',
  passengerPhone: '9876543210',
};

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [lockExpiry, setLockExpiry] = useState(10 * 60); // 10 minutes in seconds

  const seats = parseInt(searchParams.get('seats') || '1');

  useEffect(() => {
    setTimeout(() => {
      setBooking({ ...mockBooking, seats });
      setLoading(false);
    }, 300);
  }, [params.bookingId, seats]);

  // Lock countdown timer
  useEffect(() => {
    if (!loading && lockExpiry > 0) {
      const timer = setInterval(() => {
        setLockExpiry((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect back if lock expires
            router.push('/search');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, lockExpiry, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    setProcessing(true);

    // In real app: Create Instamojo payment request and redirect
    // Simulating payment flow
    setTimeout(() => {
      // After successful payment, redirect to confirmation
      router.push(`/confirmation/${params.bookingId}`);
    }, 2000);
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const totalPrice = booking.seatPrice * booking.seats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/verify"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">Payment</h1>
            </div>

            {/* Lock Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              lockExpiry < 120 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <Clock className="h-4 w-4" />
              Seats locked for {formatTime(lockExpiry)}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {['Details', 'Verify', 'Pay', 'Confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= 2
                      ? index === 2
                        ? 'bg-primary-600 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < 2 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:inline ${
                    index === 2 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
                {index < 3 && <div className="w-8 sm:w-16 h-px bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Booking Summary</h2>

              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.ride.route.fromCity} → {booking.ride.route.toCity}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(booking.ride.departureTime, 'EEEE, dd MMM yyyy • hh:mm a')}
                  </p>
                  <p className="text-sm text-gray-500">{booking.ride.pickupPoint}</p>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-medium text-gray-900">{booking.seats} seat{booking.seats > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Contact</p>
                  <p className="font-medium text-gray-900">{booking.passengerName}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>

              <div className="flex items-center gap-4 p-4 border border-primary-200 bg-primary-50 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Instamojo</p>
                  <p className="text-sm text-gray-500">UPI, Cards, Net Banking, Wallets</p>
                </div>
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                <p>Secure payment powered by Instamojo. Your payment information is encrypted and secure.</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Important</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Full payment is required to confirm your seat</li>
                    <li>• You'll receive booking confirmation via SMS after payment</li>
                    <li>• Driver details will be shared 2 hours before departure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Seat price × {booking.seats}</span>
                  <span>₹{(booking.seatPrice * booking.seats).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Convenience fee</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay ₹{totalPrice.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/refund" className="text-primary-600 hover:underline">
                  Refund Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
