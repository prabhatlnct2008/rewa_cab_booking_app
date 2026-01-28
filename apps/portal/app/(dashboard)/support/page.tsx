'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  X,
  Send,
  RefreshCcw,
  DollarSign,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketCategory =
  | 'booking_issue'
  | 'payment_issue'
  | 'refund_request'
  | 'driver_complaint'
  | 'general_inquiry';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  booking?: {
    id: string;
    bookingNumber: string;
    amount: number;
  };
  messages: {
    id: string;
    sender: 'customer' | 'support';
    message: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-00156',
    subject: 'Driver did not show up',
    description:
      'I had a booking for 10 AM but the driver never arrived. I had to book another cab and missed my meeting.',
    category: 'driver_complaint',
    status: 'open',
    priority: 'high',
    customer: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
    },
    booking: {
      id: 'BK-001',
      bookingNumber: 'RWC-2024-00123',
      amount: 800,
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        message:
          'I had a booking for 10 AM but the driver never arrived. I had to book another cab and missed my meeting.',
        timestamp: new Date('2024-02-15T10:30:00'),
      },
    ],
    createdAt: new Date('2024-02-15T10:30:00'),
    updatedAt: new Date('2024-02-15T10:30:00'),
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-00155',
    subject: 'Refund not received',
    description:
      'I cancelled my booking 3 days ago but haven\'t received my refund yet. Please help.',
    category: 'refund_request',
    status: 'in_progress',
    priority: 'medium',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
    },
    booking: {
      id: 'BK-002',
      bookingNumber: 'RWC-2024-00118',
      amount: 450,
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        message:
          'I cancelled my booking 3 days ago but haven\'t received my refund yet.',
        timestamp: new Date('2024-02-14T14:00:00'),
      },
      {
        id: 'm2',
        sender: 'support',
        message:
          'Hi Priya, we apologize for the delay. We\'re checking with our payments team and will update you shortly.',
        timestamp: new Date('2024-02-14T15:30:00'),
      },
    ],
    createdAt: new Date('2024-02-14T14:00:00'),
    updatedAt: new Date('2024-02-14T15:30:00'),
    assignedTo: 'Support Agent 1',
  },
  {
    id: '3',
    ticketNumber: 'TKT-2024-00154',
    subject: 'Payment failed but amount deducted',
    description:
      'My payment failed during booking but the amount was deducted from my account.',
    category: 'payment_issue',
    status: 'resolved',
    priority: 'high',
    customer: {
      name: 'Amit Singh',
      phone: '+91 76543 21098',
      email: 'amit@example.com',
    },
    booking: {
      id: 'BK-003',
      bookingNumber: 'RWC-2024-00095',
      amount: 1200,
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        message:
          'My payment failed during booking but the amount was deducted from my account.',
        timestamp: new Date('2024-02-13T09:00:00'),
      },
      {
        id: 'm2',
        sender: 'support',
        message:
          'Hi Amit, we\'ve verified the payment status. The amount has been refunded to your original payment method. It should reflect within 3-5 business days.',
        timestamp: new Date('2024-02-13T11:00:00'),
      },
      {
        id: 'm3',
        sender: 'customer',
        message: 'Thank you! I received the refund.',
        timestamp: new Date('2024-02-14T10:00:00'),
      },
    ],
    createdAt: new Date('2024-02-13T09:00:00'),
    updatedAt: new Date('2024-02-14T10:00:00'),
    assignedTo: 'Support Agent 2',
  },
  {
    id: '4',
    ticketNumber: 'TKT-2024-00153',
    subject: 'How to change pickup location?',
    description: 'I need to change the pickup location for my upcoming booking.',
    category: 'general_inquiry',
    status: 'closed',
    priority: 'low',
    customer: {
      name: 'Neha Gupta',
      phone: '+91 65432 10987',
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        message: 'How can I change the pickup location for my booking?',
        timestamp: new Date('2024-02-12T16:00:00'),
      },
      {
        id: 'm2',
        sender: 'support',
        message:
          'Hi Neha, you can change your pickup location by going to My Bookings > Select your booking > Edit Details. If you face any issues, let us know.',
        timestamp: new Date('2024-02-12T16:30:00'),
      },
    ],
    createdAt: new Date('2024-02-12T16:00:00'),
    updatedAt: new Date('2024-02-12T16:30:00'),
  },
];

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  open: { label: 'Open', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

const categoryLabels: Record<TicketCategory, string> = {
  booking_issue: 'Booking Issue',
  payment_issue: 'Payment Issue',
  refund_request: 'Refund Request',
  driver_complaint: 'Driver Complaint',
  general_inquiry: 'General Inquiry',
};

export default function SupportPage() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || ticket.category === categoryFilter;
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.phone.includes(searchQuery);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Tickets List */}
      <div className={`${selectedTicket ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
        {/* Page header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Support Tickets
              </h1>
              <p className="text-gray-500 mt-1">
                Manage customer queries and disputes
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-gray-600">
                  {tickets.filter((t) => t.status === 'open').length} Open
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-gray-600">
                  {tickets.filter((t) => t.status === 'in_progress').length} In
                  Progress
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="booking_issue">Booking Issue</option>
              <option value="payment_issue">Payment Issue</option>
              <option value="refund_request">Refund Request</option>
              <option value="driver_complaint">Driver Complaint</option>
              <option value="general_inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        {/* Tickets list */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                  selectedTicket?.id === ticket.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-600">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        priorityConfig[ticket.priority].color
                      }`}
                    >
                      {priorityConfig[ticket.priority].label}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusConfig[ticket.status].color
                    }`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[ticket.status].label}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                  {ticket.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {ticket.customer.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(ticket.createdAt, 'MMM dd, hh:mm a')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Detail Panel */}
      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

function TicketDetailPanel({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const StatusIcon = statusConfig[ticket.status].icon;

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    // In real app: Call API to send reply
    setReplyText('');
  };

  return (
    <div className="w-1/2 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">{ticket.ticketNumber}</h2>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                statusConfig[ticket.status].color
              }`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig[ticket.status].label}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {categoryLabels[ticket.category]}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Customer Info */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{ticket.customer.name}</p>
              <p className="text-sm text-gray-500">{ticket.customer.phone}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${ticket.customer.phone}`}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
              >
                <Phone className="h-4 w-4" />
              </a>
              {ticket.customer.email && (
                <a
                  href={`mailto:${ticket.customer.email}`}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related Booking */}
        {ticket.booking && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Related Booking
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-600">
                  {ticket.booking.bookingNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Amount: ₹{ticket.booking.amount}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Conversation
          </h3>
          <div className="space-y-4">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'support' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.sender === 'support'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'support'
                        ? 'text-primary-200'
                        : 'text-gray-400'
                    }`}
                  >
                    {format(message.timestamp, 'MMM dd, hh:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <select className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Change Status</option>
            <option value="in_progress">Mark In Progress</option>
            <option value="resolved">Mark Resolved</option>
            <option value="closed">Close Ticket</option>
          </select>
          {ticket.booking && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition text-sm"
            >
              <RefreshCcw className="h-4 w-4" />
              Process Refund
            </button>
          )}
        </div>

        {/* Reply Input */}
        <div className="flex items-end gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={2}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim()}
            className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && ticket.booking && (
        <RefundModal
          booking={ticket.booking}
          onClose={() => setShowRefundModal(false)}
        />
      )}
    </div>
  );
}

function RefundModal({
  booking,
  onClose,
}: {
  booking: { id: string; bookingNumber: string; amount: number };
  onClose: () => void;
}) {
  const [refundAmount, setRefundAmount] = useState(booking.amount);
  const [refundReason, setRefundReason] = useState('');

  const handleProcessRefund = () => {
    // In real app: Call API to process refund
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Process Refund
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Booking</p>
              <p className="font-medium text-gray-900">{booking.bookingNumber}</p>
              <p className="text-sm text-gray-600 mt-1">
                Original Amount: ₹{booking.amount}
              </p>
            </div>

            {/* Refund Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Refund Amount (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  max={booking.amount}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum refundable: ₹{booking.amount}
              </p>
            </div>

            {/* Refund Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason for Refund
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select reason</option>
                <option value="customer_cancellation">
                  Customer Cancellation
                </option>
                <option value="driver_no_show">Driver No Show</option>
                <option value="service_issue">Service Issue</option>
                <option value="duplicate_payment">Duplicate Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                This action will initiate a refund to the customer&apos;s original
                payment method. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessRefund}
              disabled={!refundReason || refundAmount <= 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="h-4 w-4" />
              Process Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
