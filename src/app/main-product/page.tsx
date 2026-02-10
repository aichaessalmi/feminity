'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainProductRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router?.replace('/admin-product-management-dashboard');
  }, [router]);
  
  return null;
}