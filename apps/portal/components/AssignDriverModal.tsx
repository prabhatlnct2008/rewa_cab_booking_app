'use client';

import { useState } from 'react';
import {
  X,
  User,
  Car,
  Search,
  Check,
  AlertCircle,
  Phone,
  Star,
  MapPin,
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  isAvailable: boolean;
  currentLocation?: string;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: 'hatchback' | 'sedan' | 'suv' | 'tempo_traveller';
  capacity: number;
  isAvailable: boolean;
  assignedDriver?: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  route: { from: string; to: string };
  departureTime: Date;
  passengersCount: number;
}

interface AssignDriverModalProps {
  booking: Booking;
  onClose: () => void;
  onAssign: (driverId: string, vehicleId: string) => void;
}

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalTrips: 342,
    isAvailable: true,
    currentLocation: 'Rewa City',
  },
  {
    id: 'd2',
    name: 'Suresh Yadav',
    phone: '+91 87654 32109',
    rating: 4.6,
    totalTrips: 215,
    isAvailable: true,
    currentLocation: 'Near Bus Stand',
  },
  {
    id: 'd3',
    name: 'Mahesh Sharma',
    phone: '+91 76543 21098',
    rating: 4.9,
    totalTrips: 456,
    isAvailable: false,
    currentLocation: 'On Trip - Satna',
  },
  {
    id: 'd4',
    name: 'Dinesh Patel',
    phone: '+91 65432 10987',
    rating: 4.5,
    totalTrips: 128,
    isAvailable: true,
    currentLocation: 'Rewa Railway Station',
  },
];

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    registrationNumber: 'MP 19 AB 1234',
    model: 'Maruti Swift Dzire',
    type: 'sedan',
    capacity: 4,
    isAvailable: true,
  },
  {
    id: 'v2',
    registrationNumber: 'MP 19 CD 5678',
    model: 'Toyota Innova',
    type: 'suv',
    capacity: 7,
    isAvailable: true,
    assignedDriver: 'd1',
  },
  {
    id: 'v3',
    registrationNumber: 'MP 19 EF 9012',
    model: 'Maruti Ertiga',
    type: 'suv',
    capacity: 7,
    isAvailable: false,
  },
  {
    id: 'v4',
    registrationNumber: 'MP 19 GH 3456',
    model: 'Hyundai i20',
    type: 'hatchback',
    capacity: 4,
    isAvailable: true,
  },
  {
    id: 'v5',
    registrationNumber: 'MP 19 IJ 7890',
    model: 'Force Traveller',
    type: 'tempo_traveller',
    capacity: 12,
    isAvailable: true,
    assignedDriver: 'd2',
  },
];

const vehicleTypeLabels: Record<Vehicle['type'], string> = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV',
  tempo_traveller: 'Tempo Traveller',
};

export default function AssignDriverModal({
  booking,
  onClose,
  onAssign,
}: AssignDriverModalProps) {
  const [step, setStep] = useState<'driver' | 'vehicle'>('driver');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [driverSearch, setDriverSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  const availableDrivers = mockDrivers.filter(
    (d) =>
      d.isAvailable &&
      (d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
        d.phone.includes(driverSearch))
  );

  const availableVehicles = mockVehicles.filter(
    (v) =>
      v.isAvailable &&
      (v.registrationNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.model.toLowerCase().includes(vehicleSearch.toLowerCase()))
  );

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    // Auto-select vehicle if driver has one assigned
    const assignedVehicle = mockVehicles.find(
      (v) => v.assignedDriver === driver.id
    );
    if (assignedVehicle) {
      setSelectedVehicle(assignedVehicle);
    }
    setStep('vehicle');
  };

  const handleAssign = () => {
    if (selectedDriver && selectedVehicle) {
      onAssign(selectedDriver.id, selectedVehicle.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Assign Driver & Vehicle
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {booking.bookingNumber} • {booking.route.from} →{' '}
                  {booking.route.to}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setStep('driver')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  step === 'driver'
                    ? 'bg-primary-100 text-primary-700'
                    : selectedDriver
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {selectedDriver ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>1. Select Driver</span>
              </button>
              <div className="w-8 h-px bg-gray-300" />
              <button
                onClick={() => selectedDriver && setStep('vehicle')}
                disabled={!selectedDriver}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  step === 'vehicle'
                    ? 'bg-primary-100 text-primary-700'
                    : selectedVehicle
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {selectedVehicle ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Car className="h-4 w-4" />
                )}
                <span>2. Select Vehicle</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'driver' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drivers by name or phone..."
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Driver List */}
                <div className="space-y-3">
                  {availableDrivers.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No available drivers found</p>
                    </div>
                  ) : (
                    availableDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        onClick={() => handleDriverSelect(driver)}
                        className={`p-4 border rounded-xl cursor-pointer transition hover:border-primary-300 hover:bg-primary-50 ${
                          selectedDriver?.id === driver.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {driver.name}
                              </h4>
                              <span className="flex items-center gap-1 text-sm text-yellow-600">
                                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                                {driver.rating}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{driver.phone}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                              <span>{driver.totalTrips} trips</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {driver.currentLocation}
                              </span>
                            </div>
                          </div>
                          {selectedDriver?.id === driver.id && (
                            <Check className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {step === 'vehicle' && (
              <div className="space-y-4">
                {/* Selected Driver Summary */}
                {selectedDriver && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        Driver: {selectedDriver.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {selectedDriver.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('driver')}
                      className="ml-auto text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles by number or model..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Vehicle List */}
                <div className="space-y-3">
                  {availableVehicles.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No available vehicles found</p>
                    </div>
                  ) : (
                    availableVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-4 border rounded-xl cursor-pointer transition hover:border-primary-300 hover:bg-primary-50 ${
                          selectedVehicle?.id === vehicle.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {vehicle.registrationNumber}
                              </h4>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {vehicleTypeLabels[vehicle.type]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{vehicle.model}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Capacity: {vehicle.capacity} passengers
                            </p>
                          </div>
                          {vehicle.assignedDriver === selectedDriver?.id && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Usually assigned
                            </span>
                          )}
                          {selectedVehicle?.id === vehicle.id && (
                            <Check className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl shrink-0">
            {/* Warning for passenger count */}
            {selectedVehicle &&
              booking.passengersCount > selectedVehicle.capacity && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Warning: This booking has {booking.passengersCount} passengers,
                    but the selected vehicle only has {selectedVehicle.capacity}{' '}
                    capacity.
                  </p>
                </div>
              )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedDriver || !selectedVehicle}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                Assign Driver & Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
