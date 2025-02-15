import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import authService from '../services/authService';
import { useSearchParams } from 'react-router-dom';

const Update_Password = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '', 
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(()=>{
    if(!token){
      console.log("reset token is missing");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check passwords match while typing
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'newPassword' && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmPassword' && value !== formData.newPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};


    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setStatus({ type: '', message: '' });

      try {
        await authService.resetPassword(  formData.newPassword, token,);
        setStatus({
          type: 'success',
          message: 'Password updated successfully!'
        });
        setFormData({
        
          newPassword: '',
    
        });
        
      } catch (error) {
        setStatus({
          type: 'error',
          message: error.message || 'Failed to update password. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  
   
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Update Password</h2>
          <p className="text-gray-500 mt-2">Enter your current password and choose a new one</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300`}
                placeholder="Enter new password"
              />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300`}
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
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
            className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Updating...</span>
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update_Password;