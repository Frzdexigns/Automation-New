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
    <div id="main-container" className="min-h-screen bg-gray-50">
    <Header toggleCart={toggleCart} />
    
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
      <ProductGrid  />
    </main>
    
    <CartPanel  isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
  </div>
  );
};

export default Home;
