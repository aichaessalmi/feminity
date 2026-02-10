'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterControlsProps {
  sortBy: string;
  priceRange: string;
  availability: string;
  onSortChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
}

const FilterControls = ({
  sortBy,
  priceRange,
  availability,
  onSortChange,
  onPriceRangeChange,
  onAvailabilityChange,
}: FilterControlsProps) => {
  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-text-secondary">
          <Icon name="AdjustmentsHorizontalIcon" size={20} className="sm:w-6 sm:h-6" />
          <span className="font-body font-medium text-sm sm:text-base">Filtres:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sort" className="font-caption text-xs text-text-secondary">
              Trier par
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border font-body text-sm transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring cursor-pointer min-w-[160px] sm:min-w-[180px]"
            >
              <option value="featured">Mis en avant</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className="font-caption text-xs text-text-secondary">
              Prix
            </label>
            <select
              id="price"
              value={priceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border font-body text-sm transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring cursor-pointer min-w-[140px] sm:min-w-[160px]"
            >
              <option value="all">Tous les prix</option>
              <option value="0-50">0 DH - 50 DH</option>
              <option value="50-100">50 DH - 100 DH</option>
              <option value="100-150">100 DH - 150 DH</option>
              <option value="150+">150 DH et plus</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="availability" className="font-caption text-xs text-text-secondary">
              Disponibilité
            </label>
            <select
              id="availability"
              value={availability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border font-body text-sm transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring cursor-pointer min-w-[140px] sm:min-w-[160px]"
            >
              <option value="all">Tous</option>
              <option value="in-stock">En stock</option>
              <option value="low-stock">Stock limité</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;