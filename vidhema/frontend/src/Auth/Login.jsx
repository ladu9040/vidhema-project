import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Check } from 'lucide-react';
import authService from '../services/authService';
import Header from '../components/Header';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await authService.login(formData);
        console.log(response);
        window.location.href = '/main';
      } catch (e) {
        setErrors(e);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <>
    <Header/>

<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">


            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold mt-8 flex items-center justify-center gap-2"
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
    
    </>

  );
};

export default LoginForm;