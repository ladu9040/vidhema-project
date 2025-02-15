import React, { useState } from 'react';
import { User } from 'lucide-react';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';


function UMHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center">
             
              <span className="ml-2 text-xl font-bold text-gray-800"><img src="/vidhema.png" alt="" className='h-14' /></span>
            </div>
          </div>

          <div className="relative">
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={toggleMenu}
            >
              <User className="w-6 h-6 text-gray-600" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={async() => {
                    try {
                      await userService.logout();
                      navigate('/login');
                  } catch (error) {
                      console.error('Logout failed:', error);
                  }
                    console.log('Logging out...');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UMHeader;