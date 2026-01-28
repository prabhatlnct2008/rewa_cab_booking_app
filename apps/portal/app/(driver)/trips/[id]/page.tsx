'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle,
  AlertCircle,
  Car,
  IndianRupee,
  Copy,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';

type TripStatus = 'assigned' | 'started' | 'completed';

interface TripDetails {
  id: string;
  bookingNumber: string;
  status: TripStatus;
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  pickupTime: Date;
  passengers: {
    name: string;
    phone?: string;
  }[];
  customerPhone: string;
  amount: number;
  advancePaid: number;
  balanceDue: number;
  vehicleNumber: string;
  notes?: string;
  distance: string;
  estimatedDuration: string;
}

const mockTrip: TripDetails = {
  id: '1',
  bookingNumber: 'RWC-2024-00156',
  status: 'assigned',
  fromCity: 'Rewa',
  toCity: 'Prayagraj',
  pickupPoint: 'Near Bus Stand, Main Road, Rewa',
  dropPoint: 'Civil Lines, Near Hotel Kanha Shyam, Prayagraj',
  pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  passengers: [
    { name: 'Raj Kumar', phone: '9876543210' },
    { name: 'Priya Kumar' },
  ],
  customerPhone: '9876543210',
  amount: 900,
  advancePaid: 900,
  balanceDue: 0,
  vehicleNumber: 'MP 19 AB 1234',
  notes: 'Customer has 2 large bags. Please ensure enough boot space.',
  distance: '185 km',
  estimatedDuration: '4 hours',
};

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<TripDetails>(mockTrip);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyBookingId = () => {
    navigator.clipboard.writeText(trip.bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartTrip = () => {
    setLoading(true);
    // In real app: Call API to update status
    setTimeout(() => {
      setTrip({ ...trip, status: 'started' });
      setLoading(false);
    }, 500);
  };

  const handleCompleteTrip = () => {
    setLoading(true);
    // In real app: Call API to update status
    setTimeout(() => {
      setTrip({ ...trip, status: 'completed' });
      setLoading(false);
    }, 500);
  };

  const openNavigation = () => {
    const destination =
      trip.status === 'assigned' ? trip.pickupPoint : trip.dropPoint;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination + ', ' + (trip.status === 'assigned' ? trip.fromCity : trip.toCity)
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold">Trip Details</h1>
              <p className="text-sm text-primary-200">{trip.bookingNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Status Card */}
        <div
          className={`rounded-xl p-4 mb-4 ${
            trip.status === 'assigned'
              ? 'bg-blue-50 border border-blue-200'
              : trip.status === 'started'
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {trip.status === 'assigned' ? (
              <Clock className="h-6 w-6 text-blue-600" />
            ) : trip.status === 'started' ? (
              <Car className="h-6 w-6 text-orange-600" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  trip.status === 'assigned'
                    ? 'text-blue-800'
                    : trip.status === 'started'
                    ? 'text-orange-800'
                    : 'text-green-800'
                }`}
              >
                {trip.status === 'assigned'
                  ? 'Trip Assigned'
                  : trip.status === 'started'
                  ? 'Trip In Progress'
                  : 'Trip Completed'}
              </p>
              <p
                className={`text-sm ${
                  trip.status === 'assigned'
                    ? 'text-blue-600'
                    : trip.status === 'started'
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}
              >
                {trip.status === 'assigned'
                  ? 'Pickup at ' + format(trip.pickupTime, 'hh:mm a')
                  : trip.status === 'started'
                  ? 'En route to destination'
                  : 'Completed successfully'}
              </p>
            </div>
          </div>
        </div>

        {/* Route Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary-600 border-4 border-primary-100" />
              <div className="w-0.5 h-16 bg-gray-200 my-2" />
              <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-green-100" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-semibold text-gray-900">{trip.fromCity}</p>
                <p className="text-sm text-gray-600">{trip.pickupPoint}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Drop</p>
                <p className="font-semibold text-gray-900">{trip.toCity}</p>
                <p className="text-sm text-gray-600">{trip.dropPoint}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{trip.distance}</span>
              <span>•</span>
              <span>{trip.estimatedDuration}</span>
            </div>
            <button
              onClick={openNavigation}
              className="flex items-center gap-2 text-primary-600 font-medium text-sm hover:text-primary-700"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </button>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Schedule</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{format(trip.pickupTime, 'EEEE, dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>{format(trip.pickupTime, 'hh:mm a')}</span>
            </div>
          </div>
        </div>

        {/* Passengers Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Passengers ({trip.passengers.length})
          </h3>
          <div className="space-y-3">
            {trip.passengers.map((passenger, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary-600">
                      {passenger.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{passenger.name}</p>
                    {index === 0 && (
                      <p className="text-xs text-primary-600">Primary Contact</p>
                    )}
                  </div>
                </div>
                {passenger.phone && (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${passenger.phone}`}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/91${passenger.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-semibold text-gray-900">
                ₹{trip.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <span>Advance Paid</span>
              <span>₹{trip.advancePaid.toLocaleString()}</span>
            </div>
            {trip.balanceDue > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-medium text-orange-600">Balance Due</span>
                <span className="font-semibold text-orange-600">
                  ₹{trip.balanceDue.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Notes</p>
                <p className="text-sm text-yellow-700 mt-1">{trip.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking ID */}
        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-mono font-medium text-gray-900">
              {trip.bookingNumber}
            </p>
          </div>
          <button
            onClick={copyBookingId}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {trip.status !== 'completed' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-lg mx-auto">
            {trip.status === 'assigned' ? (
              <button
                onClick={handleStartTrip}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
              >
                {loading ? (
                  'Starting...'
                ) : (
                  <>
                    <Car className="h-5 w-5" />
                    Start Trip
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleCompleteTrip}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
              >
                {loading ? (
                  'Completing...'
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Complete Trip
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
