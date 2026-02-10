'use client';

import React from 'react';
import { AppIcon } from '@/components/ui/AppIcon';

const ContactSection = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://facebook.com',
      color: 'hover:text-[#1877F2]',
      bgColor: 'hover:bg-[#1877F2]/10'
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: 'https://wa.me/',
      color: 'hover:text-[#25D366]',
      bgColor: 'hover:bg-[#25D366]/10'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://instagram.com',
      color: 'hover:text-[#E4405F]',
      bgColor: 'hover:bg-[#E4405F]/10'
    }
  ];

  return (
    <section className="w-full bg-card border-t border-border py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Contactez-nous
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Suivez-nous sur les réseaux sociaux
          </p>
          
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {socialLinks?.map((social) => (
              <a
                key={social?.name}
                href={social?.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background border-2 border-border transition-all duration-300 hover-lift press-down ${social?.bgColor}`}
                aria-label={social?.name}
              >
                <AppIcon
                  name={social?.icon}
                  className={`w-6 h-6 sm:w-7 sm:h-7 text-foreground transition-colors duration-300 ${social?.color}`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;