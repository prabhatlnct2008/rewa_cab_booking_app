'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Navigation,
  Filter,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

type TripStatus = 'assigned' | 'started' | 'completed';

interface Trip {
  id: string;
  bookingNumber: string;
  status: TripStatus;
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  pickupTime: Date;
  passengers: number;
  customerName: string;
  customerPhone: string;
  amount: number;
  vehicleNumber: string;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    bookingNumber: 'RWC-2024-00156',
    status: 'assigned',
    fromCity: 'Rewa',
    toCity: 'Prayagraj',
    pickupPoint: 'Near Bus Stand, Rewa',
    dropPoint: 'Civil Lines, Prayagraj',
    pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    passengers: 2,
    customerName: 'Raj Kumar',
    customerPhone: '9876543210',
    amount: 900,
    vehicleNumber: 'MP 19 AB 1234',
  },
  {
    id: '2',
    bookingNumber: 'RWC-2024-00155',
    status: 'assigned',
    fromCity: 'Rewa',
    toCity: 'Satna',
    pickupPoint: 'Railway Station, Rewa',
    dropPoint: 'Bus Stand, Satna',
    pickupTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    passengers: 1,
    customerName: 'Priya Sharma',
    customerPhone: '8765432109',
    amount: 250,
    vehicleNumber: 'MP 19 AB 1234',
  },
  {
    id: '3',
    bookingNumber: 'RWC-2024-00150',
    status: 'started',
    fromCity: 'Rewa',
    toCity: 'Varanasi',
    pickupPoint: 'Civil Lines, Rewa',
    dropPoint: 'Godowlia, Varanasi',
    pickupTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    passengers: 3,
    customerName: 'Amit Singh',
    customerPhone: '7654321098',
    amount: 1800,
    vehicleNumber: 'MP 19 AB 1234',
  },
  {
    id: '4',
    bookingNumber: 'RWC-2024-00145',
    status: 'completed',
    fromCity: 'Rewa',
    toCity: 'Jabalpur',
    pickupPoint: 'White Tiger Lodge, Rewa',
    dropPoint: 'Russel Chowk, Jabalpur',
    pickupTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    passengers: 4,
    customerName: 'Neha Gupta',
    customerPhone: '6543210987',
    amount: 3500,
    vehicleNumber: 'MP 19 AB 1234',
  },
];

const statusConfig: Record<TripStatus, { label: string; color: string; bg: string }> = {
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-100' },
  started: { label: 'In Progress', color: 'text-orange-700', bg: 'bg-orange-100' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
};

export default function DriverTripsPage() {
  const [trips] = useState<Trip[]>(mockTrips);
  const [filter, setFilter] = useState<TripStatus | 'all'>('all');

  const filteredTrips =
    filter === 'all' ? trips : trips.filter((t) => t.status === filter);

  const upcomingTrips = trips.filter((t) => t.status === 'assigned');
  const activeTrips = trips.filter((t) => t.status === 'started');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Ramesh Kumar</p>
                <p className="text-sm text-primary-200">MP 19 AB 1234</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-primary-600 pb-6">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {upcomingTrips.length}
              </p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-bold text-orange-600">
                {activeTrips.length}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {trips.filter((t) => t.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Trips' },
            { key: 'assigned', label: 'Upcoming' },
            { key: 'started', label: 'Active' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trips found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const status = statusConfig[trip.status];
  const isToday =
    new Date(trip.pickupTime).toDateString() === new Date().toDateString();

  return (
    <Link href={`/driver/trips/${trip.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
        {/* Status Bar */}
        <div className={`px-4 py-2 ${status.bg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
            <span className="text-sm text-gray-500">{trip.bookingNumber}</span>
          </div>
        </div>

        <div className="p-4">
          {/* Route */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary-600" />
              <div className="w-0.5 h-8 bg-gray-200 my-1" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1">
              <div className="mb-3">
                <p className="font-medium text-gray-900">{trip.fromCity}</p>
                <p className="text-sm text-gray-500">{trip.pickupPoint}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">{trip.toCity}</p>
                <p className="text-sm text-gray-500">{trip.dropPoint}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {isToday
                  ? 'Today'
                  : format(trip.pickupTime, 'dd MMM')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(trip.pickupTime, 'hh:mm a')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{trip.passengers} passengers</span>
            </div>
          </div>

          {/* Customer & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{trip.customerName}</p>
              <p className="text-sm text-gray-500">₹{trip.amount}</p>
            </div>
            <div className="flex items-center gap-2">
              {trip.status !== 'completed' && (
                <a
                  href={`tel:${trip.customerPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
