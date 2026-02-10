'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { HeartIcon } from '@heroicons/react/24/outline'; 

interface Color { id: string; name: string; hex_code: string; }
interface ProductImage { color_id: string; image: string; }

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string; 
  alt: string;
  sizes: any[]; // Changé en any[] pour accepter les objets {id, label} de Django
  colors: Color[];
  images: ProductImage[];
  onOrderClick: (productId: string) => void;
}

const ProductCard = ({
  id,
  name,
  category,
  price,
  image,
  alt,
  sizes = [],
  colors = [],
  images = [],
  onOrderClick,
}: ProductCardProps) => {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  // Initialisation : sélectionne la première couleur disponible au chargement
  useEffect(() => {
    if (colors.length > 0 && !selectedColorId) {
      setSelectedColorId(colors[0].id);
    }
  }, [colors, selectedColorId]);

  // Détermination de l'image à afficher (image de la couleur ou image par défaut)
  const imageByColor = images.find((img) => img.color_id === selectedColorId)?.image;
  const firstImageInList = images.length > 0 ? images[0].image : null;
  const currentImage = imageByColor || firstImageInList || image;

  return (
    <div className="group flex flex-col bg-white w-full border border-transparent hover:border-gray-100 transition-all rounded-xl overflow-hidden">
      
      {/* 1. Zone Image Principale */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <AppImage
          src={currentImage}
          alt={alt || name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform">
          <HeartIcon className="w-5 h-5 text-black" />
        </button>
      </div>
      
      {/* 2. Infos Produit */}
      <div className="py-3 flex flex-col items-start space-y-2 px-1">
        
        {/* 3. Vignettes des couleurs */}
        {colors.length > 1 && (
          <div className="flex items-center gap-1.5 py-1">
            {colors.map((color) => {
              const swatchImg = images.find(img => img.color_id === color.id)?.image;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)}
                  className={`relative w-8 h-10 border-2 transition-all overflow-hidden rounded ${
                    selectedColorId === color.id ? 'border-black scale-105 shadow-sm' : 'border-transparent opacity-70'
                  }`}
                >
                  <AppImage src={swatchImg} alt={color.name} fill className="object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* 4. TAILLES (Correction de l'erreur d'objet React) */}
        {sizes && sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.map((size: any, index: number) => (
              <div
                key={size.id || index}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-800 rounded text-[10px] font-bold uppercase transition-colors"
              >
                {/* ✅ SOLUTION : On affiche size.label si c'est un objet, sinon size direct */}
                {typeof size === 'object' ? size.label : size}
              </div>
            ))}
          </div>
        )}

        {/* 5. Marque, Nom et Prix */}
        <div className="pt-1 w-full">
          <h3 className="font-medium text-sm text-foreground mb-2 truncate uppercase tracking-tight">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-bold text-pink-700">
                {price} DH
            </span>
            <button
              onClick={() => onOrderClick(id)}
              className="px-4 py-1.5 bg-pink-700 text-white rounded-md text-[10px] font-bold uppercase hover:bg-pink-800 transition-colors shadow-sm"
            >
              Commander
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;