'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'pending';
type TabType = 'upcoming' | 'past' | 'cancelled';

interface Booking {
  id: string;
  bookingNumber: string;
  type: 'group' | 'individual';
  route: {
    fromCity: string;
    toCity: string;
  };
  departureTime: Date;
  seats: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'RWC-2024-00123',
    type: 'group',
    route: { fromCity: 'Rewa', toCity: 'Prayagraj' },
    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    seats: 2,
    totalAmount: 900,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    bookingNumber: 'RWC-2024-00118',
    type: 'group',
    route: { fromCity: 'Rewa', toCity: 'Satna' },
    departureTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    seats: 1,
    totalAmount: 200,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: '3',
    bookingNumber: 'RWC-2024-00095',
    type: 'group',
    route: { fromCity: 'Rewa', toCity: 'Varanasi' },
    departureTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    seats: 3,
    totalAmount: 1800,
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: '4',
    bookingNumber: 'RWC-2024-00082',
    type: 'individual',
    route: { fromCity: 'Rewa', toCity: 'Jabalpur' },
    departureTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    seats: 4,
    totalAmount: 3500,
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: '5',
    bookingNumber: 'RWC-2024-00070',
    type: 'group',
    route: { fromCity: 'Rewa', toCity: 'Prayagraj' },
    departureTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    seats: 1,
    totalAmount: 450,
    status: 'cancelled',
    paymentStatus: 'refunded',
  },
];

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string }
> = {
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // Check if user is already verified (from session/token)
    const verified = localStorage.getItem('user_verified');
    if (verified) {
      setIsVerified(true);
      loadBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const loadBookings = () => {
    setLoading(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  };

  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return;
    setOtpSent(true);
  };

  const handleVerify = () => {
    if (otp.length !== 6) return;
    // Simulate verification
    localStorage.setItem('user_verified', 'true');
    setIsVerified(true);
    loadBookings();
  };

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return (
          booking.status === 'confirmed' && booking.departureTime > now
        );
      case 'past':
        return (
          booking.status === 'completed' ||
          (booking.status === 'confirmed' && booking.departureTime <= now)
        );
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  // Verification Screen
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <div className="flex items-center h-16">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">My Bookings</h1>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-primary-600" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Verify to view bookings
              </h2>
              <p className="text-gray-500">
                Enter the mobile number you used while booking
              </p>
            </div>

            {!otpSent ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="98765 43210"
                      className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Enter OTP sent to +91 {phone}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg text-center tracking-widest focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={otp.length !== 6}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & View Bookings
                </button>

                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full text-primary-600 hover:text-primary-700 py-2 mt-2 font-medium"
                >
                  Change Number
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming trips"
                : activeTab === 'past'
                ? "You don't have any past trips"
                : "You don't have any cancelled bookings"}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Book a Ride
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const isPast = booking.departureTime < new Date();

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">{booking.bookingNumber}</p>
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusConfig[booking.status].color
              }`}
            >
              {statusConfig[booking.status].label}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ₹{booking.totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {booking.route.fromCity} → {booking.route.toCity}
            </p>
            <p className="text-sm text-gray-500">
              {booking.seats} seat{booking.seats > 1 ? 's' : ''} •{' '}
              {booking.type === 'group' ? 'Group Ride' : 'Private Cab'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(booking.departureTime, 'dd MMM yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(booking.departureTime, 'hh:mm a')}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {isPast ? 'Trip completed' : 'Tap to view details'}
        </p>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </Link>
  );
}
