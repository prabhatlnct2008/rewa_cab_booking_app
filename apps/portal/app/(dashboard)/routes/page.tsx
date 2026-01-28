'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Star } from 'lucide-react';

interface Route {
  id: string;
  slug: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMinutes: number;
  basePricePerSeat: number;
  isPopular: boolean;
  isActive: boolean;
}

// Mock data
const mockRoutes: Route[] = [
  {
    id: '1',
    slug: 'rewa-to-prayagraj',
    from: 'Rewa',
    to: 'Prayagraj',
    distanceKm: 130,
    durationMinutes: 180,
    basePricePerSeat: 400,
    isPopular: true,
    isActive: true,
  },
  {
    id: '2',
    slug: 'rewa-to-satna',
    from: 'Rewa',
    to: 'Satna',
    distanceKm: 60,
    durationMinutes: 90,
    basePricePerSeat: 200,
    isPopular: true,
    isActive: true,
  },
  {
    id: '3',
    slug: 'rewa-to-varanasi',
    from: 'Rewa',
    to: 'Varanasi',
    distanceKm: 200,
    durationMinutes: 270,
    basePricePerSeat: 600,
    isPopular: true,
    isActive: true,
  },
  {
    id: '4',
    slug: 'rewa-to-jabalpur',
    from: 'Rewa',
    to: 'Jabalpur',
    distanceKm: 200,
    durationMinutes: 240,
    basePricePerSeat: 550,
    isPopular: false,
    isActive: true,
  },
];

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [routes] = useState<Route[]>(mockRoutes);

  const filteredRoutes = routes.filter(
    (route) =>
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Routes</h1>
          <p className="text-gray-500 mt-1">
            Manage all routes and their pricing
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Plus className="h-5 w-5" />
          Add Route
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Routes table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Distance</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Base Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr
                key={route.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {route.from}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-gray-900">{route.to}</span>
                    {route.isPopular && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{route.slug}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {route.distanceKm} km
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDuration(route.durationMinutes)}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{route.basePricePerSeat}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      route.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {route.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No routes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
