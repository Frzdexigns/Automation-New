import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Product } from '../types';
import { Loader } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const addToCart = useCartStore(state => state.addToCart);
  const user = useAuthStore(state => state.user);
  
  const handleAddToCart = (product: Product) => {
    // For problem_user, adding to cart is buggy
    if (user?.type === 'problem') {
      if (Math.random() > 0.3) {
        addToCart(product);
      }
    } else {
      addToCart(product);
    }

     // Update quantity for the specific product
     setCartQuantities(prevQuantities => ({
      ...prevQuantities,
      [product.id]: (prevQuantities[product.id] || 0) + 1
    }));

  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="mt-1 text-gray-600 text-sm line-clamp-2">{product.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-emerald-600 font-bold">${product.price.toFixed(2)}</span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
                
                {/* Quantity Indicator */}
                {cartQuantities[product.id] && (
                  <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {cartQuantities[product.id]}
                  </span>
                )}
              </div>
                
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;