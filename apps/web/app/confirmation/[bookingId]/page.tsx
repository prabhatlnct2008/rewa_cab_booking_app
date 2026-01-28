'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  MessageCircle,
  Download,
  Home,
  Copy,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';

interface ConfirmedBooking {
  id: string;
  bookingNumber: string;
  ride: {
    route: {
      fromCity: string;
      toCity: string;
    };
    departureTime: Date;
    pickupPoint: string;
    dropPoint: string;
  };
  seats: number;
  totalAmount: number;
  passengerName: string;
  passengerPhone: string;
  paymentId: string;
}

const mockBooking: ConfirmedBooking = {
  id: '1',
  bookingNumber: 'RWC-2024-00123',
  ride: {
    route: {
      fromCity: 'Rewa',
      toCity: 'Prayagraj',
    },
    departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    pickupPoint: 'Near Bus Stand, Rewa',
    dropPoint: 'Civil Lines, Prayagraj',
  },
  seats: 2,
  totalAmount: 900,
  passengerName: 'John Doe',
  passengerPhone: '9876543210',
  paymentId: 'PAY-123456789',
};

function ConfirmationContent() {
  const params = useParams();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 300);
  }, [params.bookingId]);

  const copyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addToCalendar = () => {
    if (!booking) return;

    const startDate = booking.ride.departureTime;
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    const event = {
      title: `Cab: ${booking.ride.route.fromCity} to ${booking.ride.route.toCity}`,
      description: `Booking ID: ${booking.bookingNumber}\nPickup: ${booking.ride.pickupPoint}`,
      location: booking.ride.pickupPoint,
      startDate: format(startDate, "yyyyMMdd'T'HHmmss"),
      endDate: format(endDate, "yyyyMMdd'T'HHmmss"),
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, '_blank');
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
          <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">
              Your seats have been successfully booked
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            {/* Booking ID */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="text-lg font-bold text-gray-900">
                  {booking.bookingNumber}
                </p>
              </div>
              <button
                onClick={copyBookingId}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
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
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.ride.route.fromCity} → {booking.ride.route.toCity}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Pickup: {booking.ride.pickupPoint}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(booking.ride.departureTime, 'EEEE, dd MMMM yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Departure: {format(booking.ride.departureTime, 'hh:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {booking.seats} Seat{booking.seats > 1 ? 's' : ''} Booked
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.passengerName} • +91 {booking.passengerPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Payment Successful</p>
                  <p className="font-bold text-green-800">
                    ₹{booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700">Payment ID</p>
                  <p className="text-sm font-medium text-green-800">
                    {booking.paymentId}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Driver details will be shared 2 hours before departure via SMS
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Please arrive at the pickup point 10 minutes before departure
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={addToCalendar}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition"
              >
                <Calendar className="h-5 w-5" />
                Add to Calendar
              </button>

              <Link
                href={`/bookings/${booking.id}`}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
              >
                View Booking Details
              </Link>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+919876543210"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
            >
              <Phone className="h-5 w-5" />
              Call Support
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
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
      <ConfirmationContent />
    </Suspense>
  );
}
