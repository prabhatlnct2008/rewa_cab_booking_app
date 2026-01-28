'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  User,
  Phone,
  Package,
  ChevronRight,
  Info,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';

interface PassengerInfo {
  name: string;
  phone: string;
}

interface BookingRide {
  id: string;
  route: {
    fromCity: string;
    toCity: string;
  };
  departureTime: Date;
  seatPrice: number;
  pickupPoint: string;
}

const mockRide: BookingRide = {
  id: '1',
  route: {
    fromCity: 'Rewa',
    toCity: 'Prayagraj',
  },
  departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  seatPrice: 450,
  pickupPoint: 'Near Bus Stand, Rewa',
};

function BookingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ride, setRide] = useState<BookingRide | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const seats = parseInt(searchParams.get('seats') || '1');

  const [primaryPassenger, setPrimaryPassenger] = useState<PassengerInfo>({
    name: '',
    phone: '',
  });

  const [additionalPassengers, setAdditionalPassengers] = useState<
    PassengerInfo[]
  >(
    Array(Math.max(0, seats - 1))
      .fill(null)
      .map(() => ({ name: '', phone: '' }))
  );

  const [luggageNotes, setLuggageNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTimeout(() => {
      setRide(mockRide);
      setLoading(false);
    }, 300);
  }, [params.rideId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!primaryPassenger.name.trim()) {
      newErrors.primaryName = 'Name is required';
    }

    if (!primaryPassenger.phone.trim()) {
      newErrors.primaryPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(primaryPassenger.phone.trim())) {
      newErrors.primaryPhone = 'Enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // In real app: Create booking, lock seats, redirect to OTP verification
    setTimeout(() => {
      // Store booking data in session/context and redirect
      router.push(`/verify?bookingId=temp-${Date.now()}&rideId=${params.rideId}&seats=${seats}`);
    }, 500);
  };

  if (loading || !ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const totalPrice = ride.seatPrice * seats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href={`/rides/${params.rideId}?passengers=${seats}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Passenger Details
              </h1>
              <p className="text-sm text-gray-500">
                {ride.route.fromCity} → {ride.route.toCity}
              </p>
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
                    index === 0
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index === 0 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
                {index < 3 && (
                  <div className="w-12 sm:w-24 h-px bg-gray-200 mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Passenger */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Primary Passenger
                    </h2>
                    <p className="text-sm text-gray-500">
                      This person will receive booking updates
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={primaryPassenger.name}
                      onChange={(e) =>
                        setPrimaryPassenger({
                          ...primaryPassenger,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.primaryName
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.primaryName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.primaryName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={primaryPassenger.phone}
                        onChange={(e) =>
                          setPrimaryPassenger({
                            ...primaryPassenger,
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        placeholder="98765 43210"
                        className={`w-full pl-14 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.primaryPhone
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.primaryPhone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.primaryPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Passengers */}
              {additionalPassengers.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Additional Passengers
                      </h2>
                      <p className="text-sm text-gray-500">Optional details</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {additionalPassengers.map((passenger, index) => (
                      <div key={index} className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Passenger {index + 2} Name
                          </label>
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => {
                              const updated = [...additionalPassengers];
                              updated[index] = {
                                ...updated[index],
                                name: e.target.value,
                              };
                              setAdditionalPassengers(updated);
                            }}
                            placeholder="Enter name (optional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone (optional)
                          </label>
                          <input
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) => {
                              const updated = [...additionalPassengers];
                              updated[index] = {
                                ...updated[index],
                                phone: e.target.value
                                  .replace(/\D/g, '')
                                  .slice(0, 10),
                              };
                              setAdditionalPassengers(updated);
                            }}
                            placeholder="98765 43210"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Luggage Notes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Luggage Notes</h2>
                    <p className="text-sm text-gray-500">Optional</p>
                  </div>
                </div>

                <textarea
                  value={luggageNotes}
                  onChange={(e) => setLuggageNotes(e.target.value)}
                  placeholder="Any special luggage requirements? (e.g., 2 large suitcases)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Verify
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

              {/* Trip Info */}
              <div className="pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {ride.route.fromCity} → {ride.route.toCity}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(ride.departureTime, 'EEE, dd MMM • hh:mm a')}
                    </p>
                    <p className="text-sm text-gray-500">{ride.pickupPoint}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    ₹{ride.seatPrice} × {seats} seat{seats > 1 ? 's' : ''}
                  </span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Submit Button (Desktop) */}
              <button
                type="submit"
                form="booking-form"
                onClick={handleSubmit}
                disabled={submitting}
                className="hidden lg:flex w-full items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Verify
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Secure Payment Note */}
              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Secure payment via Instamojo. Your data is protected.</p>
              </div>

              {/* Seat Lock Info */}
              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
                <p className="text-yellow-700">
                  Your seats will be locked for 10 minutes once you proceed to
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
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
      <BookingContent />
    </Suspense>
  );
}
