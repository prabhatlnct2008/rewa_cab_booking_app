'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Shield, RefreshCw, CheckCircle } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const rideId = searchParams.get('rideId');
  const seats = searchParams.get('seats');

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer
  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, resendTimer]);

  const handleSendOtp = async () => {
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setResendTimer(30);
      setLoading(false);
      // Focus first OTP input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    handleSendOtp();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((d) => d) && index === 5) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      verifyOtp(pastedData);
    }
  };

  const verifyOtp = async (otpCode: string) => {
    setVerifying(true);
    setError('');

    // Simulate verification
    setTimeout(() => {
      // For demo, accept any 6-digit OTP
      if (otpCode.length === 6) {
        // Redirect to payment
        router.push(`/payment/${bookingId}?rideId=${rideId}&seats=${seats}`);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <Link
              href={`/book/${rideId}?seats=${seats}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              Verify Mobile
            </h1>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {['Details', 'Verify', 'Pay', 'Confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= 1
                      ? index === 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index === 0 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:inline ${
                    index === 1 ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
                {index < 3 && <div className="w-8 sm:w-16 h-px bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="h-8 w-8 text-primary-600" />
          </div>

          {!otpSent ? (
            <>
              {/* Phone Input */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verify your mobile number
                </h2>
                <p className="text-gray-500">
                  We'll send a 6-digit OTP to confirm your identity
                </p>
              </div>

              <div className="mb-6">
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
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setError('');
                    }}
                    placeholder="98765 43210"
                    className={`w-full pl-14 pr-4 py-4 border rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    autoFocus
                  />
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-500">
                  We've sent a 6-digit code to{' '}
                  <span className="font-medium text-gray-900">+91 {phone}</span>
                </p>
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
                >
                  Change number
                </button>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={verifying}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center mb-4">{error}</p>
              )}

              {verifying && (
                <div className="flex items-center justify-center gap-2 text-primary-600 mb-4">
                  <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-gray-500">
                    Resend OTP in <span className="font-medium">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium mx-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Privacy Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-sm text-gray-500">
              <Shield className="h-5 w-5 text-gray-400 shrink-0" />
              <p>
                We use your mobile number only for booking updates and will never
                share it with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Didn't receive the OTP?{' '}
          <a href="tel:+919876543210" className="text-primary-600 hover:underline">
            Call support
          </a>
        </p>
      </main>
    </div>
  );
}

export default function VerifyPage() {
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
      <VerifyContent />
    </Suspense>
  );
}
