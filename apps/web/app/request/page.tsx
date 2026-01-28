'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';

const vehicleTypes = [
  { id: 'hatchback', label: 'Hatchback', seats: '4 seats', icon: '🚗' },
  { id: 'sedan', label: 'Sedan', seats: '4 seats', icon: '🚙' },
  { id: 'suv', label: 'SUV', seats: '6-7 seats', icon: '🚐' },
  { id: 'tempo_traveller', label: 'Tempo Traveller', seats: '10-12 seats', icon: '🚌' },
];

export default function RequestCabPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '',
    passengers: 1,
    vehicleType: 'sedan',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    if (!form.dropLocation.trim()) {
      newErrors.dropLocation = 'Drop location is required';
    }
    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    if (!form.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Simulate API call to create ride request
    setTimeout(() => {
      // Redirect to waiting page with request ID
      router.push(`/request/req-${Date.now()}/waiting`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              Request a Private Cab
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup & Drop */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              Pickup & Drop Location
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  value={form.pickupLocation}
                  onChange={(e) =>
                    setForm({ ...form, pickupLocation: e.target.value })
                  }
                  placeholder="Enter pickup address or landmark"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.pickupLocation}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Drop Location *
                </label>
                <input
                  type="text"
                  value={form.dropLocation}
                  onChange={(e) =>
                    setForm({ ...form, dropLocation: e.target.value })
                  }
                  placeholder="Enter drop address or landmark"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.dropLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dropLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dropLocation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Date & Time
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Time *
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="text-sm text-red-600 mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Passengers & Vehicle */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              Passengers & Vehicle
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Number of Passengers
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, passengers: Math.max(1, form.passengers - 1) })
                  }
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center text-xl font-semibold">
                  {form.passengers}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, passengers: Math.min(12, form.passengers + 1) })
                  }
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Vehicle Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {vehicleTypes.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setForm({ ...form, vehicleType: vehicle.id })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                      form.vehicleType === vehicle.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{vehicle.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.label}</p>
                      <p className="text-sm text-gray-500">{vehicle.seats}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Additional Notes
            </h2>

            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special requirements? (e.g., AC preferred, luggage space needed)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-teal-50 rounded-xl border border-teal-100 p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-teal-800">How it works</p>
                <ul className="text-sm text-teal-700 mt-1 space-y-1">
                  <li>1. Submit your request with trip details</li>
                  <li>2. Receive quotes from multiple agencies</li>
                  <li>3. Choose the best quote and pay advance to confirm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                Request Quotes
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
