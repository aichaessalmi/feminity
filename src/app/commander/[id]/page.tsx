'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import SeasonalNavigationBar from '@/components/common/SeasonalNavigationBar';
import { api } from '@/services/api';
import { Product } from '@/types';

const VILLES_MAROC = [
  "Agadir", "Ain Aouda", "Ait Melloul", "Al Hoceima", "Safi", "Beni Mellal", "Boujdour", "Casablanca", "Dakhla", "El Jadida", "Fes", "Fnideq", "Fquih Ben Salah", "Inzegane", "Kasba Tadla", "Khouribga", "Larache", "M Diq", "Marrakech", "Martil", "Meknes", "Nador", "Ouarzazat", "Oujda", "Ain Harouda", "Rabat", "Sale", "Sale El Jadida-سla", "Skhirat", "Cabo Negro", "Tamesna", "Tanger", "Temara", "Tetouan", "AZROU-VILLE", "IFRAN", "IMOUZAR KANDRE", "Mohammedia", "ain leuh", "sidi aadi - azrou", "TIZNIT", "Taroudant", "ERRAHMA VILLE", "TAMARIS", "DAR BOUAZZA", "BOUSKOURA", "Jamaat shaim", "Nouaceur", "SEBT GZOULA", "Souiria", "SIDI KACEM", "SIDI SLIMAN", "BOUZNIKA", "TIT MELLIL", "AIN ATTIQ", "DAROUA", "Benslimane", "AZEMMOUR", "MOULAY ABDELLAH", "MIDELT", "Mediouna", "Chefchaouen", "Ben Guerir", "ERRACHIDIA", "RICHE-02", "Harhoura", "had soualem", "Sidi Rahhal", "Oued Zem", "BOUFKRANE", "Sbaa Ayoune", "MOLY DRISSE ZARHOUNE", "LMHAYA", "LHAJ KADOUR VILLE", "TAWJTAT", "BOUKNADL", "Bab Berred", "LAAROUI", "Selouane", "Segangan", "Beni Ensar", "Sidi Bennour", "Sidi-Bibi", "KELIAA", "Oulad Teima", "ANZA", "Walidia", "Boujniba", "Youssoufia-ville", "Skhour Rehamna", "ZAGORA", "Ouazzane", "Zaouiat Cheikh", "Echemmaia", "Biougra", "AIT AMIRA-AGADIR", "MEHDIA", "KENITRA VILLE", "MEHDIA VILLE", "MHamid El Ghizlane", "Boumia", "CHELLALAT", "Bejaad", "El Mansouria", "RISSANI VILLE", "Erfoud VILLE", "Missour", "Khemisset ville", "Tiflet Ville", "Goulmima-errachidia", "Tinejdad Ville", "OUALMES VILLE", "ROMMANI VILLE", "Houara", "Drarga", "Belfaa", "Souk Sebt Oulad Nemma", "ElHajeb VILLE", "Jerada", "Kelâat M Gouna-قلعة امڭونة", "Layoun cherkia-العيون الشرقية", "Bir Jdid", "sidi hajjaj-casa", "Moulay Yaâcoub", "Sidi Harazem", "Ras El Ma-FES", "Ain Cheggag", "Kariat Ba Mohamed", "Tinghir ville", "imzouren", "Bni Bouayach", "Boumaln dads - tinghir", "kamouni", "zayou", "Aglou", "Tafraoute", "oulad jerrar-Tiznit", "Bounaamane-TIZNIT", "El Maader El Kabir-TIZNIT", "Maaziz", "Sebt El Guerdane", "Alnif", "Taghazout", "Tamraght-Agadir", "Aourir-Agadir", "Tiztotin-NADOR", "Driouch-NADOR", "Ben Tayeb-NADOR", "Kariat Arkman‎-Nador", "Had Hrara-SAFI", "TNIN EL GHIATE-SAFI", "BERRECHID VILLE", "Tamansourt-Marrakech", "OUDAYA-Marrakech", "Louizia", "Ajdir-HOUCIMA", "Sidi Bouzid-EL JADIDA", "Jorf Sefar", "Mazagan", "Msawar Raso", "Lhawzia-JADIDA", "Zaouit Sidi Smail", "HAD WLAD FRAJ", "Ain Bni Mathar", "Jorf El Melha-OUZZANE", "Had Kourt", "Ain Dorij", "Agouray - Meknes", "Bouderbala-MEKNES", "Temsia-agadir", "tohmo agadir", "Kasbah El Taher", "Tamraght", "Gfifat", "Oulad Dahou", "Tin Mansour", "Ain Seddaq", "Oulad Berhil", "Ait Iaaza", "Ain el Mediour", "Azla", "Lalla Fatna", "Bdouza", "Tnine Gharbia", "Tleta Bouguedra", "Tlat Bouaris", "Aoufous", "Zaida", "Ait Aissa Oubrahim", "ait ihya omoussa", "Msemrir-Tinghir", "Imgon-Tinghir", "Laouamra", "El Ksiba - Beni-Mellal", "Dar Ould Zidouh", "Oulad Ayad", "Bradia - Beni-Mellal", "agzirt Beni-Mellal", "ighram laalam-beni mellal", "Sidi Aissa-Beni-Mellal", "idi Jaber-Beni-Mellal", "Oulad Zmam - Beni-Mellal", "Afourar - Beni-Mellal", "Bni Ayat - Beni-Mellal", "Oulad Said-Beni Mellal", "CHRAFAT-Chefchaouen", "jamaat fdala", "Ain Tekki", "Bni Yakhlef", "Plage David-Bouznika", "Arjat-Mohammedia", "Mimosa-mohammedia", "Ben ahmed-Berrchid", "Sid Zouine", "El Gara-Berrchid", "Outat El Haj", "boulemane-MIDELTE", "Imouzzer Marmoucha", "Ourika-VILLE", "Gouassem-VILLE", "Tahanaout-VILLE", "Ait ourir-MARRAKECH", "Tassoultant-VILLE", "Belaagid", "OULED BEN RAHMOUN", "Sidi Ghiat", "Ouahat Sidi Brahim", "Sidi Bou Othmane-VILLE", "Chouiter", "Souihla-VILLE", "Tamesluht- VILLE", "Chichaoua-VILLE", "imintanoute-VILLE", "Tnine Chtouka el jadida", "Settate", "Teroual - Ouazzane", "Zoumi-Ouazzane", "Ain Dfali-Ouazzane", "Masmouda - Ouazzane", "Sidi Taibi", "Sidi Allal Tazi", "Ain Jemaa-meknes", "Dkhissa-meknes", "Ain jiri-meknes", "Midar-Driouch", "Tamegroute-zagora", "Tagounite‬-zagora", "Khemis Sahel", "Khenichet-SIDI KACEM", "Ouled Boutabet", "Douar Boumaiz", "Ain Chkef", "sidi el aidi-settat", "Oulad Said-settat", "Guisser-settat", "El Borouj-settat", "marina smir", "Kabila", "Oued Laou", "Ain Zarka", "Boulanouare", "targuist", "Issaguen", "Tata", "Sid L Mokhtar", "Tissint-tata", "Akka-tata", "Foum Zguid", "Fam El Hisn-tata", "Issafen-tata", "Tagmout-tata", "Taznakht", "Bab Taza", "Berkane", "KHENIFRA VILLE", "Mrirte", "Mzouda", "Mejjat-chichaoua", "dcheira", "Tikiouine", "Tighassaline ville", "Mrirt Ville", "Timahdite", "Guigou-Azrou", "Essaouira", "Aguelmous", "El Kebab-KHENIFRA", "Kaf Nsour-KHENIRA", "Lehri-KHENIFRA", "El Borj-KHENIFRA", "Sidi Chiker", "Mzoudia", "Hattane-Khouribga", "Tlat Loulad-fini", "Bounouar-khouribga", "Timoulilt-Béni Mellal", "Foum Oudi-زاوية", "Tanougha-Beni Mellal", "Oulad M barek-Beni Mellal", "Ouled Moussa-Beni Mellal", "Oulad Hamdane-El Jadida", "Sidi Abbad", "Sebt Saiss", "Tīdās-Khemisset", "Ain Sbit-Khemisset", "khemis zemamra", "SOUK LARBAA", "BELKSIRI", "Lalla Mimouna", "Kelâa des Sraghna", "Attaouia", "Demnate", "Tamellalt", "Tazarine", "Tamzmout zagora", "NKob Zagora", "AHFIR", "SAAIDIA", "Agdz", "Amizmiz", "Lalla Takerkoust", "Sidi Bouzid-SAFI", "Marzouga", "Taliouine", "Aoulouz", "Sidi Ayache", "Sidi Yahya Zaer", "Oulad Abbou-Berrchid", "Jamaat Riah-Berrchid", "boukidan", "Ait Kamra-Hoceima", "mirleft", "Sidi Hajjaj-Berrchid", "Jamaat foko-Berrchid", "Boudnib", "ITZER", "Aghbalou Nserdan", "Gourrama", "TANTAN", "El Ouatia", "Essemara-السمارة", "Tafoughalt", "Bni Drar", "SIDI KAML", "Maamora", "SOUK LHAD ALLAL TAZI", "SWASIYIN ALAL TAZI", "Wlad amer ALAL TAZI", "Arba Aounate-أربعاء العونات", "Chaibate-el jadida", "Kouassem-el jadida", "Ain Bita-sefrou", "Tamanar-Essaouira", "Smimou - Essaouira", "Skoura-Ouarzazate", "Amerzgane-Ouarzazate", "Ait Ben Haddou-Ouarzazate", "Hadd Ouled Jelloul-TAZI", "Sidi Al Kamel-TAZI", "Mograne-TAZI", "Aghbal-BERKAN", "ferkhana-nador", "Bni Chiker", "Aklim", "OUM AZZA", "LAARJAT", "Guelmim-ville", "Akhfennir", "SIDI IFNI-VILLE", "Assa-VILLE", "Bouizakarne-VILLE", "Zag-VILLE", "Laayoune-ville", "LAAYOUNE-PORT", "LAAYOUNE-PLAYA", "Tnin beni khelloug-settat", "Tarfaya ville", "Cap de l’eau", "Ait ishaq", "Ouaoumana", "Had bouhssoussen", "Moulay bouazza khenifra", "FIGUIG", "BOUARFA", "Sidi Allal El Bahraoui", "Agafay", "Ras El Ma-NADOR", "Mejjat-meknes", "AZRO-AGADIR", "Youssoufia-RABAT", "Aghbala-Beni Mellal", "Dar el Amri-Sidi Sliman", "Wlad Ghanem", "Bni Wassine", "Ain Mechlawa", "El aouama-tanger", "Ait Baha", "Rouadi-Al Hoceima", "Bni Boufrah-Al Hoceima", "Bani Hadifa-Al Hoceima", "Aït Hadifa-Al Hoceima", "tizi nisly-Beni Mellal", "sidi ouaaziz", "ouzioua", "Had Draa", "ounagha", "Bir Kouat", "Talmest", "TAZA-VILLE", "Guercif", "Taourirt", "tahla", "Oued Amlil", "Taddart-taza", "Aknoul-taza", "Tizi Ousli", "Fouwarat-meknes", "aine aghbal-meknes", "ait ai3zam-meknes", "Boussmssad-meknes", "Souk lgor-meknes", "Nzala-meknes", "Wlad sidi yhya-meknes", "wlad slim-meknes", "Kwidar-meknes", "Lozin-meknes", "wislan-meknes", "Oulad Salah-bouskoura", "lkhyayta-had soualem", "EL HALHAL MEDIOUNA", "MKANSA-MEDIOUNA", "Sidi Moussa El Majdoub", "Sidi Moussa Ben Ali", "ASILAH VILLE", "Sidi lyamani-ASILAH", "Had lgharbiya-ASILAH", "Tahadart - ASILAH", "Brych-ASILAH", "Jilaliya-ASILAH", "Marghouba-ASILAH", "Dghaliyn-ASILAH", "Lakhssas", "Tioughza", "Ksar El Kebir", "ARBAOUA", "Had Oulad Aissa", "DAR EL GADARI", "sidi yahia elgharb", "sefrou", "taounate", "Bhalil-sefrou", "ksar sghir", "Ghafsai", "Ajdir-taza", "Akchour", "STEHAT-OUED LAOU", "JEBHA", "Beni-Hassan TETOUAN", "Souk Tlata Tanquoub Ouazzane", "Souk al had Ouazzane", "Khamis M Diq-chefchaouen", "Derdara-Chefchaouen", "tahar souk - TAOUNATE", "Khlalfa-Taounate", "kantra askar - taounate", "bouhouda - taounate", "beni oulid - taounate", "tnin beni onjel - taounate", "zrizer - taounate", "ain aicha - taounate", "ain mediouna - taounate", "tissa - taounate", "sidi el makhfi - taounate", "galaz - taounate", "hajria - taounate", "ourtzagh - taounate", "mezraoua - taounate", "Bni Ahmed - chefchaouen", "Tlet El Hanchane", "AZILAL VILLE", "TANANTE-AZILAL", "ouaouizeght-AZILAL", "foum jamaa-Azilal", "Dlalha", "moulay bousselham", "Lmnar Park-ksar sghir", "Nwinwich_ksar sghir", "Wadalyane_ksar sghir", "Diki_ksar sghir", "Daliya_ksar sghir", "Wad lmarssa", "Souk Tlet El Gharb", "ZGOUTA", "Tounfite-Midelt", "Agouim-Ouarzazate", "ighrem Nougdal-Ouarzazate", "Ait Zineb-Ouarzazate", "Ezzhiliga", "Ribate El Kheir", "El Menzel - Sefrou", "Zaouiat Bougrine", "Bir Tam Tam", "Ras Tabouda", "Sfassif-khemisset"
];

export default function LuxuryOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // LOGIQUE DE SÉLECTION
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [activeColorTab, setActiveColorTab] = useState<string | null>(null);
   
  const [customer, setCustomer] = useState({
    nom: '',
    phone: '',
    ville: '',
    adresse: '',
  });

  // --- VALIDATION TÉLÉPHONE (Maroc) ---
  const isValidPhone = (phone: string) => {
    // Regex pour 06, 07 ou 05 suivi de 8 chiffres
    const regex = /^(06|07|05)\d{8}$/;
    return regex.test(phone.trim());
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!product?.images?.length || !touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > 40) {
      if (distance > 0 && currentIndex < product.images.length - 1) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        setActiveImage(product.images[next].image);
      } else if (distance < 0 && currentIndex > 0) {
        const prev = currentIndex - 1;
        setCurrentIndex(prev);
        setActiveImage(product.images[prev].image);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProducts(`id=${id}`);
        const p = Array.isArray(data) ? data.find((x: any) => x.id === id) : data;
        setProduct(p);
        if (p?.images?.length) setActiveImage(p.images[0].image);
        if (p?.colors?.length) setActiveColorTab(p.colors[0].name);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#B51A59] rounded-full animate-spin" />
      </div>
    );
  }

  const productPrice = Number(product.price);
  const deliveryFee = 15;
  const totalArticles = Object.values(selectedItems).reduce((acc, sizes) => acc + sizes.length, 0);
  const subtotal = totalArticles * productPrice;
  const totalPrice = totalArticles > 0 ? subtotal + deliveryFee : 0;

  // --- WHATSAPP MESSAGE ---
  const generateWhatsAppLink = () => {
    const whatsappNumber = '212606026676';
    let message = "";

    // Si aucune sélection : Message de curiosité simple
    if (totalArticles === 0) {
      message = `Bonjour Feminity 👋\n\nJe souhaiterais avoir plus d'informations sur le produit : *${product.name}*.`;
    } 
    // Sinon : Message complet avec les infos saisies
    else {
      const selectionText = Object.entries(selectedItems)
        .map(([color, sizes]) => `   • ${color} : ${sizes.join(', ')}`)
        .join('\n');

      message = `Bonjour Feminity 👋\n\n*NOUVELLE COMMANDE*\n--------------------------\n📦 *PRODUIT :* ${product.name}\n💰 *PRIX UNITAIRE :* ${product.price} DH\n\n👤 *CLIENT :*\n- *Nom :* ${customer.nom || 'Non renseigné'}\n- *Tél :* ${customer.phone || 'Non renseigné'}\n- *Ville :* ${customer.ville || 'Non renseignée'}\n- *Adresse :* ${customer.adresse || 'Non renseignée'}\n\n👗 *SÉLECTION :*\n${selectionText}\n\n--------------------------\n🔢 *QUANTITÉ TOTALE :* ${totalArticles}\n💵 *TOTAL À PAYER :* ${totalPrice.toFixed(2)} DH (Livraison incluse)`;
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const toggleSizeForColor = (colorName: string, sizeLabel: string) => {
    setSelectedItems((prev) => {
      const currentSizes = prev[colorName] || [];
      if (currentSizes.includes(sizeLabel)) {
        const nextSizes = currentSizes.filter((s) => s !== sizeLabel);
        const newObj = { ...prev };
        if (nextSizes.length === 0) delete newObj[colorName]; else newObj[colorName] = nextSizes;
        return newObj;
      } else {
        return { ...prev, [colorName]: [...currentSizes, sizeLabel] };
      }
    });
  };

  // Validation globale du formulaire
  const isFormValid = customer.nom.trim().length > 2 && 
                      isValidPhone(customer.phone) && 
                      customer.ville !== '' && 
                      customer.adresse.trim().length > 1 && 
                      totalArticles > 0;

 const handleConfirmOrder = async () => {
    if (!isFormValid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // 1. On extrait toutes les tailles choisies pour les mettre dans le champ "selected_size"
    // On transforme l'objet { "Red": ["XS", "S"] } en une chaîne "XS, S"
    const allSizes = Object.values(selectedItems).flat().join(', ');

    // 2. On prépare le texte détaillé des couleurs et tailles pour le champ "selected_colors"
    const detailedSelection = Object.entries(selectedItems)
      .map(([color, sizes]) => `${color}: ${sizes.join(', ')}`)
      .join(' | ');

    const payload = {
      product: product.id,
      full_name: customer.nom,
      phone: customer.phone,
      city: customer.ville,
      address: customer.adresse,
      selected_size: allSizes,        // ✅ Corrigé : utilise la liste des tailles
      selected_colors: detailedSelection, // ✅ Corrigé : contient "Couleur: Taille1, Taille2"
      total_price: totalPrice,
      quantity: totalArticles
    };

    try {
      const response = await api.postOrder(payload);

      // NOUVEAU CODE (Sauvegarde l'ID en cachette avant de changer de page)
      if (response && response.id) {
        // 1. On sauvegarde l'ID dans le navigateur
        localStorage.setItem('last_order_id', response.id);
        
        // 2. On redirige vers la page (sans l'ID dans l'URL)
        router.push('/order-confirmation');
      
      } else {
        alert("Erreur technique : Django n'a pas renvoyé d'ID");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la commande");
    }
  };
  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <SeasonalNavigationBar />

      <main className="max-w-6xl mx-auto pt-24 px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* SECTION IMAGES */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[3/4] overflow-hidden border border-[#E5E5E5] rounded-xl"
                 onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="flex transition-transform duration-300 h-full"
                   style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative w-full flex-shrink-0 h-full bg-[#F6F6F6]">
                    <AppImage src={img.image} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-[#B51A59] w-4' : 'bg-black/20'} transition-all`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images?.map((img, idx) => (
                <button key={idx} onClick={() => {setActiveImage(img.image); setCurrentIndex(idx);}}
                  className={`relative aspect-square overflow-hidden border rounded-md transition ${activeImage === img.image ? 'border-[#B51A59]' : 'border-[#E5E5E5]'}`}>
                  <AppImage src={img.image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION INFOS */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight">{product.name}</h1>
              <p className="text-2xl font-black text-[#B51A59] mt-2">{product.price} DH</p>
            </div>

           {/* ... code avant ... */}

<div>
  <p className="text-xs font-bold uppercase tracking-widest text-[#B6B6B6] mb-3">1. Choisissez une couleur</p>
  <div className="flex gap-3 flex-wrap">
    {product.colors?.map((c: any) => (
      <button 
        key={c.id} 
        onClick={() => {
          // 1. On active l'onglet de la couleur (ton code actuel)
          setActiveColorTab(c.name);

          // 2. NOUVEAU : On cherche l'image associée à cette couleur
          // On cherche l'index de l'image qui a le même color_id que la couleur cliquée
          const imageIndex = product.images.findIndex((img: any) => img.color_id === c.id);

          // Si une image est trouvée (index différent de -1), on met à jour le slider
          if (imageIndex !== -1) {
            setCurrentIndex(imageIndex);
            setActiveImage(product.images[imageIndex].image);
          }
        }}
        className={`px-5 py-2 rounded-full text-sm font-bold transition border-2
          ${activeColorTab === c.name ? 'border-[#B51A59] text-[#B51A59]' : 'border-[#F6F6F6] bg-[#F6F6F6]'}`}>
        {c.name} {selectedItems[c.name] ? `(${selectedItems[c.name].length})` : ''}
      </button>
    ))}
  </div>
</div>

{/* ... suite du code ... */}

            {activeColorTab && (
              <div className="p-4 bg-[#F9F9F9] rounded-xl animate-in fade-in slide-in-from-top-2 border border-pink-50">
                <p className="text-xs font-bold uppercase text-[#222222] mb-3">2. Tailles pour : <span className="text-[#B51A59]">{activeColorTab}</span></p>
                <div className="flex gap-3">
                  {product.sizes?.map((s: any) => (
                    <button key={s.id} onClick={() => toggleSizeForColor(activeColorTab, s.label)}
                      className={`w-11 h-11 rounded-lg text-sm font-bold transition shadow-sm
                        ${selectedItems[activeColorTab]?.includes(s.label) ? 'bg-[#B51A59] text-white' : 'bg-white border border-[#E5E5E5]'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {totalArticles > 0 && (
              <div className="space-y-2 bg-pink-50/30 p-4 rounded-xl border border-pink-100/50">
                <p className="text-xs font-bold uppercase text-[#B51A59]">Ma Sélection :</p>
                <div className="text-sm space-y-1">
                  {Object.entries(selectedItems).map(([color, sizes]) => (
                    <div key={color} className="flex justify-between border-b border-pink-100 py-1 last:border-0">
                      <span className="font-bold">{color}</span>
                      <span className="font-medium text-gray-600 italic">Tailles: {sizes.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORMULAIRE */}
            <div className="space-y-4 pt-4 border-t border-[#F6F6F6]">
              <Input label="Nom complet *" value={customer.nom} onChange={(v) => setCustomer({ ...customer, nom: v })} placeholder="Votre nom" />
              
              {/* INPUT TÉLÉPHONE AVEC INDICATION D'ERREUR */}
              <div>
                <Input label="Téléphone (WhatsApp) *" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} placeholder="Ex: 0612345678" />
                {customer.phone.length > 0 && !isValidPhone(customer.phone) && (
                  <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1">Numéro invalide (ex: 0612345678)</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#222222] uppercase mb-1 ml-1">Ville *</label>
                  <select 
                    value={customer.ville} 
                    onChange={(e) => setCustomer({ ...customer, ville: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-[#F6F6F6] text-sm outline-none border-2 border-transparent focus:border-[#B51A59] transition-all"
                  >
                    <option value="">Sélectionner une ville</option>
                    {VILLES_MAROC.sort().map((ville) => (
                      <option key={ville} value={ville}>{ville}</option>
                    ))}
                  </select>
                </div>
                <Input label="Adresse *" value={customer.adresse} onChange={(v) => setCustomer({ ...customer, adresse: v })} placeholder="Quartier, rue..." />
              </div>
            </div>

            {/* TOTAL ET BOUTONS */}
            <div className="pt-6 bg-[#FDFDFD] p-6 rounded-2xl border border-[#F6F6F6] shadow-sm">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({totalArticles} articles)</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Frais de livraison</span>
                  <span>{deliveryFee.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <span className="font-bold text-lg">Total à payer</span>
                  <span className="text-2xl font-black text-[#B51A59]">{totalPrice.toFixed(2)} DH</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder} 
                disabled={!isFormValid}
                className={`w-full py-4 text-white font-bold uppercase rounded-lg shadow-xl transition active:scale-95 mb-4
                  ${isFormValid ? 'bg-[#B51A59] hover:bg-[#941548]' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Confirmer ma commande
              </button>

              <div className="flex items-center my-4 opacity-50">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="mx-4 text-[10px] font-bold uppercase text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                 className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold uppercase rounded-lg shadow-md transition active:scale-95">
                <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
                  <path d="M16.003 2.003c-7.732 0-14 6.268-14 14 0 2.733.793 5.281 2.158 7.444L2 30l6.742-2.115A13.93 13.93 0 0 0 16.003 30c7.732 0 14-6.268 14-14s-6.268-13.997-14-13.997zm0 25.5a11.44 11.44 0 0 1-5.84-1.604l-.42-.252-4.005 1.258 1.308-3.906-.275-.402a11.456 11.456 0 1 1 9.232 4.906zm6.292-8.563c-.344-.172-2.035-1.005-2.35-1.118-.315-.114-.544-.172-.773.172-.229.344-.887 1.118-1.087 1.347-.2.229-.4.258-.744.086-.344-.172-1.45-.534-2.763-1.703-1.022-.911-1.712-2.037-1.912-2.381-.2-.344-.021-.53.151-.702.154-.153.344-.4.515-.601.172-.2.229-.344.344-.573.114-.229.057-.43-.029-.601-.086-.172-.773-1.864-1.058-2.553-.278-.668-.56-.577-.773-.588l-.659-.012c-.229 0-.601.086-.916.43-.315.344-1.201 1.173-1.201 2.86s1.23 3.317 1.401 3.546c.172.229 2.422 3.7 5.87 5.187.82.353 1.46.564 1.959.722.823.262 1.573.225 2.165.137.66-.099 2.035-.83 2.322-1.63.287-.8.287-1.487.2-1.63-.086-.143-.315-.229-.659-.401z"/>
                </svg>
                Commander via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-black text-[#222222] uppercase mb-1 ml-1">{label}</label>
      <input 
        value={value} 
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl bg-[#F6F6F6] text-sm outline-none border-2 border-transparent focus:border-[#B51A59] focus:bg-white transition-all font-medium"
      />
    </div>
  );
}