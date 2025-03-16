import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../api/api';
import Header from '../components/Header';
import CartPanel from '../components/CartPanel';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  image: '',
  stock: 0
};

const Admin: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) => 
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, updates: formData });
    } else {
      addMutation.mutate(formData);
    }
  };
  
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock
    });
    setEditingId(product.id);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  return (
    <div id="page-container" className="min-h-screen bg-gray-50">
      <Header toggleCart={toggleCart} />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="top-bar" className="flex justify-between items-center mb-8">
          <div id="navigation" className="flex items-center">
            <button 
              id="back-button"
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft id="back-icon" className="h-5 w-5 text-gray-600" />
            </button>
            <h1 id="page-title" className="text-2xl font-bold text-gray-900">Product Manager</h1>
          </div>
          <button
            id="toggle-form-button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {isFormOpen ? (
              <>
                <X id="cancel-icon" className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus id="add-icon" className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </button>
        </div>
        
        {isFormOpen && (
          <div id="product-form-container" className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 id="form-title" className="text-lg font-medium text-gray-900 mb-4">
              {editingId !== null ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
              <div id="name-field">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div id="description-field">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div id="price-stock-image" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div id="price-field">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div id="stock-field">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div id="image-field">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div id="form-buttons" className="flex justify-end">
                <button
                  id="cancel-form-button"
                  type="button"
                  onClick={resetForm}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  id="submit-form-button"
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Save id="save-icon" className="mr-2 h-4 w-4" />
                  {editingId !== null ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        
        <div id="product-table-container" className="bg-white shadow-md rounded-lg overflow-hidden">
          <div id="table-wrapper" className="overflow-x-auto">
            <table id="product-table" className="min-w-full divide-y divide-gray-200">
              <thead id="table-header" className="bg-gray-50">
                <tr id="header-row">
                  <th id="header-product" scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th id="header-description" scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th id="header-price" scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th id="header-stock" scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th id="header-actions" scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody id="table-body" className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr id="loading-row">
                    <td id="loading-cell" colSpan={5} className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  products?.map((product) => (
                    <tr id={`product-row-${product.id}`} key={product.id}>
                      <td id={`product-name-${product.id}`} className="px-6 py-4 whitespace-nowrap">
                        <div id={`product-info-${product.id}`} className="flex items-center">
                          <div id={`product-image-container-${product.id}`} className="flex-shrink-0 h-10 w-10">
                            <img
                              id={`product-image-${product.id}`}
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                          </div>
                          <div id={`product-text-${product.id}`} className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td id={`product-description-${product.id}`} className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      </td>
                      <td id={`product-price-${product.id}`} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                        £{product.price.toFixed(2)}
                        </div>
                      </td>
                      <td id={`product-stock-${product.id}`} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td id={`product-actions-${product.id}`} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          id={`edit-button-${product.id}`}
                          onClick={() => handleEdit(product)}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          id={`delete-button-${product.id}`}
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Admin;
