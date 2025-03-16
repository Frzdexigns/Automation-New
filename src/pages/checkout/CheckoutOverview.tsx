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
    <div id="checkoutOverviewContainer" className="min-h-screen bg-gray-50">
      <Header toggleCart={() => {}} />
      
      <main id="checkoutOverviewMain" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="checkoutOverviewTitleContainer" className="mb-8">
          <h1 id="checkoutOverviewTitle" className="text-2xl font-bold text-gray-900">Checkout: Overview</h1>
        </div>
        
        <div id="checkoutOverviewContent" className="bg-white shadow-md rounded-lg overflow-hidden">
          <div id="shippingInfoContainer" className="p-6 border-b border-gray-200">
            <h2 id="shippingInfoTitle" className="text-lg font-medium text-gray-900">Shipping Information</h2>
            <div id="shippingInfoDetails" className="mt-4">
              <p id="shippingName" className="text-gray-700">
                {checkoutInfo.firstName} {checkoutInfo.lastName}
              </p>
              <p id="shippingPostalCode" className="text-gray-700">Postal Code: {checkoutInfo.postalCode}</p>
            </div>
          </div>
          
          <div id="orderSummaryContainer" className="p-6 border-b border-gray-200">
            <h2 id="orderSummaryTitle" className="text-lg font-medium text-gray-900">Order Summary</h2>
            <ul id="orderSummaryList" className="mt-4 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} id={`orderItem-${item.id}`} className="py-3 flex justify-between">
                  <div id={`orderItemDetails-${item.id}`} className="flex items-center">
                    <span id={`orderItemName-${item.id}`} className="text-gray-700">{item.name}</span>
                    <span id={`orderItemQuantity-${item.id}`} className="ml-2 text-gray-500">x{item.quantity}</span>
                  </div>
                  <span id={`orderItemPrice-${item.id}`} className="text-gray-900">£{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div id="checkoutTotalContainer" className="p-6">
            <div id="checkoutTotal" className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p id="totalLabel">Total</p>
              <p id="totalAmount">£{getTotalPrice().toFixed(2)}</p>
            </div>
            
            <div id="checkoutActions" className="flex justify-end">
              <button
                id="completeOrderButton"
                onClick={handleFinish}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${user?.type === 'problem' ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Complete Order
                <CheckCircle id="completeOrderIcon" className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

};

export default CheckoutOverview;
