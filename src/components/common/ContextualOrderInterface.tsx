'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { Product } from '@/types'; // Importe ton interface globale

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  size_id: string; // On utilise l'ID pour Django
  color_id: string; // On utilise l'ID pour Django
  quantity: number;
}

interface ContextualOrderInterfaceProps {
  isOpen?: boolean;
  product?: Product | null;
  onClose?: () => void;
}

const ContextualOrderInterface = ({ 
  isOpen = false,
  product = null,
  onClose,
}: ContextualOrderInterfaceProps) => {
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    size_id: '',
    color_id: '',
    quantity: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Synchroniser la couleur par défaut si le produit change
  useEffect(() => {
    if (product && product.colors.length > 0) {
      setFormData(prev => ({ ...prev, color_id: product.colors[0].id }));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.size_id) newErrors.size_id = 'Taille requise';
    if (!formData.color_id) newErrors.color_id = 'Couleur requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Préparation des données pour Django CustomerOrder model
    const djangoPayload = {
      full_name: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.postalCode}`,
      city: formData.city,
      product: product.id, // UUID du produit
      selected_color: formData.color_id, // ID de la couleur
      quantity: formData.quantity,
      total_price: (parseFloat(product.price) * formData.quantity).toFixed(2),
      currency: 'MAD'
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(djangoPayload),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => handleClose(), 3000);
      } else {
        alert("Erreur lors de l'enregistrement de la commande.");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', size_id: '', color_id: '', quantity: 1 });
    setErrors({});
    setShowSuccessMessage(false);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl my-10 overflow-hidden">
        <button onClick={handleClose} className="absolute top-6 right-6 p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-pink-700 hover:text-white transition-all z-10">
          <Icon name="XMarkIcon" size={24} />
        </button>

        {showSuccessMessage ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">✓</div>
            <h3 className="text-2xl font-bold text-gray-900">Commande Confirmée !</h3>
            <p className="text-gray-500">Merci {formData.firstName}, nous vous contacterons par téléphone pour la livraison.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-0">
            {/* Section Gauche : Produit */}
            <div className="p-8 bg-gray-50 space-y-6">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-inner">
                <AppImage src={product.images[0]?.image} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs text-pink-700 font-bold uppercase tracking-widest mb-1">{product.category_name}</p>
                <h2 className="text-2xl font-bold text-gray-900 uppercase mb-2">{product.name}</h2>
                <p className="text-2xl font-black text-pink-700">{product.price} DH</p>
              </div>
            </div>

            {/* Section Droite : Formulaire */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2 uppercase">Livraison Rapide</h3>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" error={errors.firstName} value={formData.firstName} onChange={v => handleInputChange('firstName', v)} />
                <Input label="Nom" error={errors.lastName} value={formData.lastName} onChange={v => handleInputChange('lastName', v)} />
              </div>

              <Input label="Téléphone (WhatsApp)" type="tel" error={errors.phone} value={formData.phone} onChange={v => handleInputChange('phone', v)} />
              <Input label="Adresse Complète" error={errors.address} value={formData.address} onChange={v => handleInputChange('address', v)} />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ville" error={errors.city} value={formData.city} onChange={v => handleInputChange('city', v)} />
                <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Taille</label>
                   <select value={formData.size_id} onChange={e => handleInputChange('size_id', e.target.value)} className="w-full h-10 px-3 rounded border border-gray-200 focus:border-pink-700 outline-none text-sm">
                      <option value="">Choisir</option>
                      {product.sizes.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Couleur</label>
                <div className="flex gap-3">
                  {product.colors.map(c => (
                    <button key={c.id} type="button" onClick={() => handleInputChange('color_id', c.id)} 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color_id === c.id ? 'border-pink-700 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex_code }} title={c.name} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1">
                  <button type="button" onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm">-</button>
                  <span className="font-bold w-4 text-center">{formData.quantity}</span>
                  <button type="button" onClick={() => handleInputChange('quantity', formData.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm">+</button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Total</p>
                  <p className="text-xl font-black text-pink-700">{(parseFloat(product.price) * formData.quantity).toFixed(2)} DH</p>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-pink-700 text-white font-bold uppercase rounded shadow-lg hover:bg-pink-800 transition-all disabled:bg-gray-400">
                {isSubmitting ? 'Envoi en cours...' : 'Confirmer ma Commande'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Petit composant interne pour les champs de saisie
// Crée cette interface juste au-dessus du composant Input
interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void; // On dit explicitement que onChange reçoit un string
  error?: string;
  type?: string;
}

const Input = ({ label, value, onChange, error, type = "text" }: InputProps) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{label}</label>
    <input
      type={type}
      value={value}
      // C'est ici qu'on transforme l'événement en valeur simple (string)
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full h-10 px-3 rounded border ${
        error ? 'border-red-500' : 'border-gray-200'
      } focus:border-pink-700 outline-none text-sm`}
    />
    {error && <p className="text-[10px] text-red-500 mt-1 font-bold">{error}</p>}
  </div>
);
export default ContextualOrderInterface;