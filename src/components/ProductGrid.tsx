import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/api';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import { Loader } from 'lucide-react';
import { useAuthStore } from "../store/authStore";

const getDelay = () => {
  const user = useAuthStore.getState().user;
  return user?.type === "performance_glitch" ? 2000 : 0;
};

const ProductGrid: React.FC = () => {
  const delay = getDelay(); // Get the delay time

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay)); // Apply delay before fetching
      return fetchProducts();
    },
  });

  const addToCart = useCartStore(state => state.addToCart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const items = useCartStore(state => state.items) || [];
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products?.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {}) || {}
  );  
  const [sortOption, setSortOption] = useState('hilo'); // Default: Price (high to low)

  const handleIncrease = (productId: number, stock: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.min(stock, (prev[productId] || 0) + 1)
    }));
  };

  const handleDecrease = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1) // Allow 0
    }));
  };
  

  const handleAddToCart = async (product: Product) => {
    const delay = getDelay(); // Get the delay time
    console.log(Applied Delay: ${delay}ms); // Debugging
  
    await new Promise((resolve) => setTimeout(resolve, delay)); // Apply delay
  
    const quantity = quantities[product.id] || 0;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };
  
  const handleRemoveFromCart = (product: Product) => {
    removeFromCart(product.id); // Remove the product from cart
    
    // Reset quantity display to 0
    setQuantities(prev => ({
      ...prev,
      [product.id]: 0 // Set the removed product's quantity to 0
    }));
  };
  

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortedProducts = products ? [...products].sort((a, b) => {
    if (sortOption === 'az') return a.name.localeCompare(b.name);
    if (sortOption === 'za') return b.name.localeCompare(a.name);
    if (sortOption === 'lohi') return a.price - b.price;
    if (sortOption === 'hilo') return b.price - a.price;
    return 0;
  }) : [];

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
    <div>
      {/* Header Section with Filters */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-4">
        <span className="text-xl font-semibold">Products</span>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-gray-600 text-sm">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="az">Name (A to Z)</option>
            <option value="za">Name (Z to A)</option>
            <option value="lohi">Price (Low to High)</option>
            <option value="hilo">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => {
          const isInCart = items.some(item => item.id === product.id);
          return (
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
                  <span className="text-emerald-600 font-bold">£{product.price.toFixed(2)}</span>

                  <div className="flex items-center space-x-2">
                    {/* Decrease Button */}
                    <button
                      onClick={() => handleDecrease(product.id)}
                      className="bg-gray-200 px-2 py-1 rounded-lg text-black hover:bg-gray-300 transition text-xs"
                    >
                      <strong>-</strong>
                    </button>

                    {/* Quantity Display */}
                    <span className="px-1 text-lg font-semibold">{quantities[product.id] || 0}</span>

                    {/* Increase Button */}
                    <button
                      onClick={() => handleIncrease(product.id, product.stock)}
                      disabled={(quantities[product.id] || 0) >= product.stock}
                      className="bg-gray-200 px-2 py-1 rounded-lg text-black hover:bg-gray-300 transition text-xs disabled:opacity-50"
                    >
                      <strong>+</strong>
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs"
                    >
                      Add
                    </button>

                    {/* Show Remove Button only if product is in cart */}
                    {isInCart && (
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
