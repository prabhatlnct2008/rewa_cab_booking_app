'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Car,
  User,
  Copy,
  Check,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

type BookingStatus = 'pending' | 'confirmed' | 'started' | 'completed' | 'cancelled';

interface BookingDetail {
  id: string;
  bookingNumber: string;
  type: 'group' | 'individual';
  status: BookingStatus;
  route: {
    fromCity: string;
    toCity: string;
  };
  departureTime: Date;
  arrivalTime: Date;
  pickupPoint: string;
  dropPoint: string;
  seats: number;
  passengers: {
    name: string;
    phone: string;
    isPrimary: boolean;
  }[];
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded';
    transactionId: string;
    paidAt: Date;
  };
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    vehicleType: string;
  };
  agency: {
    name: string;
    phone: string;
  };
  createdAt: Date;
}

const mockBooking: BookingDetail = {
  id: '1',
  bookingNumber: 'RWC-2024-00123',
  type: 'group',
  status: 'confirmed',
  route: { fromCity: 'Rewa', toCity: 'Prayagraj' },
  departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  arrivalTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
  pickupPoint: 'Near Bus Stand, Rewa',
  dropPoint: 'Civil Lines, Prayagraj',
  seats: 2,
  passengers: [
    { name: 'John Doe', phone: '9876543210', isPrimary: true },
    { name: 'Jane Doe', phone: '', isPrimary: false },
  ],
  payment: {
    amount: 900,
    status: 'paid',
    transactionId: 'PAY-123456789',
    paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  driver: {
    name: 'Rajesh Kumar',
    phone: '9876543211',
    vehicleNumber: 'MP 12 AB 1234',
    vehicleType: 'Toyota Innova (SUV)',
  },
  agency: {
    name: 'Rewa Travels',
    phone: '9876500000',
  },
  createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
};

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  started: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Car },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const timelineSteps: { status: BookingStatus; label: string }[] = [
  { status: 'pending', label: 'Booking Created' },
  { status: 'confirmed', label: 'Payment Confirmed' },
  { status: 'started', label: 'Trip Started' },
  { status: 'completed', label: 'Trip Completed' },
];

function BookingDetailContent() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 300);
  }, [params.id]);

  const copyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[booking.status].icon;
  const currentStepIndex = timelineSteps.findIndex((s) => s.status === booking.status);
  const canCancel = ['pending', 'confirmed'].includes(booking.status) &&
    booking.departureTime > new Date(Date.now() + 12 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/bookings"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Booking Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig[booking.status].color}`}
                >
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      {booking.bookingNumber}
                    </p>
                    <button
                      onClick={copyBookingId}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[booking.status].color}`}
              >
                {statusConfig[booking.status].label}
              </span>
            </div>

            {/* Timeline */}
            {booking.status !== 'cancelled' && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                {timelineSteps.map((step, index) => (
                  <div key={step.status} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= currentStepIndex
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {index <= currentStepIndex ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center max-w-[80px] ${
                          index <= currentStepIndex
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={`w-12 sm:w-20 h-0.5 mx-1 ${
                          index < currentStepIndex
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Trip Details</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {booking.route.fromCity} → {booking.route.toCity}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-500">
                    <p>Pickup: {booking.pickupPoint}</p>
                    <p>Drop: {booking.dropPoint}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(booking.departureTime, 'EEEE, dd MMMM yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(booking.departureTime, 'hh:mm a')} →{' '}
                    {format(booking.arrivalTime, 'hh:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.seats} Seat{booking.seats > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.type === 'group' ? 'Group Ride' : 'Private Cab'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          {booking.driver && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Driver Details</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-7 w-7 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{booking.driver.name}</p>
                  <p className="text-sm text-gray-500">{booking.driver.vehicleType}</p>
                  <p className="text-sm text-gray-500">{booking.driver.vehicleNumber}</p>
                </div>
                <a
                  href={`tel:${booking.driver.phone}`}
                  className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-200 transition"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Passengers</h2>

            <div className="space-y-3">
              {booking.passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{passenger.name}</p>
                      {passenger.phone && (
                        <p className="text-sm text-gray-500">+91 {passenger.phone}</p>
                      )}
                    </div>
                  </div>
                  {passenger.isPrimary && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-medium text-gray-900">
                  ₹{booking.payment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={`font-medium ${
                    booking.payment.status === 'paid'
                      ? 'text-green-600'
                      : booking.payment.status === 'refunded'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {booking.payment.status.charAt(0).toUpperCase() +
                    booking.payment.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="text-gray-900">{booking.payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid On</span>
                <span className="text-gray-900">
                  {format(booking.payment.paidAt, 'dd MMM yyyy, hh:mm a')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition"
              >
                Cancel Booking
              </button>
            )}

            <a
              href={`tel:${booking.agency.phone}`}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
            >
              <Phone className="h-5 w-5" />
              Contact Agency
            </a>

            <a
              href={`https://wa.me/91${booking.agency.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>

          {/* Cancellation Policy */}
          {canCancel && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Cancellation Policy</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Full refund if cancelled 24+ hours before departure</li>
                    <li>• 50% refund if cancelled 12-24 hours before departure</li>
                    <li>• No refund within 12 hours of departure</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cancel Booking?
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to cancel this booking? Based on our
              cancellation policy, you will receive a full refund.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  // Handle cancellation
                  setShowCancelModal(false);
                }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
              >
                Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <BookingDetailContent />
    </Suspense>
  );
}
