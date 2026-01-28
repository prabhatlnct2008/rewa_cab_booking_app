'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';

interface Agency {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  gstin: string | null;
  status: 'active' | 'inactive' | 'pending_approval';
  driversCount: number;
  vehiclesCount: number;
  rating: number;
  totalBookings: number;
  commissionRate: number;
  joinedAt: Date;
}

// Mock data
const mockAgencies: Agency[] = [
  {
    id: '1',
    name: 'Rewa Cab Services',
    ownerName: 'Mohan Sharma',
    phone: '+91 98765 43210',
    email: 'contact@rewacabs.com',
    address: 'Near Bus Stand, Rewa MP 486001',
    gstin: '23AABCU9603R1ZM',
    status: 'active',
    driversCount: 15,
    vehiclesCount: 12,
    rating: 4.6,
    totalBookings: 1250,
    commissionRate: 12,
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'MP Travel Solutions',
    ownerName: 'Anil Verma',
    phone: '+91 98765 43211',
    email: 'info@mptravels.com',
    address: 'City Mall Road, Rewa MP 486001',
    gstin: '23AABCU9603R1ZN',
    status: 'active',
    driversCount: 8,
    vehiclesCount: 6,
    rating: 4.3,
    totalBookings: 780,
    commissionRate: 15,
    joinedAt: new Date('2023-04-20'),
  },
  {
    id: '3',
    name: 'Quick Ride Rewa',
    ownerName: 'Vikram Patel',
    phone: '+91 98765 43212',
    email: 'quickride@email.com',
    address: 'Station Road, Rewa MP 486001',
    gstin: null,
    status: 'pending_approval',
    driversCount: 0,
    vehiclesCount: 0,
    rating: 0,
    totalBookings: 0,
    commissionRate: 12,
    joinedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Satna Express',
    ownerName: 'Ramesh Gupta',
    phone: '+91 98765 43213',
    email: 'satnaexpress@email.com',
    address: 'Main Market, Satna MP 485001',
    gstin: '23AABCU9603R1ZO',
    status: 'inactive',
    driversCount: 3,
    vehiclesCount: 2,
    rating: 3.8,
    totalBookings: 340,
    commissionRate: 10,
    joinedAt: new Date('2023-08-10'),
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  pending_approval: {
    label: 'Pending Approval',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
};

export default function AgenciesPage() {
  const [agencies] = useState<Agency[]>(mockAgencies);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAgencies =
    statusFilter === 'all'
      ? agencies
      : agencies.filter((a) => a.status === statusFilter);

  const stats = {
    total: agencies.length,
    active: agencies.filter((a) => a.status === 'active').length,
    pending: agencies.filter((a) => a.status === 'pending_approval').length,
    totalDrivers: agencies.reduce((acc, a) => acc + a.driversCount, 0),
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agencies</h1>
          <p className="text-gray-500 mt-1">Manage partner agencies</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Plus className="h-5 w-5" />
          Add Agency
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Agencies</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Drivers</p>
          <p className="text-2xl font-bold text-primary-600">{stats.totalDrivers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agencies..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'pending_approval', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  statusFilter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f === 'pending_approval'
                  ? 'Pending'
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agencies list */}
      <div className="space-y-4">
        {filteredAgencies.map((agency) => {
          const StatusIcon = statusConfig[agency.status].icon;
          return (
            <div
              key={agency.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {agency.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[agency.status].color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[agency.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Owner: {agency.ownerName}</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {agency.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {agency.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {agency.address.split(',')[0]}
                  </div>
                  {agency.gstin && (
                    <div className="text-sm text-gray-600">
                      <span className="text-gray-400">GSTIN:</span> {agency.gstin}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {agency.driversCount}
                      </span>{' '}
                      <span className="text-gray-500">Drivers</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {agency.vehiclesCount}
                      </span>{' '}
                      <span className="text-gray-500">Vehicles</span>
                    </span>
                  </div>
                  {agency.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {agency.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {agency.totalBookings.toLocaleString()} bookings
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Commission:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {agency.commissionRate}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 ml-auto">
                    Joined {format(agency.joinedAt, 'MMM yyyy')}
                  </div>
                </div>
              </div>

              {agency.status === 'pending_approval' && (
                <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between">
                  <span className="text-sm text-yellow-700">
                    This agency is awaiting approval
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      Reject
                    </button>
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAgencies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">No agencies found</p>
        </div>
      )}
    </div>
  );
}
