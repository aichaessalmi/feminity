'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import SeasonalNavigationBar from '@/components/common/SeasonalNavigationBar';
import { api } from '@/services/api';
import { Order } from '@/types';

// Interface pour gérer l'affichage dynamique des variantes
interface OrderVariant {
  colorName: string;
  sizes: string;
  image: string;
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Chargement des données (Logique API)
  useEffect(() => {
    const idToFetch = typeof window !== 'undefined' ? localStorage.getItem('last_order_id') : null;

    if (!idToFetch) {
      setError("Aucune commande récente trouvée.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const orderData = await api.getOrder(idToFetch);
        setOrder(orderData);

        if (orderData.product) {
          try {
            const products = await api.getProducts(`id=${orderData.product}`);
            const p = Array.isArray(products) 
              ? products.find((x: any) => x.id === orderData.product) || products[0]
              : products;
            setProductDetails(p);
          } catch (e) {
            console.error("Erreur produit détails", e);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Fonction magique pour associer Couleur <-> Image
  const getOrderVariants = (): OrderVariant[] => {
    if (!order) return [];

    if (!order.selected_colors || !productDetails) {
      return [{
        colorName: 'Standard',
        sizes: order.selected_size || '',
        image: order.product_image || '/placeholder.png'
      }];
    }

    const variantsRaw = order.selected_colors.split('|');

    return variantsRaw.map(variantStr => {
      const [colorNameRaw, sizesRaw] = variantStr.split(':');
      const colorName = colorNameRaw?.trim() || 'Standard';
      const sizes = sizesRaw?.trim() || '';

      let variantImage = order.product_image;
      
      if (productDetails && productDetails.colors && productDetails.images) {
        const colorObj = productDetails.colors.find((c: any) => c.name.toLowerCase() === colorName.toLowerCase());
        if (colorObj) {
          const imgObj = productDetails.images.find((img: any) => img.color_id === colorObj.id);
          if (imgObj) variantImage = imgObj.image;
        }
      }

      return { colorName, sizes, image: variantImage };
    });
  };

  const variants = getOrderVariants();

  // 3. Calculs des dates et prix
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDate = new Date(today); minDate.setDate(today.getDate() + 3);
    const maxDate = new Date(today); maxDate.setDate(today.getDate() + 7);

    const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  // --- RENDU : LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-pink-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-body text-lg text-pink-700">Finalisation de votre commande...</p>
        </div>
      </div>
    );
  }

  // --- RENDU : ERREUR ---
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oups !</h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <Link href="/main-shopping-interface" className="inline-block px-6 py-3 bg-pink-700 text-white rounded-lg">
                Retour à la boutique
            </Link>
        </div>
      </div>
    );
  }

  // Calculs financiers basés sur le total renvoyé par Django
  const totalPrice = parseFloat(String(order.total_price));
  const deliveryFee = 15.00;
  const productSubtotal = totalPrice - deliveryFee; 

  
  // 2. On divise par la quantité totale pour avoir le prix d'une seule pièce
  // (ex: 730 DH / 2 articles = 365 DH l'unité)
  const unitPrice = productSubtotal / (order.quantity || 1);
  return (
    <div className="min-h-screen bg-background">
      <SeasonalNavigationBar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* --- HEADER CONFIRMATION --- */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={48} className="text-success" variant="solid" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
              Commande Confirmée !
            </h1>
            <div className="mb-6 p-4 bg-success/10 rounded-lg border border-success/20 max-w-lg mx-auto">
              <p className="font-body text-lg text-foreground flex items-center justify-center gap-2">
                <span className="text-2xl">✅</span>
                <span>Votre commande a été enregistrée avec succès.</span>
              </p>
            </div>
            <p className="font-body text-lg text-text-secondary mb-6">
              Merci pour votre achat, <span className="font-semibold text-foreground">{order.full_name}</span> ! Votre commande est en cours de traitement.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-lg shadow-elevation-2">
              <span className="font-caption text-sm text-text-secondary">Numéro de commande:</span>
              <span className="font-data text-lg font-bold text-pink-700">ORD-{order.id.toString().substring(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* --- DETAILS COMMANDE (CARTE PRINCIPALE) --- */}
          <div className="bg-card rounded-xl shadow-elevation-3 overflow-hidden mb-8">
            
            {/* Liste des articles (Dynamique selon couleur) */}
            <div className="p-6 border-b border-border">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Détails de la Commande
              </h2>
              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Image dynamique */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <AppImage
                        src={variant.image || '/placeholder.png'}
                        alt={`${order.product_name} ${variant.colorName}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    {/* Infos Item */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-body font-bold text-lg text-foreground mb-1">
                        {order.product_name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm mt-1">
                        <span className="font-caption text-text-secondary flex items-center gap-1">
                          Couleur: 
                          <span className="font-medium text-pink-700 px-2 py-0.5 bg-pink-50 rounded border border-pink-100">
                            {variant.colorName}
                          </span>
                        </span>
                        <span className="font-caption text-text-secondary flex items-center gap-1">
                          Tailles: <span className="font-medium text-foreground">{variant.sizes}</span>
                        </span>
                      </div>
                    </div>

                    {/* Prix (Estimé par ligne car l'API donne le total global) */}
                    <div className="text-right flex-shrink-0 flex flex-col justify-center">
                      <p className="font-data text-lg font-semibold text-pink-700">
                        {unitPrice.toFixed(2)} DH
                      </p>
                      <p className="font-caption text-xs text-text-secondary">
                        {variant.sizes.split(',').length > 1 
                          ? `${variant.sizes.split(',').length} x ${unitPrice.toFixed(0)} DH`
                          : 'Prix unitaire'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown des prix */}
             <div className="p-6 bg-muted/30">
              <div className="space-y-3">
                
                {/* Sous-total (Prix des articles uniquement) */}
                <div className="flex items-center justify-between">
                  <span className="font-body text-text-secondary">Sous-total</span>
                  <span className="font-data text-foreground font-medium">
                    {productDetails ? productSubtotal.toFixed(2) : totalPrice.toFixed(2)} DH
                  </span>
                </div>

                {/* Livraison Fixe */}
                <div className="flex items-center justify-between">
                  <span className="font-body text-text-secondary">Livraison</span>
                  <span className="font-data text-foreground font-medium">
                    {deliveryFee.toFixed(2)} DH
                  </span>
                </div>

                {/* Total Final */}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-semibold text-foreground">
                      Total
                    </span>
                    <span className="font-data text-2xl font-bold text-pink-700">
                      {totalPrice.toFixed(2)} DH
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* --- INFOS LIVRAISON & CLIENT --- */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            {/* Livraison Estimée */}
            <div className="bg-card rounded-xl shadow-elevation-2 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="TruckIcon" size={20} className="text-pink-700" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    Livraison Estimée
                  </h3>
                  <p className="font-data text-sm font-medium text-pink-700">
                    {getEstimatedDelivery()}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-body text-text-secondary">
                  <span className="font-medium text-foreground">Méthode:</span> Livraison Express
                </p>
                <p className="font-caption text-text-secondary italic">
                  Nous vous appellerons avant la livraison.
                </p>
              </div>
            </div>

            {/* Contact Client */}
            <div className="bg-card rounded-xl shadow-elevation-2 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="UserIcon" size={20} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    Informations de Livraison
                  </h3>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-body text-foreground font-medium text-lg capitalize">
                  {order.full_name}
                </p>
                <p className="font-body text-text-secondary flex items-center gap-2">
                  <Icon name="MapPinIcon" size={16} /> {order.address}
                </p>
                <p className="font-body text-text-secondary flex items-center gap-2 capitalize">
                  <Icon name="BuildingOfficeIcon" size={16} /> {order.city}
                </p>
                <p className="font-body text-text-secondary flex items-center gap-2">
                  <Icon name="PhoneIcon" size={16} /> {order.phone}
                </p>
                {/* Email (S'il n'est pas dispo dans l'API, on ne l'affiche pas ou on met un placeholder) */}
                {/* <p className="font-body text-text-secondary">{order.email}</p> */}
              </div>
            </div>
          </div>

          {/* --- BOUTONS ACTIONS --- */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center"> {/* J'ai ajouté justify-center pour centrer si besoin */}
  <Link
    href="/main-shopping-interface"
    className="
      flex-1 sm:flex-none sm:w-64  /* Sur mobile il prend tout, sur PC il a une taille fixe */
      px-7 py-5                     /* py-2 au lieu de py-3 pour réduire la hauteur */
      text-sm                       /* Texte plus petit */
      bg-pink-700 text-primary-foreground rounded-lg font-body font-semibold text-center 
      transition-smooth hover-lift press-down focus-ring shadow-elevation-2
    "
  >
    Continuer mes Achats
  </Link>
</div>
          {/* --- INFO FOOTER --- */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="InformationCircleIcon" size={24} className="text-pink-700 flex-shrink-0" />
              <div>
                <p className="font-body text-sm text-text-secondary mb-2">
                  Besoin d'aide ? Contactez notre service client.
                </p>
                <p className="font-caption text-xs text-text-secondary italic">
                   Mentionnez votre numéro de commande <strong>ORD-{order.id.toString().substring(0, 8)}</strong> pour un traitement plus rapide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;