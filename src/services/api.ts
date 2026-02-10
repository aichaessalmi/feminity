// src/services/api.ts

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const api = {
  // Produits
  getProducts: async (queryString: string = "") => {
    const url = queryString
      ? `${API_BASE_URL}/products/?${queryString}`
      : `${API_BASE_URL}/products/`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Erreur produits");
    return res.json();
  },

  // Produits vedettes
  getFeatured: async () => {
    const res = await fetch(`${API_BASE_URL}/products/?featured=true`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Erreur produits vedettes");
    return res.json();
  },

  // Catégories
  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories/`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Erreur catégories");
    return res.json();
  },

  // Saisons
  getSeasons: async () => {
    const res = await fetch(`${API_BASE_URL}/seasons/`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Erreur saisons");
    return res.json();
  },

  // ✅ COMMANDE PAR ID (UTILISÉE PAR OrderConfirmation)
  getOrder: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      cache: 'no-store'
    });

    if (!res.ok) throw new Error("Commande introuvable");
    return res.json();
  },

  // Créer une commande
  postOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return res.json();
  }
};
