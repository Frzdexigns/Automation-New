import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/api';
import { useCartStore } from '../store/cartStore';
import Header from '../components/Header';
import CartPanel from '../components/CartPanel';
import { ArrowLeft } from 'lucide-react';

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const product = products?.find(p => p.id === Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleCart={() => setIsCartOpen(!isCartOpen)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-96 w-full object-cover md:h-full"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="p-8 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-emerald-600 font-bold mb-4">
                £{product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-8">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">
                  Stock: {product.stock} units
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductView;