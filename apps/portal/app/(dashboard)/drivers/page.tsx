'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Star,
  MapPin,
  Car,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  licenseNumber: string;
  rating: number;
  totalRides: number;
  status: 'active' | 'inactive' | 'pending_verification';
  currentLocation: string | null;
  assignedVehicle: { id: string; number: string; type: string } | null;
  joinedAt: Date;
}

// Mock data
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@email.com',
    licenseNumber: 'MP12 2020 0001234',
    rating: 4.8,
    totalRides: 342,
    status: 'active',
    currentLocation: 'Rewa City',
    assignedVehicle: { id: 'v1', number: 'MP 12 AB 1234', type: 'SUV' },
    joinedAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    name: 'Suresh Singh',
    phone: '+91 98765 43211',
    email: null,
    licenseNumber: 'MP12 2019 0005678',
    rating: 4.5,
    totalRides: 256,
    status: 'active',
    currentLocation: 'Satna Road',
    assignedVehicle: { id: 'v2', number: 'MP 12 CD 5678', type: 'Sedan' },
    joinedAt: new Date('2023-08-20'),
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit.p@email.com',
    licenseNumber: 'MP12 2021 0009012',
    rating: 4.2,
    totalRides: 128,
    status: 'inactive',
    currentLocation: null,
    assignedVehicle: null,
    joinedAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Vikram Yadav',
    phone: '+91 98765 43213',
    email: null,
    licenseNumber: 'MP12 2022 0003456',
    rating: 0,
    totalRides: 0,
    status: 'pending_verification',
    currentLocation: null,
    assignedVehicle: null,
    joinedAt: new Date('2024-02-01'),
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  pending_verification: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
};

export default function DriversPage() {
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDrivers =
    statusFilter === 'all'
      ? drivers
      : drivers.filter((d) => d.status === statusFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-500 mt-1">Manage your driver network</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Plus className="h-5 w-5" />
          Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'inactive', 'pending_verification'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  statusFilter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f === 'pending_verification'
                  ? 'Pending'
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drivers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const StatusIcon = statusConfig[driver.status].icon;
          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-lg">
                        {driver.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[driver.status].color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[driver.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {driver.phone}
                  </div>
                  {driver.currentLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {driver.currentLocation}
                    </div>
                  )}
                  {driver.assignedVehicle && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Car className="h-4 w-4 text-gray-400" />
                      {driver.assignedVehicle.number} ({driver.assignedVehicle.type})
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-900">
                      {driver.rating > 0 ? driver.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {driver.totalRides} rides completed
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    License: {driver.licenseNumber}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">No drivers found</p>
        </div>
      )}
    </div>
  );
}
