'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SeasonalNavigationBar from '@/components/common/SeasonalNavigationBar';
import CategorySidebar from '@/components/common/CategorySidebar';
import ProductCarouselNavigation from '@/components/common/ProductCarouselNavigation';
import ContextualOrderInterface from '@/components/common/ContextualOrderInterface';
import SearchBar from './SearchBar';
import FilterControls from './FilterControls';
import ProductGrid from './ProductGrid';
import ContactSection from './ContactSection';

import { api } from '@/services/api';
import { Product } from '@/types';

type Season = 'spring-summer' | 'autumn-winter';

const MainShoppingInteractive = () => {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [seasonsData, categoriesData] = await Promise.all([
        api.getSeasons(),
        api.getCategories(),
      ]);
      setSeasons(seasonsData);
      setCategories(categoriesData);
    } catch {
      setError('Erreur lors du chargement des données');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

if (activeSeason) {
  const targetSeason =
    activeSeason === 'spring-summer' ? 'Printemps' : 'Hiver';

  const seasonId = seasons.find((s) =>
    s.name.toLowerCase().includes(targetSeason.toLowerCase())
  )?.id;

  if (seasonId) params.append('season', seasonId);
}

      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (isSearchActive && searchQuery) params.append('search', searchQuery);

      const data = await api.getProducts(params.toString());

      setAllProducts(
        data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category_name: item.category_name || 'Boutique',
          price: Number(item.price),
          image: item.images?.[0]?.image || '/assets/images/no_image.png',
          description: item.description || '',
          sizes: item.sizes || [],
          colors: item.colors || [],
          images: item.images || [],
        }))
      );
    } catch {
      setError("Erreur de chargement des articles");
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated && seasons.length) loadProducts();
  }, [activeSeason, activeCategory, searchQuery, isSearchActive, seasons]);

  const filteredProducts = [...allProducts];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="h-16 bg-[#F6F6F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#222222] font-sans">
     <SeasonalNavigationBar
  onSeasonChange={setActiveSeason}
  initialSeason={activeSeason ?? 'spring-summer'}
  onCategoryClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
/>


      <CategorySidebar
        onCategorySelect={handleCategorySelect}
        activeCategoryId={activeCategory}
        isMobileOpen={isCategorySidebarOpen}
        onMobileToggle={setIsCategorySidebarOpen}
      />

      <main className="lg:ml-64 pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

          {/* ERREUR */}
          {error && (
            <div className="mb-8 bg-[#F6F6F6] border border-[#E57373] rounded-2xl p-6 text-center">
              <p className="text-[#E57373] text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {!loading ? (
            <>
              <div className="mb-10">
                <SearchBar onSearch={handleSearch} onClear={() => setIsSearchActive(false)} />
              </div>

              {isSearchActive ? (
                <div className="mb-10 bg-[#F6F6F6] rounded-2xl p-6 flex justify-between items-center">
                  <p className="text-sm">
                    <span className="text-[#B51A59] font-semibold">
                      {filteredProducts.length}
                    </span>{' '}
                    produits trouvés pour "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setIsSearchActive(false)}
                    className="text-[#B51A59] text-xs font-semibold uppercase tracking-widest"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-12">
                    <ProductCarouselNavigation onProductOrderClick={handleProductOrderClick} />
                  </div>

                  <div className="mb-10 bg-[#FFFFFF] border border-[#F6F6F6] rounded-2xl p-6 shadow-sm">
                    <FilterControls
                      sortBy={sortBy}
                      priceRange={priceRange}
                      availability={availability}
                      onSortChange={setSortBy}
                      onPriceRangeChange={setPriceRange}
                      onAvailabilityChange={setAvailability}
                    />
                  </div>
                </>
              )}

              <ProductGrid
                products={filteredProducts as any[]}
                onProductOrderClick={handleProductOrderClick}
              />
            </>
          ) : (
            <div className="flex flex-col items-center py-32">
              <div className="w-12 h-12 border-4 border-[#F6F6F6] border-t-[#B51A59] rounded-full animate-spin mb-4" />
              <p className="text-[#B6B6B6] text-sm">Chargement de la boutique…</p>
            </div>
          )}
        </div>
      </main>

      <ContactSection />

      {isOrderModalOpen && selectedProduct && (
        <ContextualOrderInterface
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );

  function handleCategorySelect(id: string) {
    setActiveCategory(id);
    setIsSearchActive(false);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    setIsSearchActive(true);
  }

  function handleProductOrderClick(productId: string) {
    router.push(`/commander/${productId}`);
  }
};

export default MainShoppingInteractive;
