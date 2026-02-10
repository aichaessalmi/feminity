import React from 'react';
// Vérifie que ce chemin vers ton CSS est correct
import '../styles/index.css'; 
import Script from 'next/script';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Feminity - Mode Féminine',
  description: 'Boutique en ligne de mode féminine - Robes, Accessoires, Chaussures',
  icons: {
    icon: [
      { url: '/icon.ico', sizes: '64x64', type: 'image/ico' },
      { url: '/icon.ico', sizes: '64x64', type: 'image/ico' },
    ],
    apple: '/icon.ico',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {/* 
            On a supprimé <AuthProvider> car il n'est plus défini.
            Ton application fonctionnera maintenant sans erreur.
        */}
        {children}

        {/* Chargement optimisé des scripts Rocket */}
        <Script 
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffeminitys4718back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.12"
          strategy="afterInteractive"
        />
        <Script 
          src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}