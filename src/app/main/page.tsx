'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router?.replace('/main-shopping-interface');
  }, [router]);
  
  return null;
}