'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import SeasonalNavigationBar from '@/components/common/SeasonalNavigationBar';

interface CartItem {
  id: string;DH
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
  size: string;
  color: string;
  quantity: number;
}

const ShoppingCartReview = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
  {
    id: 'prod-001',
    name: 'Robe Élégante en Soie Rose',
    category: 'Robes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1594179056536-dc8714fc8fdf',
    alt: 'Elegant pink silk dress on mannequin with flowing fabric and delicate draping',
    size: 'M',
    color: 'Rose Poudré',
    quantity: 1
  },
  {
    id: 'prod-002',
    name: 'Chemisier Blanc Classique',
    category: 'Chemises & Blouses',
    price: 79.99,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aadd1762-1766493596440.png',
    alt: 'Classic white button-up blouse with collar and long sleeves on white background',
    size: 'S',
    color: 'Blanc',
    quantity: 2
  },
  {
    id: 'prod-004',
    name: 'Jupe Midi Plissée Beige',
    category: 'Jupes',
    price: 69.99,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1195973c1-1764645159752.png',
    alt: 'Beige pleated midi skirt with flowing fabric and elastic waistband',
    size: 'L',
    color: 'Beige',
    quantity: 1
  }]
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setItemToRemove(null);
  };

  const clearCart = () => {
    setCartItems([]);
    setShowClearConfirm(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? subtotal > 150 ? 0 : 9.99 : 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SeasonalNavigationBar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/main-shopping-interface"
                  className="text-text-secondary hover:text-pink-700 transition-smooth">

                  Boutique
                </Link>
              </li>
              <li className="text-text-secondary">/</li>
              <li className="text-foreground font-medium">Panier</li>
            </ol>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-semibold text-foreground mb-2">
              Votre Panier
            </h1>
            <p className="font-body text-text-secondary">
              {cartItems.length > 0 ?
              `${cartItems.length} article${cartItems.length > 1 ? 's' : ''} dans votre panier` :
              'Votre panier est vide'}
            </p>
          </div>

          {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-card rounded-xl shadow-elevation-2 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="ShoppingBagIcon" size={48} className="text-text-secondary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
                  Votre panier est vide
                </h2>
                <p className="font-body text-text-secondary mb-8">
                  Découvrez notre collection et ajoutez vos articles préférés à votre panier.
                </p>
                <Link
                href="/main-shopping-interface"
                className="inline-flex items-center gap-2 px-8 py-3 bg-pink-700 text-primary-foreground rounded-md font-body font-medium transition-smooth hover-lift press-down focus-ring shadow-elevation-2">

                  <Icon name="ArrowLeftIcon" size={20} />
                  Continuer vos achats
                </Link>
              </div>
            </div>) :

          <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <Link
                  href="/main-shopping-interface"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-body font-medium text-sm transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring">

                    <Icon name="ArrowLeftIcon" size={18} />
                    Continuer vos achats
                  </Link>
                  <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-body font-medium text-sm transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring">

                    <Icon name="TrashIcon" size={18} />
                    Vider le panier
                  </button>
                </div>

                {/* Cart Items List */}
                {cartItems.map((item) =>
              <div
                key={item.id}
                className="bg-card rounded-lg shadow-elevation-2 p-4 sm:p-6 transition-smooth hover:shadow-elevation-3">

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        <AppImage
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover" />

                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-caption text-xs text-text-secondary mb-1 uppercase tracking-wider">
                              {item.category}
                            </p>
                            <h3 className="font-body font-medium text-lg text-foreground mb-2">
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-caption text-text-secondary">Taille:</span>
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                                  {item.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-caption text-text-secondary">Couleur:</span>
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                                  {item.color}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                        onClick={() => setItemToRemove(item.id)}
                        className="p-2 text-text-secondary hover:text-destructive transition-smooth rounded-md hover:bg-muted focus-ring"
                        aria-label="Supprimer l'article">

                            <Icon name="TrashIcon" size={20} />
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-caption text-sm text-text-secondary">Quantité:</span>
                            <div className="flex items-center gap-2 bg-secondary rounded-md">
                              <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-smooth rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                            aria-label="Diminuer la quantité">

                                <Icon name="MinusIcon" size={16} />
                              </button>
                              <span className="font-data text-sm font-medium text-foreground w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-smooth rounded-r-md focus-ring"
                            aria-label="Augmenter la quantité">

                                <Icon name="PlusIcon" size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-caption text-xs text-text-secondary mb-1">
                                {item.price.toFixed(2)} DH × {item.quantity}
                              </p>
                              <p className="font-data text-xl font-semibold text-pink-700">
                                {(item.price * item.quantity).toFixed(2)} DH
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-elevation-3 p-6 sticky top-28">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                    Récapitulatif
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-text-secondary">Sous-total</span>
                      <span className="font-data text-foreground font-medium">
                        {subtotal.toFixed(2)} DH
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-text-secondary">Livraison</span>
                      <span className="font-data text-foreground font-medium">
                        {shipping === 0 ?
                      <span className="text-success">Gratuite</span> :

                      `${shipping.toFixed(2)} DH`
                      }
                      </span>
                    </div>
                    {shipping > 0 &&
                  <p className="text-xs font-caption text-text-secondary italic">
                        Livraison gratuite à partir de 150 DH
                      </p>
                  }
                    <div className="flex items-center justify-between">
                      <span className="font-body text-text-secondary">TVA (20%)</span>
                      <span className="font-data text-foreground font-medium">
                        {tax.toFixed(2)} DH
                      </span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-semibold text-foreground">
                          Total
                        </span>
                        <span className="font-data text-2xl font-bold text-pink-700">
                          {total.toFixed(2)} DH
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full px-6 py-4 bg-pink-700 text-primary-foreground rounded-md font-body font-semibold text-base transition-smooth hover-lift press-down focus-ring shadow-elevation-2 mb-3">
                    Procéder au paiement
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                    <Icon name="ShieldCheckIcon" size={16} />
                    <span className="font-caption">Paiement sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </main>

      {/* Remove Item Confirmation Modal */}
      {itemToRemove &&
      <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setItemToRemove(null)} />

          <div className="relative bg-card rounded-xl shadow-elevation-5 p-6 max-w-md w-full">
            <div className="mb-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-destructive" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground text-center mb-2">
                Supprimer l'article ?
              </h3>
              <p className="font-body text-text-secondary text-center">
                Êtes-vous sûr de vouloir retirer cet article de votre panier ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
              onClick={() => setItemToRemove(null)}
              className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-md font-body font-medium transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring">

                Annuler
              </button>
              <button
              onClick={() => removeItem(itemToRemove)}
              className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-md font-body font-medium transition-smooth hover-lift press-down focus-ring">

                Supprimer
              </button>
            </div>
          </div>
        </div>
      }

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm &&
      <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowClearConfirm(false)} />

          <div className="relative bg-card rounded-xl shadow-elevation-5 p-6 max-w-md w-full">
            <div className="mb-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-destructive" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground text-center mb-2">
                Vider le panier ?
              </h3>
              <p className="font-body text-text-secondary text-center">
                Tous les articles seront retirés de votre panier. Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-md font-body font-medium transition-smooth hover:bg-accent hover:text-accent-foreground focus-ring">

                Annuler
              </button>
              <button
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-md font-body font-medium transition-smooth hover-lift press-down focus-ring disabled:opacity-50 disabled:cursor-not-allowed">

                Vider le panier
              </button>

              <Link
              href="/order-confirmation"
              className="flex-1 px-4 py-3 bg-success text-success-foreground rounded-md font-body font-medium transition-smooth hover-lift press-down focus-ring text-center">

                Voir Confirmation
              </Link>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default ShoppingCartReview;