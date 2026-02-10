'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface Category {
  id: string;
  label: string;
}

interface CategorySidebarProps {
  onCategorySelect?: (categoryId: string) => void;
  activeCategoryId?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: (isOpen: boolean) => void;
}

const CategorySidebar = ({
  onCategorySelect,
  activeCategoryId,
  isMobileOpen = false,
  onMobileToggle,
}: CategorySidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getCategories();

      const finalCategories: Category[] = data.map((cat: any) => ({
        id: cat.id,
        label: cat.name,
      }));

      setCategories(finalCategories);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    onMobileToggle?.(false);
  };

  return (
    <>
      <aside
        className={`
          fixed top-14 sm:top-16 left-0
          h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]
          w-64 sm:w-60
          bg-card shadow-elevation-2 z-[90]
          transition-smooth
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="px-6 py-6 border-b border-border">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Catégories
            </h2>
          </div>

          {/* LISTE */}
          <nav className="flex-1 overflow-y-auto py-4">
            {loading && (
              <div className="px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-700" />
                <p className="mt-2 text-foreground/60 font-body text-sm">
                  Chargement…
                </p>
              </div>
            )}

            {error && (
              <div className="px-6 py-4">
                <p className="text-error font-body text-sm">{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              categories.map((cat) => {
                const isActive = activeCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`
                      w-full flex items-center justify-between
                      px-6 py-3 text-left
                      transition-smooth hover:bg-secondary focus-ring
                      ${
                        isActive
                          ? 'bg-pink-700 text-primary-foreground'
                          : 'text-foreground hover:text-accent'
                      }
                    `}
                  >
                    <span className="font-body font-medium text-sm">
                      {cat.label}
                    </span>
                  </button>
                );
              })}

            {!loading && !error && categories.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-foreground/60 font-body text-sm">
                  Aucune catégorie disponible
                </p>
              </div>
            )}
          </nav>

          {/* FOOTER */}
          <div className="px-6 py-6 border-t border-border bg-secondary/30">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`
                w-full px-6 py-3 rounded-md
                font-body font-medium text-sm
                transition-smooth hover-lift press-down focus-ring
                ${
                  activeCategoryId === 'all'
                    ? 'bg-pink-700 text-primary-foreground shadow-elevation-2'
                    : 'bg-card text-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              Voir Tout
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[85] top-14 sm:top-16"
          onClick={() => onMobileToggle?.(false)}
        />
      )}
    </>
  );
};

export default CategorySidebar;
