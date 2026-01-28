'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Quote {
  id: string;
  leadId: string;
  pickup: { name: string; address: string };
  drop: { name: string; address: string };
  requestedDatetime: Date;
  passengersCount: number;
  vehicleType: string;
  quotedAmount: number;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'converted';
  sentAt: Date;
  customerPhone: string;
}

// Mock data
const mockQuotes: Quote[] = [
  {
    id: 'Q001',
    leadId: 'L001',
    pickup: { name: 'Rewa', address: 'Near City Mall, Rewa' },
    drop: { name: 'Prayagraj', address: 'Allahabad Junction' },
    requestedDatetime: new Date('2024-02-15T08:00:00'),
    passengersCount: 3,
    vehicleType: 'SUV',
    quotedAmount: 3500,
    validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    status: 'pending',
    sentAt: new Date(Date.now() - 1000 * 60 * 30),
    customerPhone: '98765xxxxx',
  },
  {
    id: 'Q002',
    leadId: 'L002',
    pickup: { name: 'Rewa', address: 'Bus Stand' },
    drop: { name: 'Satna', address: 'Railway Station' },
    requestedDatetime: new Date('2024-02-14T10:00:00'),
    passengersCount: 2,
    vehicleType: 'Sedan',
    quotedAmount: 1200,
    validUntil: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'accepted',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    customerPhone: '98765xxxxx',
  },
  {
    id: 'Q003',
    leadId: 'L003',
    pickup: { name: 'Rewa', address: 'Medical College' },
    drop: { name: 'Varanasi', address: 'BHU Gate' },
    requestedDatetime: new Date('2024-02-16T06:00:00'),
    passengersCount: 4,
    vehicleType: 'SUV',
    quotedAmount: 4500,
    validUntil: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'expired',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    customerPhone: '98765xxxxx',
  },
  {
    id: 'Q004',
    leadId: 'L004',
    pickup: { name: 'Rewa', address: 'Railway Station' },
    drop: { name: 'Jabalpur', address: 'Airport' },
    requestedDatetime: new Date('2024-02-17T14:00:00'),
    passengersCount: 2,
    vehicleType: 'Sedan',
    quotedAmount: 5000,
    validUntil: new Date(Date.now() + 1000 * 60 * 60 * 12),
    status: 'converted',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    customerPhone: '98765xxxxx',
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700', icon: Clock },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function QuotesPage() {
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes =
    statusFilter === 'all'
      ? quotes
      : quotes.filter((q) => q.status === statusFilter);

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
    converted: quotes.filter((q) => q.status === 'converted').length,
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-500 mt-1">Manage your sent quotes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Quotes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Accepted</p>
          <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotes..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'pending', 'accepted', 'converted', 'expired'].map((f) => (
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
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="h-5 w-5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Quotes table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quote ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Travel Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusConfig[quote.status].icon;
              return (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {quote.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.pickup.name} → {quote.drop.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {quote.passengersCount} passengers • {quote.vehicleType}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {format(quote.requestedDatetime, 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <IndianRupee className="h-4 w-4" />
                      {quote.quotedAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[quote.status].color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[quote.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(quote.sentAt, { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {quote.status === 'pending' && (
                        <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                          <Send className="h-4 w-4" />
                          Resend
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-4">
          <p className="text-gray-500">No quotes found</p>
        </div>
      )}
    </div>
  );
}
