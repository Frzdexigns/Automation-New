import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import Header from '../../components/Header';
import { CheckCircle } from 'lucide-react';

const CheckoutComplete: React.FC = () => {
  const clearCart = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear cart after successful checkout
    clearCart();
    
    // Clear checkout info from session storage
    sessionStorage.removeItem('checkoutInfo');
  }, [clearCart]);
  
  const handleBackToProducts = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleCart={() => {}} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Thank You!</h1>
          <p className="mt-2 text-lg text-gray-600">Your order has been placed successfully.</p>
          
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Order Confirmation</h2>
            <p className="mt-2 text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            
            <div className="mt-6">
              <button
                onClick={handleBackToProducts}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutComplete;