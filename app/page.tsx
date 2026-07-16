import Storefront from '@/components/Storefront';
import { products } from '@/data/products';

export default async function Home() {
  return <Storefront initialProducts={products} />;
}

