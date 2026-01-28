'use client';

import { useState } from 'react';
import { Search, Clock, MapPin, Users, Send, Check } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  pickup: { name: string; address: string };
  drop: { name: string; address: string };
  requestedDatetime: Date;
  passengersCount: number;
  vehiclePreference: string | null;
  notes: string | null;
  status: 'new' | 'accepted' | 'quoted' | 'expired' | 'converted';
  createdAt: Date;
  expiresAt: Date;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    pickup: { name: 'Rewa', address: 'Near City Mall, Rewa' },
    drop: { name: 'Prayagraj', address: 'Allahabad Junction' },
    requestedDatetime: new Date('2024-02-15T08:00:00'),
    passengersCount: 3,
    vehiclePreference: 'SUV',
    notes: 'Need child seat',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
  },
  {
    id: '2',
    pickup: { name: 'Rewa', address: 'Bus Stand' },
    drop: { name: 'Satna', address: 'Railway Station' },
    requestedDatetime: new Date('2024-02-15T10:00:00'),
    passengersCount: 2,
    vehiclePreference: 'Sedan',
    notes: null,
    status: 'accepted',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
  },
  {
    id: '3',
    pickup: { name: 'Rewa', address: 'Medical College' },
    drop: { name: 'Varanasi', address: 'BHU Gate' },
    requestedDatetime: new Date('2024-02-16T06:00:00'),
    passengersCount: 4,
    vehiclePreference: 'SUV',
    notes: 'Early morning, need punctual driver',
    status: 'quoted',
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3),
  },
];

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepted', color: 'bg-yellow-100 text-yellow-700' },
  quoted: { label: 'Quote Sent', color: 'bg-green-100 text-green-700' },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700' },
  converted: { label: 'Converted', color: 'bg-purple-100 text-purple-700' },
};

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads =
    statusFilter === 'all'
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">
            Individual ride requests from customers
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'new', 'accepted', 'quoted'].map((f) => (
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
        </div>
      </div>

      {/* Leads list */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[lead.status].color
                      }`}
                    >
                      {statusConfig[lead.status].label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.pickup.name} → {lead.drop.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-amber-600 text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    Expires in{' '}
                    {formatDistanceToNow(lead.expiresAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pickup</p>
                    <p className="text-sm text-gray-600">{lead.pickup.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Drop</p>
                    <p className="text-sm text-gray-600">{lead.drop.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Requested Time
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(lead.requestedDatetime, 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{lead.passengersCount} passengers</span>
                </div>
                {lead.vehiclePreference && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {lead.vehiclePreference}
                  </span>
                )}
              </div>

              {lead.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Note:</span> {lead.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {lead.status === 'new' && (
                  <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    <Check className="h-4 w-4" />
                    Accept Lead
                  </button>
                )}
                {lead.status === 'accepted' && (
                  <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    <Send className="h-4 w-4" />
                    Send Quote
                  </button>
                )}
                {lead.status === 'quoted' && (
                  <span className="text-sm text-gray-500">
                    Waiting for customer response...
                  </span>
                )}
                <button className="text-primary-600 hover:text-primary-700 font-medium text-sm ml-auto">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">No leads found</p>
        </div>
      )}
    </div>
  );
}
