import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <img src={product.image} alt={product.name} width="150" />
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
