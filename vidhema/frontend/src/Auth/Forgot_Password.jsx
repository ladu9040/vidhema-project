import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import authService from '../services/authService';

const Forgot_Password = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

  
    console.log("Email before request:", email);

    if (!email) {
        setStatus({ type: 'error', message: 'Please enter a valid email address.' });
        setIsLoading(false);
        return;
    }

    try {
        await authService.forgotPassword(email);
        setStatus({
            type: 'success',
            message: 'Password reset link has been sent to your email address.'
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        setStatus({
            type: 'error',
            message: error.message || 'There was an error sending the reset link. Please try again.'
        });
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-2">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`p-4 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{' '}
            <a 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Forgot_Password;