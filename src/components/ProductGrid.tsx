import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/api';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import { Loader } from 'lucide-react';
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom';

const getDelay = () => {
  const user = useAuthStore.getState().user;
  return user?.type === "performance_glitch" ? 2000 : 0;
};

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const delay = getDelay();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchProducts();
    },
  });

  const addToCart = useCartStore(state => state.addToCart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const items = useCartStore(state => state.items) || [];
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products?.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {}) || {}
  );  
  const [sortOption, setSortOption] = useState('hilo');

  const handleIncrease = (productId: number, stock: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.min(stock, (prev[productId] || 0) + 1)
    }));
  };

  const handleDecrease = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const delay = getDelay();
    console.log(`Applied Delay: ${delay}ms`);
  
    await new Promise((resolve) => setTimeout(resolve, delay));
  
    const quantity = quantities[product.id] || 0;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };
  
  const handleRemoveFromCart = (product: Product) => {
    removeFromCart(product.id);
    setQuantities(prev => ({
      ...prev,
      [product.id]: 0
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const navigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
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
    <div id="product-page">
      <div id="header-section" className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-4">
        <span id="products-title" className="text-xl font-semibold">Products</span>
        <div id="sort-container" className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-gray-600 text-sm">Sort by:</label>
          <select
            id="sort-dropdown"
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
  
      <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => {
          const isInCart = items.some(item => item.id === product.id);
          return (
            <div key={product.id} id={`product-${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                id={`product-image-${product.id}`} 
                className="h-48 overflow-hidden cursor-pointer"
                onClick={() => navigateToProduct(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <div id={`product-info-${product.id}`} className="p-4">
                <h3 
                  id={`product-name-${product.id}`} 
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                  onClick={() => navigateToProduct(product.id)}
                >
                  {product.name}
                </h3>
                <p id={`product-description-${product.id}`} className="mt-1 text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span id={`product-price-${product.id}`} className="text-emerald-600 font-bold">£{product.price.toFixed(2)}</span>
  
                  <div id={`cart-controls-${product.id}`} className="flex items-center space-x-2">
                    <button
                      id={`decrease-btn-${product.id}`}
                      onClick={() => handleDecrease(product.id)}
                      className="bg-gray-200 px-2 py-1 rounded-lg text-black hover:bg-gray-300 transition text-xs"
                    >
                      <strong>-</strong>
                    </button>
  
                    <span id={`product-quantity-${product.id}`} className="px-1 text-lg font-semibold">{quantities[product.id] || 0}</span>
  
                    <button
                      id={`increase-btn-${product.id}`}
                      onClick={() => handleIncrease(product.id, product.stock)}
                      disabled={(quantities[product.id] || 0) >= product.stock}
                      className="bg-gray-200 px-2 py-1 rounded-lg text-black hover:bg-gray-300 transition text-xs disabled:opacity-50"
                    >
                      <strong>+</strong>
                    </button>
  
                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs"
                    >
                      Add
                    </button>
  
                    {isInCart && (
                      <button
                        id={`remove-from-cart-btn-${product.id}`}
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