export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  hasSpiciness?: boolean;
  hasExtras?: boolean;
}

export interface CartItem {
  id: string; // Unique ID representing product + specific customizations
  product: Product;
  quantity: number;
  spiciness?: string;
  extras?: { name: string; price: number }[];
  addedPrice: number;
}

