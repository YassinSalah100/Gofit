import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleCartClick = () => {
    navigate('/checkout', {
      state: {
        products: [] // In a real app, this would come from cart context/state
      }
    });
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              className="sm:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Creative GOFIT Logo */}
              <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" className="mr-2">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff4b2b" />
                      <stop offset="100%" stopColor="#ff416c" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="white" stroke="url(#logoGradient)" strokeWidth="2.5" />
                  <path d="M14 20 A6 6 0 1 1 26 20 A6 6 0 1 1 14 20" stroke="url(#logoGradient)" strokeWidth="2.5" fill="none" />
                  <path d="M20 12 L20 8" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M20 32 L20 28" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M12 20 L8 20" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M32 20 L28 20" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M17 13 L15 11" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M25 29 L23 27" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 17 L11 15" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M29 25 L27 23" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">GO<span className="text-red-600">FIT</span></span>
                  <span className="text-xs tracking-wider font-medium text-gray-500">FITNESS GEAR</span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link to="/" className="text-gray-900 hover:text-red-600 transition-colors">Home</Link>
            <Link to="/" className="text-gray-900 hover:text-red-600 transition-colors">Shop</Link>
            <Link to="/" className="text-gray-900 hover:text-red-600 transition-colors">Categories</Link>
            <Link to="/" className="text-gray-900 hover:text-red-600 transition-colors">About</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors">
                <Globe className="h-5 w-5" />
                <span className="text-sm">EN</span>
              </button>
            </div>
            <button className="p-2 hover:text-red-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={handleLoginClick}
              className="p-2 hover:text-red-600 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={handleCartClick}
              className="p-2 relative group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:text-red-600 transition-colors" />
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors">Home</Link>
          <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors">Shop</Link>
          <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors">Categories</Link>
          <Link to="/" className="block px-3 py-2 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors">About</Link>
          <button className="flex items-center space-x-1 px-3 py-2 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors">
            <Globe className="h-5 w-5" />
            <span>Language</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;