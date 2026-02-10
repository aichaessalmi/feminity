'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router?.replace('/product-creation-form');
  }, [router]);
  
  return null;
}