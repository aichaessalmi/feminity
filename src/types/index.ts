// src/types/index.ts

export interface Color {
  id: string;
  name: string;
  hex_code: string;
}

export interface Size {
  id: string;
  label: string;
}

export interface ProductImage {
  id: string;
  color_id: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category_name: string;
  season_name: string;
  colors: Color[];
  sizes: Size[];
  images: ProductImage[];
  show_in_carousel: boolean;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Season {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  full_name: string;
  address: string;
  city: string;
  phone: string;
  
  // Infos Produit (Directement accessibles maintenant !)
  product: number; // ID du produit
  product_name: string;
  product_image: string | null;
  
  // Détails commande
  selected_size: string;
  selected_colors: string; // Attention au 's' final selon ton code python
  quantity: number;
  total_price: string; // Django envoie souvent les DecimalField en string
  created_at: string;
}