import { redirect } from 'next/navigation';

export default function RootPage() {
  // Cette ligne dit à Next.js : "Si quelqu'un arrive sur /, envoie-le sur la boutique"
  redirect('/main-shopping-interface');
}