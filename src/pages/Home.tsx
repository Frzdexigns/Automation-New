import React, { useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import CartPanel from '../components/CartPanel';

const Home: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleCart={toggleCart} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        
        <ProductGrid />
      </main>
      
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Home;