'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Car,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'tempo_traveller';
  brand: string;
  model: string;
  year: number;
  color: string;
  seatingCapacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  assignedDriver: { id: string; name: string } | null;
  insuranceExpiry: Date;
  fitnessExpiry: Date;
  permitExpiry: Date;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    registrationNumber: 'MP 12 AB 1234',
    type: 'suv',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2022,
    color: 'White',
    seatingCapacity: 7,
    status: 'active',
    assignedDriver: { id: 'd1', name: 'Rajesh Kumar' },
    insuranceExpiry: new Date('2024-06-15'),
    fitnessExpiry: new Date('2024-08-20'),
    permitExpiry: new Date('2025-01-10'),
  },
  {
    id: '2',
    registrationNumber: 'MP 12 CD 5678',
    type: 'sedan',
    brand: 'Maruti',
    model: 'Dzire',
    year: 2021,
    color: 'Silver',
    seatingCapacity: 4,
    status: 'active',
    assignedDriver: { id: 'd2', name: 'Suresh Singh' },
    insuranceExpiry: new Date('2024-04-10'),
    fitnessExpiry: new Date('2024-07-15'),
    permitExpiry: new Date('2024-12-20'),
  },
  {
    id: '3',
    registrationNumber: 'MP 12 EF 9012',
    type: 'suv',
    brand: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    color: 'Black',
    seatingCapacity: 7,
    status: 'maintenance',
    assignedDriver: null,
    insuranceExpiry: new Date('2024-09-25'),
    fitnessExpiry: new Date('2024-11-30'),
    permitExpiry: new Date('2025-03-15'),
  },
  {
    id: '4',
    registrationNumber: 'MP 12 GH 3456',
    type: 'tempo_traveller',
    brand: 'Force',
    model: 'Traveller',
    year: 2020,
    color: 'White',
    seatingCapacity: 12,
    status: 'inactive',
    assignedDriver: null,
    insuranceExpiry: new Date('2024-02-28'),
    fitnessExpiry: new Date('2024-03-15'),
    permitExpiry: new Date('2024-04-01'),
  },
];

const vehicleTypeLabels = {
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  tempo_traveller: 'Tempo Traveller',
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  maintenance: {
    label: 'Maintenance',
    color: 'bg-yellow-100 text-yellow-700',
    icon: AlertTriangle,
  },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

function isExpiringSoon(date: Date): boolean {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return date <= thirtyDaysFromNow;
}

function isExpired(date: Date): boolean {
  return date < new Date();
}

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredVehicles =
    statusFilter === 'all'
      ? vehicles
      : vehicles.filter((v) => v.status === statusFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-500 mt-1">Manage your vehicle fleet</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Plus className="h-5 w-5" />
          Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'maintenance', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  statusFilter === f
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

      {/* Vehicles table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => {
              const StatusIcon = statusConfig[vehicle.status].icon;
              return (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Car className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {vehicle.registrationNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicle.brand} {vehicle.model} • {vehicle.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-gray-100 rounded text-sm text-gray-700">
                      {vehicleTypeLabels[vehicle.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {vehicle.seatingCapacity} seats
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.assignedDriver ? (
                      <span className="text-sm text-gray-900">
                        {vehicle.assignedDriver.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Insurance:</span>
                        <span
                          className={`text-xs font-medium ${
                            isExpired(vehicle.insuranceExpiry)
                              ? 'text-red-600'
                              : isExpiringSoon(vehicle.insuranceExpiry)
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {format(vehicle.insuranceExpiry, 'dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Fitness:</span>
                        <span
                          className={`text-xs font-medium ${
                            isExpired(vehicle.fitnessExpiry)
                              ? 'text-red-600'
                              : isExpiringSoon(vehicle.fitnessExpiry)
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {format(vehicle.fitnessExpiry, 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[vehicle.status].color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[vehicle.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
          <p className="text-gray-500">No vehicles found</p>
        </div>
      )}
    </div>
  );
}
