import type { Metadata } from 'next';
import MainShoppingInteractive from './components/MainShoppingInteractive';

export const metadata: Metadata = {
  title: 'Boutique - Feminity Store',
  description: 'Découvrez notre collection de vêtements féminins élégants. Robes, hauts, pantalons, jupes et accessoires pour toutes les occasions. Collections printemps/été et automne/hiver disponibles.',
};

export default function MainShoppingInterfacePage() {
  return <MainShoppingInteractive />;
}