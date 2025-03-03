export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  username: string;
  type: 'standard' | 'locked_out' | 'problem' | 'performance_glitch' | 'error' | 'visual';
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}