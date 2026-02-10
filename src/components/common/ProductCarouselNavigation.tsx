'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api'; 
import { Product } from '@/types';
import ProductCard from '@/app/main-shopping-interface/components/ProductCard';

interface ProductCarouselNavigationProps {
  // On passe par défaut à 4 pour que les cartes soient plus petites
  itemsPerView?: number; 
  onProductOrderClick?: (productId: string) => void;
}

const ProductCarouselNavigation = ({ 
  itemsPerView = 4, // CHANGÉ : 4 au lieu de 3 pour des cartes plus petites
  onProductOrderClick
}: ProductCarouselNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(itemsPerView);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      try {
        const data = await api.getFeatured(); 
        setProducts(data);
      } catch (err) {
        console.error("Erreur Django");
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  // Gestion de la taille des cartes selon l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1.2); // On voit un bout de la 2ème carte sur mobile
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2.5); // Taille moyenne sur tablette
      } else {
        setVisibleItems(4); // 4 cartes sur grand écran = cartes plus petites
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - Math.floor(visibleItems));
  const handlePrevious = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1));

  if (loading) return (
    <div className="w-full bg-white py-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-700"></div></div>
  );

  if (products.length === 0) return null;

  return (
    <div className="w-full bg-white py-6 border-b border-gray-100">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-widest">
          Sélection du Moment
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-1.5 rounded-full border ${currentIndex === 0 ? 'text-gray-200 border-gray-100' : 'text-black border-black hover:bg-black hover:text-white'} transition-all`}
          >
            <Icon name="ChevronLeftIcon" size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`p-1.5 rounded-full border ${currentIndex >= maxIndex ? 'text-gray-200 border-gray-100' : 'text-black border-black hover:bg-black hover:text-white'} transition-all`}
          >
            <Icon name="ChevronRightIcon" size={16} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-out px-2"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{ width: `calc(${100 / visibleItems}% - 12px)` }}
              className="flex-shrink-0"
            >
              {/* On passe exactement les mêmes données que dans la grille */}
              <ProductCard
                id={product.id}
                name={product.name}
                category={product.category_name}
                price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
                image={product.images?.[0]?.image || ''}
                alt={product.name}
                sizes={product.sizes?.map((s: any) => s.label) || []}
                colors={product.colors || []}
                images={product.images || []}
                onOrderClick={(id) => onProductOrderClick?.(id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselNavigation;