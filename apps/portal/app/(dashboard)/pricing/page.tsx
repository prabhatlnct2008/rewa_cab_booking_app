'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Car,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';

type VehicleType = 'hatchback' | 'sedan' | 'suv' | 'tempo_traveller';

interface PricingRule {
  id: string;
  name: string;
  fromCity: string;
  toCity: string;
  basePrice: number;
  perKmRate: number;
  vehicleMultipliers: Record<VehicleType, number>;
  isActive: boolean;
  createdAt: Date;
}

interface HolidayPricing {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  multiplier: number;
  isActive: boolean;
}

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Rewa to Prayagraj',
    fromCity: 'Rewa',
    toCity: 'Prayagraj',
    basePrice: 300,
    perKmRate: 12,
    vehicleMultipliers: {
      hatchback: 1.0,
      sedan: 1.2,
      suv: 1.5,
      tempo_traveller: 2.0,
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Rewa to Satna',
    fromCity: 'Rewa',
    toCity: 'Satna',
    basePrice: 150,
    perKmRate: 10,
    vehicleMultipliers: {
      hatchback: 1.0,
      sedan: 1.2,
      suv: 1.5,
      tempo_traveller: 2.0,
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Rewa to Varanasi',
    fromCity: 'Rewa',
    toCity: 'Varanasi',
    basePrice: 400,
    perKmRate: 13,
    vehicleMultipliers: {
      hatchback: 1.0,
      sedan: 1.25,
      suv: 1.6,
      tempo_traveller: 2.2,
    },
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Rewa to Jabalpur',
    fromCity: 'Rewa',
    toCity: 'Jabalpur',
    basePrice: 350,
    perKmRate: 11,
    vehicleMultipliers: {
      hatchback: 1.0,
      sedan: 1.2,
      suv: 1.5,
      tempo_traveller: 2.0,
    },
    isActive: false,
    createdAt: new Date('2024-01-25'),
  },
];

const mockHolidayPricing: HolidayPricing[] = [
  {
    id: '1',
    name: 'Diwali 2024',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-05'),
    multiplier: 1.5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Holi 2024',
    startDate: new Date('2024-03-24'),
    endDate: new Date('2024-03-26'),
    multiplier: 1.3,
    isActive: true,
  },
  {
    id: '3',
    name: 'New Year 2025',
    startDate: new Date('2024-12-31'),
    endDate: new Date('2025-01-02'),
    multiplier: 1.4,
    isActive: false,
  },
];

const vehicleLabels: Record<VehicleType, string> = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV',
  tempo_traveller: 'Tempo Traveller',
};

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'holidays'>('routes');
  const [pricingRules] = useState<PricingRule[]>(mockPricingRules);
  const [holidayPricing] = useState<HolidayPricing[]>(mockHolidayPricing);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = pricingRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.toCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowModal(true);
  };

  const handleEditRule = (rule: PricingRule) => {
    setEditingRule(rule);
    setShowModal(true);
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Rules</h1>
          <p className="text-gray-500 mt-1">
            Manage route pricing and holiday surcharges
          </p>
        </div>
        <button
          onClick={handleCreateRule}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus className="h-5 w-5" />
          Add Pricing Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'routes'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Route Pricing
              </div>
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'holidays'
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Holiday/Peak Pricing
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'routes' && (
          <>
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Route pricing table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Base Price
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Per KM
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Vehicle Multipliers
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {rule.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {rule.fromCity} → {rule.toCity}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          ₹{rule.basePrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          ₹{rule.perKmRate}/km
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(rule.vehicleMultipliers).map(
                            ([type, multiplier]) => (
                              <span
                                key={type}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {vehicleLabels[type as VehicleType]}:{' '}
                                {multiplier}x
                              </span>
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'holidays' && (
          <>
            {/* Holiday pricing info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Holiday/Peak Pricing
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Set multipliers for peak travel periods. These will be
                    applied on top of route base prices during the specified
                    dates.
                  </p>
                </div>
              </div>
            </div>

            {/* Holiday pricing table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Period Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Start Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      End Date
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Multiplier
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holidayPricing.map((holiday) => (
                    <tr
                      key={holiday.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-orange-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {holiday.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {holiday.startDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {holiday.endDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                          <Percent className="h-3 w-3 mr-1" />
                          {holiday.multiplier}x
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            holiday.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {holiday.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add holiday button */}
            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                <Plus className="h-5 w-5" />
                Add Holiday/Peak Period
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pricing Rule Modal */}
      {showModal && (
        <PricingRuleModal
          rule={editingRule}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function PricingRuleModal({
  rule,
  onClose,
  onSave,
}: {
  rule: PricingRule | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    fromCity: rule?.fromCity || '',
    toCity: rule?.toCity || '',
    basePrice: rule?.basePrice || 0,
    perKmRate: rule?.perKmRate || 10,
    hatchbackMultiplier: rule?.vehicleMultipliers.hatchback || 1.0,
    sedanMultiplier: rule?.vehicleMultipliers.sedan || 1.2,
    suvMultiplier: rule?.vehicleMultipliers.suv || 1.5,
    tempoMultiplier: rule?.vehicleMultipliers.tempo_traveller || 2.0,
    isActive: rule?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: Call API to save
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Modal header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {rule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Route info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Rewa to Prayagraj"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    From City
                  </label>
                  <input
                    type="text"
                    value={formData.fromCity}
                    onChange={(e) =>
                      setFormData({ ...formData, fromCity: e.target.value })
                    }
                    placeholder="e.g., Rewa"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    To City
                  </label>
                  <input
                    type="text"
                    value={formData.toCity}
                    onChange={(e) =>
                      setFormData({ ...formData, toCity: e.target.value })
                    }
                    placeholder="e.g., Prayagraj"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Base Price (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basePrice: Number(e.target.value),
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Per KM Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.perKmRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perKmRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Vehicle multipliers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vehicle Type Multipliers
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">
                      Hatchback
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hatchbackMultiplier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hatchbackMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">x</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">Sedan</span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sedanMultiplier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sedanMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">x</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">SUV</span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.suvMultiplier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          suvMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">x</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">
                      Tempo Traveller
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tempoMultiplier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tempoMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
              >
                <Check className="h-4 w-4" />
                {rule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
