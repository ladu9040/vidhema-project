import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="bg-white shadow-md fixed w-full ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-800"><img src="/vidhema.png" alt=""  className='h-14'/></span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                Home
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                About
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to={"/login"} className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-md border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
              Login
            </Link>
            <Link to={"/signup"} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;