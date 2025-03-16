import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Header from '../../components/Header';
import { Package, ArrowRight } from 'lucide-react';


interface FormData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

const CheckoutInformation: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    postalCode: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For error_user, some fields can't be edited
    if (user?.type === 'error' && name === 'postalCode') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Store checkout info in session storage
      sessionStorage.setItem('checkoutInfo', JSON.stringify(formData));
      navigate('/checkout/overview');
    }
  };
  
  return (
    <div id="checkoutInformationContainer" className="min-h-screen bg-gray-50">
      <Header toggleCart={() => {}} />
      
      <main id="checkoutMain" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="checkoutTitleContainer" className="mb-8">
          <h1 id="checkoutTitle" className="text-2xl font-bold text-gray-900">Checkout: Your Information</h1>
        </div>
        
        <div id="checkoutFormContainer" className="bg-white shadow-md rounded-lg p-6">
          <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-6">
            <div id="firstNameContainer">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              />
              {errors.firstName && (
                <p id="firstNameError" className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div id="lastNameContainer">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              />
              {errors.lastName && (
                <p id="lastNameError" className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
            
            <div id="postalCodeContainer">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.postalCode ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${user?.type === 'error' ? 'bg-gray-100' : ''}`}
                disabled={user?.type === 'error'}
              />
              {errors.postalCode && (
                <p id="postalCodeError" className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
              )}
              {user?.type === 'error' && (
                <p id="postalCodeWarning" className="mt-1 text-sm text-amber-600"></p>
              )}
            </div>
            
            <div id="checkoutActions" className="flex justify-end">
              <button
                id="continueButton"
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Continue
                <ArrowRight id="continueIcon" className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutInformation;
