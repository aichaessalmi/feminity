'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export type SeasonKey = 'spring-summer' | 'autumn-winter';

interface SeasonalNavigationBarProps {
  onSeasonChange?: (season: SeasonKey) => void;
  initialSeason?: SeasonKey;
  onCategoryClick?: () => void;
}

const SeasonalNavigationBar = ({
  onSeasonChange,
  initialSeason = 'spring-summer',
  onCategoryClick,
}: SeasonalNavigationBarProps) => {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(initialSeason);

  const handleSeasonChange = (season: SeasonKey) => {
    setActiveSeason(season);
    onSeasonChange?.(season);
  };

  const seasonalBackground =
    activeSeason === 'spring-summer'
      ? 'bg-[url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80")] bg-cover bg-center'
      : 'bg-[url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80")] bg-cover bg-center';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] shadow-elevation-2 transition-all duration-500 ${seasonalBackground}`}
    >
      {/* overlay lisibilité */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <div className="relative flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 lg:px-8">
     <Link
  href="/main-shopping-interface"
  className="flex items-center transition-smooth hover:opacity-80"
>
  <img
    src="/logo2.png"
    alt="Feminity Boutique"
    className="
      h-20
      sm:h-24
      md:h-28
      w-auto
      transition-smooth
      hover:scale-105
    "
  />
</Link>


        {/* ACTIONS */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          {/* catégories mobile */}
          <button
            onClick={onCategoryClick}
            className="lg:hidden p-2 rounded-md bg-secondary text-secondary-foreground transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring"
            aria-label="Catégories"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-5 sm:h-5"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* panier */}
         

          {/* SAISONS */}
          <button
            onClick={() => handleSeasonChange('spring-summer')}
            className={`
              px-3 sm:px-5 py-1.5 sm:py-2 rounded-md
              font-body font-medium text-xs sm:text-sm tracking-wide
              transition-smooth hover-lift press-down focus-ring whitespace-nowrap
              ${
                activeSeason === 'spring-summer'
                  ? 'bg-pink-700 text-primary-foreground shadow-elevation-2'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span className="hidden sm:inline">Printemps/Été</span>
            <span className="sm:hidden">P/É</span>
          </button>

          <button
            onClick={() => handleSeasonChange('autumn-winter')}
            className={`
              px-3 sm:px-5 py-1.5 sm:py-2 rounded-md
              font-body font-medium text-xs sm:text-sm tracking-wide
              transition-smooth hover-lift press-down focus-ring whitespace-nowrap
              ${
                activeSeason === 'autumn-winter'
                  ? 'bg-pink-700 text-primary-foreground shadow-elevation-2'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span className="hidden sm:inline">Automne/Hiver</span>
            <span className="sm:hidden">A/H</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default SeasonalNavigationBar;
