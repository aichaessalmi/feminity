'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function AppImage({ src, alt, fill, className }: any) {
  const [error, setError] = useState(false);

  // LOGIQUE INTELLIGENTE : 
  // Si src est déjà une URL complète, on l'utilise. Sinon on ajoute le domaine.
  const getFullUrl = () => {
    if (!src || error) return "/no_image.png";
    if (src.startsWith('http')) return src; 
    return `http://127.0.0.1:8000${src}`;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Image
        src={getFullUrl()}
        alt={alt || "Produit"}
        fill={fill}
        width={!fill ? 400 : undefined}
        height={!fill ? 500 : undefined}
        className="object-cover"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
}