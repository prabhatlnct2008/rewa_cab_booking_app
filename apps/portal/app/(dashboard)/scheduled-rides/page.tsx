'use client';

import { useState } from 'react';
import { Plus, Search, Calendar, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ScheduledRide {
  id: string;
  route: { from: string; to: string };
  departureTime: Date;
  seatCapacity: number;
  seatsBooked: number;
  pricePerSeat: number;
  vehicleType: string;
  isPublished: boolean;
}

// Mock data
const mockRides: ScheduledRide[] = [
  {
    id: '1',
    route: { from: 'Rewa', to: 'Prayagraj' },
    departureTime: new Date('2024-02-15T15:00:00'),
    seatCapacity: 6,
    seatsBooked: 2,
    pricePerSeat: 400,
    vehicleType: 'SUV',
    isPublished: true,
  },
  {
    id: '2',
    route: { from: 'Rewa', to: 'Satna' },
    departureTime: new Date('2024-02-15T08:00:00'),
    seatCapacity: 4,
    seatsBooked: 4,
    pricePerSeat: 200,
    vehicleType: 'Sedan',
    isPublished: true,
  },
  {
    id: '3',
    route: { from: 'Rewa', to: 'Varanasi' },
    departureTime: new Date('2024-02-16T06:00:00'),
    seatCapacity: 7,
    seatsBooked: 0,
    pricePerSeat: 600,
    vehicleType: 'SUV',
    isPublished: false,
  },
];

export default function ScheduledRidesPage() {
  const [rides] = useState<ScheduledRide[]>(mockRides);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredRides = rides.filter((ride) => {
    if (filter === 'published') return ride.isPublished;
    if (filter === 'draft') return !ride.isPublished;
    return true;
  });

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Rides</h1>
          <p className="text-gray-500 mt-1">
            Manage group rides and their schedules
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Plus className="h-5 w-5" />
          Create Ride
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rides..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rides grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ride.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {ride.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="text-sm text-gray-500">{ride.vehicleType}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {ride.route.from} → {ride.route.to}
              </h3>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {format(ride.departureTime, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {format(ride.departureTime, 'hh:mm a')}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {ride.seatsBooked} / {ride.seatCapacity} seats booked
                </span>
              </div>

              {/* Seats progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    ride.seatsBooked === ride.seatCapacity
                      ? 'bg-red-500'
                      : 'bg-primary-600'
                  }`}
                  style={{
                    width: `${(ride.seatsBooked / ride.seatCapacity) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ₹{ride.pricePerSeat}
                <span className="text-sm font-normal text-gray-500">/seat</span>
              </span>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRides.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No scheduled rides found</p>
        </div>
      )}
    </div>
  );
}
