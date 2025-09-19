/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { ShoppingCart, UserCircle, LogOut, Search } from 'lucide-react';

const Header = ({ user, onLoginClick, onLogoutClick, onNavigate, currentPage, searchTerm, onSearchChange, cartCount }) => {
  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Shopping Hub</span>
            </button>
          </div>

          <div className="flex-1 flex justify-center px-4">
            {currentPage === 'home' && (
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out shadow-sm focus:shadow-md"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  aria-label="Search for products"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors" aria-label={`View cart with ${cartCount} items`}>
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white text-xs font-medium ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <>
                 { user.role === 'customer' &&
                    <button onClick={() => onNavigate('profile')} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        My Orders
                    </button>
                 }
                 { (user.role === 'admin' || user.role === 'shopkeeper') &&
                    <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Dashboard
                    </button>
                 }
                <div className="flex items-center gap-2">
                    <UserCircle className="text-gray-500"/>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button onClick={onLogoutClick} aria-label="Logout">
                  <LogOut className="h-6 w-6 text-gray-500 hover:text-gray-800" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;