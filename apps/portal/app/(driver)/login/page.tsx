'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Shield, ArrowRight } from 'lucide-react';

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return;
    setLoading(true);
    // In real app: Call API to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setTimer(30);
      setLoading(false);
    }, 500);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '').slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    setLoading(true);
    // In real app: Verify OTP with backend
    setTimeout(() => {
      setLoading(false);
      router.push('/driver/trips');
    }, 500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    // In real app: Resend OTP
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary-600">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">RewaCab Driver</h1>
          <p className="text-primary-200 mt-1">Login to manage your trips</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {!otpSent ? (
            <>
              {/* Phone Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-500 border-r border-gray-300 pr-3">
                      +91
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                    placeholder="98765 43210"
                    className="w-full pl-28 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your registered mobile number
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={phone.length !== 10 || loading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Verify OTP
                </h2>
                <p className="text-gray-500 mt-1">
                  Enter the 6-digit code sent to +91 {phone}
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      digit
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={!isOtpComplete || loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-500">Resend code in {timer}s</p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp(['', '', '', '', '', '']);
                }}
                className="w-full text-gray-500 hover:text-gray-700 py-2 mt-2 font-medium"
              >
                Change Number
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-primary-200 mt-6 text-sm">
          Need help? Contact{' '}
          <a href="tel:+919876543210" className="text-white underline">
            +91 98765 43210
          </a>
        </p>
      </div>
    </div>
  );
}
