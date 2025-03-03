import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Header from '../../components/Header';
import { CheckCircle } from 'lucide-react';
import { CheckoutInfo } from '../../types';

const CheckoutOverview: React.FC = () => {
  const { items, getTotalPrice } = useCartStore();
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  useEffect(() => {
    // Retrieve checkout info from session storage
    const storedInfo = sessionStorage.getItem('checkoutInfo');
    if (storedInfo) {
      setCheckoutInfo(JSON.parse(storedInfo));
    } else {
      // Redirect back to information page if no checkout info
      navigate('/checkout/information');
    }
  }, [navigate]);
  
  const handleFinish = () => {
    // For problem_user, checkout button might not work
    if (user?.type === 'problem' && Math.random() > 0.5) {
      return;
    }
    
    navigate('/checkout/complete');
  };
  
  if (!checkoutInfo) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleCart={() => {}} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout: Overview</h1>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            <div className="mt-4">
              <p className="text-gray-700">
                {checkoutInfo.firstName} {checkoutInfo.lastName}
              </p>
              <p className="text-gray-700">Postal Code: {checkoutInfo.postalCode}</p>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <ul className="mt-4 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="ml-2 text-gray-500">x{item.quantity}</span>
                  </div>
                  <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Total</p>
              <p>${getTotalPrice().toFixed(2)}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleFinish}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${user?.type === 'problem' ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Complete Order
                <CheckCircle className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutOverview;