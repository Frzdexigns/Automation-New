import React from 'react';
import { useCartStore } from '../store/cartStore';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout/information');
  };

  return (
    <div className={`fixed inset-0 z-20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">£{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-gray-700 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-full text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>£{getTotalPrice().toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;