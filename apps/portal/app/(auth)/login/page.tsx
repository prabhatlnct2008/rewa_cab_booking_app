'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call API to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep('otp');
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call API to verify OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800">RewaCab</h1>
          <p className="text-gray-600 mt-2">Admin & Agency Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {step === 'phone' ? 'Sign in to your account' : 'Enter OTP'}
          </h2>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 block w-full rounded-r-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="9876543210"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length !== 10}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="------"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  OTP sent to +91 {phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full mt-3 text-primary-600 hover:text-primary-700 font-medium"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Only authorized admins and agencies can access this portal.
        </p>
      </div>
    </div>
  );
}
