import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Package, ShoppingCart, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

interface HeaderProps {
  toggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());
  const user = useAuthStore(state => state.user);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" />
              </button>
              
            </div>
            <div className="flex-shrink-0 flex items-center ml-4 ">
                <Package className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Automation Tests</span>
              </div>
            <div className="flex items-center">
              {user?.type === 'problem' ? (
                <button
                  onClick={() => {
                    // For problem_user, the cart button sometimes doesn't work
                    if (Math.random() > 0.5) {
                      toggleCart();
                    }
                  }}
                  className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <span className="sr-only">View cart</span>
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <span className="sr-only">View cart</span>
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
    </>
  );
};

export default Header;