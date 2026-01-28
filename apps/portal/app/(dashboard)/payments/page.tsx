'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  bookingId: string;
  type: 'booking' | 'refund' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  customerName: string;
  customerPhone: string;
  transactionId: string;
  createdAt: Date;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: 'P001',
    bookingId: 'BK001',
    type: 'booking',
    amount: 850,
    status: 'completed',
    paymentMethod: 'upi',
    customerName: 'Rahul Sharma',
    customerPhone: '98765xxxxx',
    transactionId: 'INST_TXN_12345678',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'P002',
    bookingId: 'BK002',
    type: 'booking',
    amount: 3500,
    status: 'completed',
    paymentMethod: 'card',
    customerName: 'Priya Singh',
    customerPhone: '98765xxxxx',
    transactionId: 'INST_TXN_12345679',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'P003',
    bookingId: 'BK003',
    type: 'refund',
    amount: 500,
    status: 'processing',
    paymentMethod: 'upi',
    customerName: 'Amit Patel',
    customerPhone: '98765xxxxx',
    transactionId: 'INST_TXN_12345680',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: 'P004',
    bookingId: 'BK004',
    type: 'booking',
    amount: 1200,
    status: 'failed',
    paymentMethod: 'netbanking',
    customerName: 'Vikram Yadav',
    customerPhone: '98765xxxxx',
    transactionId: 'INST_TXN_12345681',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 'P005',
    bookingId: 'BK005',
    type: 'payout',
    amount: 2800,
    status: 'completed',
    paymentMethod: 'upi',
    customerName: 'Agency Payout',
    customerPhone: 'N/A',
    transactionId: 'PAYOUT_12345682',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const typeConfig = {
  booking: { label: 'Booking', color: 'text-green-600', icon: ArrowDownRight },
  refund: { label: 'Refund', color: 'text-red-600', icon: ArrowUpRight },
  payout: { label: 'Payout', color: 'text-blue-600', icon: ArrowUpRight },
};

const paymentMethodLabels = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
};

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredPayments =
    typeFilter === 'all'
      ? payments
      : payments.filter((p) => p.type === typeFilter);

  // Calculate stats
  const todayPayments = payments.filter(
    (p) => p.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  const stats = {
    totalReceived: payments
      .filter((p) => p.type === 'booking' && p.status === 'completed')
      .reduce((acc, p) => acc + p.amount, 0),
    totalRefunds: payments
      .filter((p) => p.type === 'refund')
      .reduce((acc, p) => acc + p.amount, 0),
    totalPayouts: payments
      .filter((p) => p.type === 'payout' && p.status === 'completed')
      .reduce((acc, p) => acc + p.amount, 0),
    todayTotal: todayPayments
      .filter((p) => p.type === 'booking' && p.status === 'completed')
      .reduce((acc, p) => acc + p.amount, 0),
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Track all transactions and payouts</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">
          <Download className="h-5 w-5" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Today's Collection</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-gray-900" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.todayTotal.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Received</p>
            <ArrowDownRight className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-gray-900" />
            <p className="text-2xl font-bold text-green-600">
              {stats.totalReceived.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Refunds</p>
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-gray-900" />
            <p className="text-2xl font-bold text-red-600">
              {stats.totalRefunds.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Agency Payouts</p>
            <ArrowUpRight className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-gray-900" />
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalPayouts.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction ID, booking ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'booking', 'refund', 'payout'].map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  typeFilter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="h-5 w-5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const StatusIcon = statusConfig[payment.status].icon;
              const TypeIcon = typeConfig[payment.type].icon;
              return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.id}</p>
                      <p className="text-xs text-gray-500">{payment.transactionId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        typeConfig[payment.type].color
                      }`}
                    >
                      <TypeIcon className="h-4 w-4" />
                      {typeConfig[payment.type].label}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <IndianRupee className="h-4 w-4" />
                      {payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {paymentMethodLabels[payment.paymentMethod]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.customerName}
                      </p>
                      <p className="text-xs text-gray-500">{payment.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[payment.status].color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[payment.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(payment.createdAt, 'MMM dd, hh:mm a')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
          <p className="text-gray-500">No payments found</p>
        </div>
      )}
    </div>
  );
}
