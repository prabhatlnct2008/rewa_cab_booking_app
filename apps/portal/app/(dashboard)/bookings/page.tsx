'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  bookingNumber: string;
  route: { from: string; to: string };
  customer: { phone: string; name: string | null };
  departureTime: Date;
  passengersCount: number;
  totalAmount: number;
  status: 'draft' | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  bookingType: 'group' | 'individual';
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'RWC-2024-00156',
    route: { from: 'Rewa', to: 'Prayagraj' },
    customer: { phone: '+91 98765 43210', name: 'Raj Kumar' },
    departureTime: new Date('2024-02-15T15:00:00'),
    passengersCount: 2,
    totalAmount: 800,
    status: 'confirmed',
    paymentStatus: 'completed',
    bookingType: 'group',
  },
  {
    id: '2',
    bookingNumber: 'RWC-2024-00155',
    route: { from: 'Rewa', to: 'Satna' },
    customer: { phone: '+91 87654 32109', name: null },
    departureTime: new Date('2024-02-15T08:00:00'),
    passengersCount: 1,
    totalAmount: 200,
    status: 'pending_payment',
    paymentStatus: 'pending',
    bookingType: 'group',
  },
  {
    id: '3',
    bookingNumber: 'RWC-2024-00154',
    route: { from: 'Rewa', to: 'Varanasi' },
    customer: { phone: '+91 76543 21098', name: 'Priya Sharma' },
    departureTime: new Date('2024-02-14T06:00:00'),
    passengersCount: 3,
    totalAmount: 1800,
    status: 'completed',
    paymentStatus: 'completed',
    bookingType: 'group',
  },
  {
    id: '4',
    bookingNumber: 'RWC-2024-00153',
    route: { from: 'Rewa', to: 'Jabalpur' },
    customer: { phone: '+91 65432 10987', name: 'Amit Singh' },
    departureTime: new Date('2024-02-16T10:00:00'),
    passengersCount: 4,
    totalAmount: 2500,
    status: 'confirmed',
    paymentStatus: 'completed',
    bookingType: 'individual',
  },
];

const statusColors: Record<Booking['status'], string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentColors: Record<Booking['paymentStatus'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  refunded: 'bg-purple-100 text-purple-700',
};

export default function BookingsPage() {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">
            View and manage all customer bookings
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg font-medium transition">
          <Download className="h-5 w-5" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking #, phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">All Types</option>
            <option value="group">Group</option>
            <option value="individual">Individual</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4">Booking #</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Passengers</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-primary-600">
                      {booking.bookingNumber}
                    </span>
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                        booking.bookingType === 'group'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {booking.bookingType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {booking.route.from} → {booking.route.to}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">
                        {booking.customer.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>
                      <p>{format(booking.departureTime, 'MMM dd, yyyy')}</p>
                      <p className="text-sm">
                        {format(booking.departureTime, 'hh:mm a')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900">
                    {booking.passengersCount}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        paymentColors[booking.paymentStatus]
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing 1 to {filteredBookings.length} of {filteredBookings.length}{' '}
            results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
