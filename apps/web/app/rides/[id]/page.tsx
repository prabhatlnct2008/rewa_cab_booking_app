'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Car,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface RideDetails {
  id: string;
  route: {
    fromCity: string;
    toCity: string;
    distanceKm: number;
    estimatedMinutes: number;
  };
  departureTime: Date;
  arrivalTime: Date;
  seatCapacity: number;
  seatsBooked: number;
  seatPrice: number;
  vehicleType: 'sedan' | 'suv' | 'tempo_traveller';
  agency: {
    id: string;
    name: string;
    rating: number;
    isVerified: boolean;
    totalTrips: number;
  };
  pickupPoint: string;
  dropPoint: string;
  amenities: string[];
}

const mockRide: RideDetails = {
  id: '1',
  route: {
    fromCity: 'Rewa',
    toCity: 'Prayagraj',
    distanceKm: 185,
    estimatedMinutes: 240,
  },
  departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  arrivalTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  seatCapacity: 7,
  seatsBooked: 4,
  seatPrice: 450,
  vehicleType: 'suv',
  agency: {
    id: 'a1',
    name: 'Rewa Travels',
    rating: 4.5,
    isVerified: true,
    totalTrips: 1250,
  },
  pickupPoint: 'Near Bus Stand, Rewa',
  dropPoint: 'Civil Lines, Prayagraj',
  amenities: ['AC', 'Water Bottle', 'Phone Charging'],
};

const vehicleTypeLabels = {
  sedan: 'Sedan',
  suv: 'SUV',
  tempo_traveller: 'Tempo Traveller',
};

function RideDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [ride, setRide] = useState<RideDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(
    parseInt(searchParams.get('passengers') || '1')
  );

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRide(mockRide);
      setLoading(false);
    }, 300);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ride not found
          </h2>
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const seatsAvailable = ride.seatCapacity - ride.seatsBooked;
  const totalPrice = ride.seatPrice * selectedSeats;
  const canBook = selectedSeats <= seatsAvailable;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/search"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to results</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Ride Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {vehicleTypeLabels[ride.vehicleType]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ride.seatCapacity} seater
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    seatsAvailable <= 2
                      ? 'bg-red-100 text-red-700'
                      : seatsAvailable <= 4
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {seatsAvailable} seats left
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Departure */}
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-primary-600 rounded-full" />
                  <div className="absolute -left-6 top-4 w-px h-full bg-gray-200" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {format(ride.departureTime, 'hh:mm a')}
                    </p>
                    <p className="text-lg text-gray-700">{ride.route.fromCity}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {ride.pickupPoint}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="relative py-2">
                  <div className="absolute -left-8 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {Math.floor(ride.route.estimatedMinutes / 60)}h{' '}
                    {ride.route.estimatedMinutes % 60}m • {ride.route.distanceKm} km
                  </p>
                </div>

                {/* Arrival */}
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-green-600 rounded-full" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {format(ride.arrivalTime, 'hh:mm a')}
                    </p>
                    <p className="text-lg text-gray-700">{ride.route.toCity}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {ride.dropPoint}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agency Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Operated by</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {ride.agency.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {ride.agency.name}
                      </p>
                      {ride.agency.isVerified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {ride.agency.rating}
                        </span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-500">
                        {ride.agency.totalTrips.toLocaleString()} trips
                      </span>
                    </div>
                  </div>
                </div>
                {ride.agency.isVerified && (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Amenities */}
            {ride.amenities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {ride.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Cancellation Policy
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      Full refund if cancelled 24+ hours before departure
                    </p>
                    <p className="text-sm text-gray-500">
                      Refund processed within 5-7 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      50% refund if cancelled 12-24 hours before departure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      No refund if cancelled within 12 hours of departure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Book Your Seats</h3>

              {/* Seat Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of seats
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                    disabled={selectedSeats <= 1}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xl font-semibold">
                    {selectedSeats}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedSeats(Math.min(seatsAvailable, selectedSeats + 1))
                    }
                    disabled={selectedSeats >= seatsAvailable}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {!canBook && (
                  <p className="text-sm text-red-600 mt-2">
                    Only {seatsAvailable} seats available
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    ₹{ride.seatPrice} × {selectedSeats} seat
                    {selectedSeats > 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-900">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Link
                href={canBook ? `/book/${ride.id}?seats=${selectedSeats}` : '#'}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition ${
                  canBook
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                onClick={(e) => !canBook && e.preventDefault()}
              >
                Continue
                <ChevronRight className="h-5 w-5" />
              </Link>

              {/* Info Note */}
              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Full payment is required to confirm your seat. Verify mobile at
                  checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RideDetailsPage() {
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
      <RideDetailsContent />
    </Suspense>
  );
}
