'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Filter,
  ChevronDown,
  Car,
  Shield,
  Star,
} from 'lucide-react';
import { format, addHours } from 'date-fns';

interface ScheduledRide {
  id: string;
  routeId: string;
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
  };
}

// Mock data for demonstration
const mockRides: ScheduledRide[] = [
  {
    id: '1',
    routeId: 'r1',
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
    },
  },
  {
    id: '2',
    routeId: 'r1',
    route: {
      fromCity: 'Rewa',
      toCity: 'Prayagraj',
      distanceKm: 185,
      estimatedMinutes: 240,
    },
    departureTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    arrivalTime: new Date(Date.now() + 9 * 60 * 60 * 1000),
    seatCapacity: 4,
    seatsBooked: 1,
    seatPrice: 500,
    vehicleType: 'sedan',
    agency: {
      id: 'a2',
      name: 'MP Cabs',
      rating: 4.8,
      isVerified: true,
    },
  },
  {
    id: '3',
    routeId: 'r1',
    route: {
      fromCity: 'Rewa',
      toCity: 'Prayagraj',
      distanceKm: 185,
      estimatedMinutes: 240,
    },
    departureTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    arrivalTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    seatCapacity: 12,
    seatsBooked: 8,
    seatPrice: 350,
    vehicleType: 'tempo_traveller',
    agency: {
      id: 'a3',
      name: 'Vindhya Tours',
      rating: 4.2,
      isVerified: true,
    },
  },
  {
    id: '4',
    routeId: 'r2',
    route: {
      fromCity: 'Rewa',
      toCity: 'Satna',
      distanceKm: 50,
      estimatedMinutes: 60,
    },
    departureTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    seatCapacity: 4,
    seatsBooked: 2,
    seatPrice: 200,
    vehicleType: 'sedan',
    agency: {
      id: 'a1',
      name: 'Rewa Travels',
      rating: 4.5,
      isVerified: true,
    },
  },
];

const vehicleTypeLabels = {
  sedan: 'Sedan',
  suv: 'SUV',
  tempo_traveller: 'Tempo Traveller',
};

type SortOption = 'cheapest' | 'earliest' | 'most_seats';

function SearchContent() {
  const searchParams = useSearchParams();
  const [rides, setRides] = useState<ScheduledRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('earliest');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');

  const from = searchParams.get('from') || 'Rewa';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const [searchForm, setSearchForm] = useState({
    from,
    to,
    date,
    passengers,
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = mockRides;

      // Filter by route
      if (to) {
        filtered = filtered.filter(
          (r) =>
            r.route.fromCity.toLowerCase().includes(from.toLowerCase()) &&
            r.route.toCity.toLowerCase().includes(to.toLowerCase())
        );
      }

      // Filter by available seats
      filtered = filtered.filter(
        (r) => r.seatCapacity - r.seatsBooked >= passengers
      );

      // Filter by vehicle type
      if (vehicleFilter !== 'all') {
        filtered = filtered.filter((r) => r.vehicleType === vehicleFilter);
      }

      // Sort
      switch (sortBy) {
        case 'cheapest':
          filtered.sort((a, b) => a.seatPrice - b.seatPrice);
          break;
        case 'earliest':
          filtered.sort(
            (a, b) => a.departureTime.getTime() - b.departureTime.getTime()
          );
          break;
        case 'most_seats':
          filtered.sort(
            (a, b) =>
              b.seatCapacity - b.seatsBooked - (a.seatCapacity - a.seatsBooked)
          );
          break;
      }

      setRides(filtered);
      setLoading(false);
    }, 500);
  }, [from, to, passengers, sortBy, vehicleFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rewa Cabs</span>
            </Link>
            <Link
              href="/bookings"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/search?from=${searchForm.from}&to=${searchForm.to}&date=${searchForm.date}&passengers=${searchForm.passengers}`;
            }}
            className="flex flex-wrap gap-4 items-end"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchForm.from}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, from: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-500" />
                <input
                  type="text"
                  value={searchForm.to}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, to: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="w-36">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, date: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={searchForm.passengers}
                  onChange={(e) =>
                    setSearchForm({
                      ...searchForm,
                      passengers: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {from} → {to || 'All destinations'}
            </h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Searching...' : `${rides.length} rides available`}
            </p>
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-3">
            {/* Vehicle Filter */}
            <div className="relative">
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All vehicles</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="tempo_traveller">Tempo Traveller</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
              {[
                { value: 'earliest', label: 'Earliest' },
                { value: 'cheapest', label: 'Cheapest' },
                { value: 'most_seats', label: 'Most Seats' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    sortBy === option.value
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No rides found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or check back later for new rides.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Request a Private Cab
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} passengers={passengers} />
            ))}
          </div>
        )}

        {/* No exact match CTA */}
        {!loading && rides.length > 0 && (
          <div className="mt-8 bg-teal-50 rounded-xl border border-teal-100 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Need a private cab instead?
                </h3>
                <p className="text-gray-600 mt-1">
                  Get quotes from multiple agencies for your custom trip.
                </p>
              </div>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition whitespace-nowrap"
              >
                Request Quotes
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function RideCard({
  ride,
  passengers,
}: {
  ride: ScheduledRide;
  passengers: number;
}) {
  const seatsAvailable = ride.seatCapacity - ride.seatsBooked;
  const totalPrice = ride.seatPrice * passengers;

  return (
    <Link
      href={`/rides/${ride.id}?passengers=${passengers}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Time & Route */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {format(ride.departureTime, 'HH:mm')}
                </p>
                <p className="text-sm text-gray-500">{ride.route.fromCity}</p>
              </div>

              {/* Duration */}
              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-1">
                  {Math.floor(ride.route.estimatedMinutes / 60)}h{' '}
                  {ride.route.estimatedMinutes % 60}m
                </p>
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-300" />
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {ride.route.distanceKm} km
                </p>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {format(ride.arrivalTime, 'HH:mm')}
                </p>
                <p className="text-sm text-gray-500">{ride.route.toCity}</p>
              </div>
            </div>

            {/* Agency & Vehicle */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                {ride.agency.isVerified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
                <span className="text-gray-700">{ride.agency.name}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-gray-600">{ride.agency.rating}</span>
                </div>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Car className="h-4 w-4" />
                {vehicleTypeLabels[ride.vehicleType]}
              </div>
            </div>
          </div>

          {/* Seats & Price */}
          <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
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
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </p>
              {passengers > 1 && (
                <p className="text-sm text-gray-500">
                  ₹{ride.seatPrice}/seat × {passengers}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Full payment required to confirm booking
        </p>
        <span className="text-primary-600 font-medium text-sm flex items-center gap-1">
          View Details
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
