'use client';

import React from 'react';
import ProductCard from './ProductCard';

// 1. On met à jour l'interface pour correspondre aux données Django
interface Color {
  id: string;
  name: string;
  hex_code: string;
}

interface ProductImage {
  color_id: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
  sizes: string[];
  colors: { id: string; name: string; hex_code: string }[]; // Doit être un objet
  images: { color_id: string; image: string }[];          // Doit être un objet
  description: string;
  season?: string;       // Optionnel pour éviter les erreurs
  availability?: string; // Optionnel pour éviter les erreurs
}

interface ProductGridProps {
  products: Product[];
  onProductOrderClick: (productId: string) => void;
}

const ProductGrid = ({ products, onProductOrderClick }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-elevation-2 p-6 sm:p-8 lg:p-12 text-center mx-4 sm:mx-0">
        <p className="font-body text-sm sm:text-base lg:text-lg text-text-secondary">
          Aucun produit ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-0">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          image={product.image}
          alt={product.alt}
          sizes={product.sizes}
          // 2. On transmet les nouvelles données au ProductCard
          colors={product.colors}
          images={product.images}
          onOrderClick={onProductOrderClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;