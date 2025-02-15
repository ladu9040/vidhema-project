import React, { useState } from 'react';
import { User, Mail, Lock, Calendar, Camera } from 'lucide-react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    profile_image: "will be going to add"
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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

    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'password' && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmPassword' && value !== formData.password) {
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

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData(prev => ({
  //       ...prev,
  //       profile_image: file
  //     }));
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleSubmit =async (e) => {
  //   e.preventDefault();
    
  //   if (formData.password !== formData.confirmPassword) {
  //     setErrors(prev => ({
  //       ...prev,
  //       confirmPassword: 'Passwords do not match'
  //     }));
  //     return;
  //   }

  //   const response  = await authService.signup(formData);
  //   console.log(response);
  //   console.log('Form submitted:', formData);
  //  navigate('/login')
  // }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({
            ...prev,
            confirmPassword: 'Passwords do not match'
        }));
        return;
    }

    try {
        const response = await authService.signup(formData);
        console.log('Response:', response);  // Debugging line
        console.log('Form submitted:', formData);
    } catch (error) {
        console.error('Signup Error:', error);  // Catching the error
    }
};


  return (
    <>
    <Header/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join us today and start your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
  

          {/* Name Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">Date of Birth</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
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
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold mt-8 flex items-center justify-center gap-2"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
    </>

  );
};

export default Signup;