'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
}

const SearchBar = ({ onSearch, onClear }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Optionnel : Recherche automatique après 500ms d'inactivité (Debounce)
  // Si tu préfères que l'utilisateur doive appuyer sur "Entrée", garde juste le handleSubmit.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        onSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
    if (onClear) {
      onClear();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-4 sm:mb-8 px-4 sm:px-0">
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Rechercher un article, une couleur..."
          className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-full bg-white border border-gray-200 text-sm sm:text-base text-foreground placeholder:text-gray-400 transition-all focus:border-pink-700 focus:ring-2 focus:ring-pink-700/10 outline-none shadow-sm group-hover:border-gray-300"
        />
        
        {/* Icône de recherche (Loupe) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-700 transition-colors">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
          />
        </div>

        {/* Bouton pour effacer (X) */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-pink-700 hover:text-white"
            aria-label="Effacer la recherche"
          >
            <Icon name="XMarkIcon" size={14} />
          </button>
        )}
      </div>
      
      {/* Petit indicateur visuel sous la barre */}
      <div className="mt-2 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
         Livraison À 15 DH partout au maroc

        </p>
      </div>
    </form>
  );
};

export default SearchBar;