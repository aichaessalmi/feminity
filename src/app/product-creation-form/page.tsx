'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import { createProduct, updateProduct, getProducts } from '@/services/productService';
import { uploadProductImage, updateProductImage } from '@/services/imageUploadService';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  nom: string;
}

interface Size {
  id: string;
  taille: string;
  ordre: number;
}

interface Season {
  id: string;
  nom: string;
}

interface ProductFormData {
  nom: string;
  description: string;
  prix: string;
  categorie_id: string;
  taille_id: string;
  saison_id: string;
  image_url: string;
  stock_quantity: string;
  is_active: boolean;
}

function ProductCreationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    nom: '',
    description: '',
    prix: '',
    categorie_id: '',
    taille_id: '',
    saison_id: '',
    image_url: '',
    stock_quantity: '0',
    is_active: true
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [oldImagePath, setOldImagePath] = useState<string>('');

  useEffect(() => {
    loadFormData();
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadFormData = async () => {
    // Load categories
    const { data: categoriesData } = await supabase
      .from('categorie')
      .select('id, nom')
      .order('nom');
    if (categoriesData) setCategories(categoriesData);

    // Load sizes
    const { data: sizesData } = await supabase
      .from('taille')
      .select('id, taille, ordre')
      .order('ordre');
    if (sizesData) setSizes(sizesData);

    // Load seasons
    const { data: seasonsData } = await supabase
      .from('saison')
      .select('id, nom');
    if (seasonsData) setSeasons(seasonsData);
  };

  const loadProduct = async (id: string) => {
    const { data: products } = await getProducts();
    const product = products?.find(p => p.id === id);
    
    if (product) {
      setFormData({
        nom: product.nom,
        description: product.description || '',
        prix: product.prix.toString(),
        categorie_id: product.categorie_id || '',
        taille_id: product.taille_id || '',
        saison_id: product.saison_id || '',
        image_url: product.image_url || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        is_active: product.is_active !== undefined ? product.is_active : true
      });
      
      if (product.image_url) {
        setImagePreview(product.image_url);
        setOldImagePath(product.image_url);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier invalide. Formats acceptés : JPG, PNG, WebP, GIF');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. Taille maximale : 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        const uploadResult = productId 
          ? await updateProductImage(imageFile, oldImagePath)
          : await uploadProductImage(imageFile);
        
        setUploading(false);

        if (!uploadResult.success) {
          setError(uploadResult.error || 'Erreur lors du téléchargement de l\'image');
          setLoading(false);
          return;
        }

        imageUrl = uploadResult.url || '';

      }

      const productData = {
        nom: formData.nom,
        description: formData.description,
        prix: parseFloat(formData.prix),
        categorie_id: formData.categorie_id || undefined,
        taille_id: formData.taille_id || undefined,
        saison_id: formData.saison_id || undefined,
        image_url: imageUrl,
        stock_quantity: parseInt(formData.stock_quantity),
        is_active: formData.is_active
      };

      if (productId) {
        const { data, error: updateError } = await updateProduct(productId, productData);
        if (updateError) {
          setError(updateError);
        } else {
          setSuccess(true);
          setTimeout(() => router.push('/admin-product-management-dashboard'), 1500);
        }
      } else {
        const { data, error: createError } = await createProduct(productData);
        if (createError) {
          setError(createError);
        } else {
          setSuccess(true);
          setTimeout(() => router.push('/admin-product-management-dashboard'), 1500);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {productId ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {productId ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre catalogue'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {productId ? 'Produit modifié avec succès !' : 'Produit créé avec succès !'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du Produit
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-pink-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <AppImage
                        src={imagePreview}
                        alt="Aperçu"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                          <span>Télécharger une image</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleImageSelect}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP, GIF jusqu'à 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Ex: Robe d'été fleurie"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                  Prix (DH) *
                </label>
                <input
                  type="number"
                  name="prix"
                  id="prix"
                  required
                  min="0"
                  step="0.01"
                  value={formData.prix}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                  Quantité en Stock *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  id="stock_quantity"
                  required
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  name="categorie_id"
                  id="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="taille_id" className="block text-sm font-medium text-gray-700">
                  Taille
                </label>
                <select
                  name="taille_id"
                  id="taille_id"
                  value={formData.taille_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="">Sélectionner une taille</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.taille.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="saison_id" className="block text-sm font-medium text-gray-700">
                  Saison
                </label>
                <select
                  name="saison_id"
                  id="saison_id"
                  value={formData.saison_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                >
                  <option value="">Sélectionner une saison</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.nom === 'printemps_ete' ? 'Printemps-Été' : 'Automne-Hiver'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Produit actif (visible dans le catalogue)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {uploading ? 'Téléchargement...' : 'Enregistrement...'}
                </>
              ) : (
                <>
                  {productId ? 'Mettre à jour' : 'Créer le produit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductCreationForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    }>
      <ProductCreationFormContent />
    </Suspense>
  );
}