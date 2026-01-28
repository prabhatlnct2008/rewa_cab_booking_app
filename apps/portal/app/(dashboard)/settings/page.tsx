'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Settings2,
  Save,
} from 'lucide-react';

type SettingsTab = 'profile' | 'business' | 'notifications' | 'security' | 'billing';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'business' && <BusinessSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'billing' && <BillingSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-2xl">MS</span>
          </div>
          <div>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition">
              Change Photo
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            defaultValue="Mohan Sharma"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            defaultValue="+91 98765 43210"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="mohan@rewacabs.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            defaultValue="Agency Owner"
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function BusinessSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            defaultValue="Rewa Cab Services"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
          <input
            type="text"
            defaultValue="23AABCU9603R1ZM"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
          <input
            type="text"
            defaultValue="AABCU9603R"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Address
          </label>
          <textarea
            rows={3}
            defaultValue="Near Bus Stand, Rewa MP 486001"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNewBooking: true,
    emailBookingCancelled: true,
    emailPaymentReceived: false,
    smsNewBooking: true,
    smsBookingCancelled: true,
    pushNewBooking: true,
    pushBookingCancelled: true,
    pushNewLead: true,
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Notification Preferences
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h3>
          <div className="space-y-3">
            {[
              { key: 'emailNewBooking', label: 'New booking confirmation' },
              { key: 'emailBookingCancelled', label: 'Booking cancellation' },
              { key: 'emailPaymentReceived', label: 'Payment received' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings]}
                  onChange={(e) =>
                    setSettings({ ...settings, [item.key]: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">SMS Notifications</h3>
          <div className="space-y-3">
            {[
              { key: 'smsNewBooking', label: 'New booking confirmation' },
              { key: 'smsBookingCancelled', label: 'Booking cancellation' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings]}
                  onChange={(e) =>
                    setSettings({ ...settings, [item.key]: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Push Notifications</h3>
          <div className="space-y-3">
            {[
              { key: 'pushNewBooking', label: 'New booking' },
              { key: 'pushBookingCancelled', label: 'Booking cancellation' },
              { key: 'pushNewLead', label: 'New lead received' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm text-gray-600">{item.label}</span>
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings]}
                  onChange={(e) =>
                    setSettings({ ...settings, [item.key]: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium transition">
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition">
              Enable
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Active Sessions</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage devices where you're logged in
              </p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-white transition">
              View Sessions
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Login History</h3>
              <p className="text-sm text-gray-500 mt-1">View your recent login activity</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-white transition">
              View History
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Danger Zone</h3>
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600 mt-1">
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payments</h2>

      <div className="space-y-6">
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-primary-700 uppercase">
                Current Plan
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">
                Agency Pro Plan
              </h3>
              <p className="text-sm text-gray-600 mt-1">12% commission per booking</p>
            </div>
            <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium text-sm hover:bg-primary-50 transition">
              Upgrade Plan
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-700">
                  UPI
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">UPI - rewacabs@upi</p>
                  <p className="text-xs text-gray-500">Default payout method</p>
                </div>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Edit
              </button>
            </div>
            <button className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary-500 hover:text-primary-600 transition">
              + Add Payment Method
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">Billing History</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">Jan 15, 2024</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Commission - 45 bookings
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹12,450</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Paid
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600">Dec 15, 2023</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Commission - 38 bookings
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹9,880</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Paid
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
