'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Home,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface ConfirmedRequest {
  id: string;
  bookingNumber: string;
  status: 'confirmed' | 'driver_assigned';
  tripDetails: {
    pickup: string;
    drop: string;
    date: Date;
    passengers: number;
  };
  quote: {
    totalPrice: number;
    advancePaid: number;
    balanceAmount: number;
  };
  agency: {
    name: string;
    phone: string;
  };
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleModel: string;
  };
  paymentId: string;
}

const mockConfirmedRequest: ConfirmedRequest = {
  id: 'req-123',
  bookingNumber: 'RWC-IND-2024-00045',
  status: 'confirmed',
  tripDetails: {
    pickup: 'Near Bus Stand, Rewa',
    drop: 'Civil Lines, Prayagraj',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    passengers: 2,
  },
  quote: {
    totalPrice: 3500,
    advancePaid: 1000,
    balanceAmount: 2500,
  },
  agency: {
    name: 'Rewa Travels',
    phone: '9876543210',
  },
  paymentId: 'PAY-ADV-123456',
};

export default function ConfirmedRequestPage() {
  const params = useParams();
  const [request, setRequest] = useState<ConfirmedRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRequest(mockConfirmedRequest);
      setLoading(false);
    }, 300);
  }, [params.id]);

  const copyBookingId = () => {
    if (request) {
      navigator.clipboard.writeText(request.bookingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rewa Cabs</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-6 py-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-teal-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-teal-100">
              Your private cab has been booked successfully
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            {/* Booking ID */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="text-lg font-bold text-gray-900">
                  {request.bookingNumber}
                </p>
              </div>
              <button
                onClick={copyBookingId}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Trip Details */}
            <div className="space-y-4 mb-6">
              <h2 className="font-semibold text-gray-900">Trip Details</h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {request.tripDetails.pickup} → {request.tripDetails.drop}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {request.tripDetails.passengers} passenger
                    {request.tripDetails.passengers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(request.tripDetails.date, 'EEEE, dd MMMM yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">10:00 AM</p>
                </div>
              </div>
            </div>

            {/* Agency Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Agency</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="font-bold text-gray-600">
                      {request.agency.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.agency.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      +91 {request.agency.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${request.agency.phone}`}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://wa.me/91${request.agency.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Driver Status */}
            {request.driver ? (
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Driver Assigned
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-green-200">
                    <User className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {request.driver.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.driver.vehicleModel} • {request.driver.vehicleNumber}
                    </p>
                  </div>
                  <a
                    href={`tel:${request.driver.phone}`}
                    className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-200 transition"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Driver will be assigned soon
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      You'll receive driver details via SMS before your trip. The
                      agency will contact you to confirm.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-teal-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-teal-700">Advance Paid</span>
                <span className="font-bold text-teal-800">
                  ₹{request.quote.advancePaid.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-600">Balance (pay to driver)</span>
                <span className="text-teal-700">
                  ₹{request.quote.balanceAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-teal-200 mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-teal-800">Total Trip Cost</span>
                  <span className="font-bold text-teal-900">
                    ₹{request.quote.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/bookings"
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition"
              >
                View My Bookings
              </Link>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">Need help with your booking?</p>
          <a
            href="tel:+919876543210"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Call Support: +91 98765 43210
          </a>
        </div>
      </main>
    </div>
  );
}
