import React from 'react';
import { X, Home, Info, LogOut, RefreshCw, Package, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logout = useAuthStore(state => state.logout);
  const clearCart = useCartStore(state => state.clearCart);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleResetStore = () => {
    clearCart();
    onClose();
  };

  const navigateTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      
      <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-2">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigateTo('/')}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Home className="h-5 w-5 mr-3" />
                    <span>Home (All Items)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('/admin')}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Package className="h-5 w-5 mr-3" />
                    <span>Product Manager</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleResetStore}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <RefreshCw className="h-5 w-5 mr-3" />
                    <span>Reset Store</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;