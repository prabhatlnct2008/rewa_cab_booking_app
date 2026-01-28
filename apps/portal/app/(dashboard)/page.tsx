'use client';

import {
  Ticket,
  TrendingUp,
  Car,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Stat card component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Recent booking row
function BookingRow({
  bookingNumber,
  route,
  customer,
  amount,
  status,
}: {
  bookingNumber: string;
  route: string;
  customer: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed';
}) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-4">
        <span className="font-medium text-primary-600">{bookingNumber}</span>
      </td>
      <td className="py-4 text-gray-900">{route}</td>
      <td className="py-4 text-gray-600">{customer}</td>
      <td className="py-4 font-medium text-gray-900">₹{amount}</td>
      <td className="py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  // TODO: Fetch real data from API
  const stats = {
    totalBookings: 156,
    bookingsChange: '+12%',
    revenue: '₹2,45,000',
    revenueChange: '+8%',
    activeRides: 12,
    pendingPayments: 8,
  };

  const recentBookings = [
    {
      bookingNumber: 'RWC-2024-00156',
      route: 'Rewa → Prayagraj',
      customer: '+91 98765 43210',
      amount: 800,
      status: 'confirmed' as const,
    },
    {
      bookingNumber: 'RWC-2024-00155',
      route: 'Rewa → Satna',
      customer: '+91 87654 32109',
      amount: 400,
      status: 'pending' as const,
    },
    {
      bookingNumber: 'RWC-2024-00154',
      route: 'Rewa → Varanasi',
      customer: '+91 76543 21098',
      amount: 1200,
      status: 'completed' as const,
    },
    {
      bookingNumber: 'RWC-2024-00153',
      route: 'Rewa → Prayagraj',
      customer: '+91 65432 10987',
      amount: 800,
      status: 'confirmed' as const,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={stats.bookingsChange}
          changeType="up"
          icon={Ticket}
          iconColor="bg-primary-600"
        />
        <StatCard
          title="Revenue (This Month)"
          value={stats.revenue}
          change={stats.revenueChange}
          changeType="up"
          icon={TrendingUp}
          iconColor="bg-green-600"
        />
        <StatCard
          title="Active Rides"
          value={stats.activeRides}
          icon={Car}
          iconColor="bg-amber-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={CreditCard}
          iconColor="bg-red-500"
        />
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <a
              href="/bookings"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all →
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3">Booking #</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <BookingRow key={booking.bookingNumber} {...booking} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <a
          href="/scheduled-rides/new"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition group"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition">
              <Car className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Create Ride</h3>
              <p className="text-sm text-gray-500">Schedule a new group ride</p>
            </div>
          </div>
        </a>

        <a
          href="/routes/new"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition group"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Add Route</h3>
              <p className="text-sm text-gray-500">Create a new route</p>
            </div>
          </div>
        </a>

        <a
          href="/drivers/new"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition group"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Add Driver</h3>
              <p className="text-sm text-gray-500">Register a new driver</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
