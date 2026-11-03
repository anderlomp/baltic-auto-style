import { Link } from '@tanstack/react-router';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';
import { formatMoney, type ShopProduct } from '@/lib/shopify';
import { useCart } from '@/stores/cart';

export function ProductCard({ product }: { product: ShopProduct }) {
  const { add, busy } = useCart();
  const variant = product.variants.nodes[0];
  const image = product.images.nodes[0];
  return <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card">
    <Link to="/product/$handle" params={{ handle: product.handle }} className="block overflow-hidden border-b border-border">
      {image ? <img src={image.url} alt={image.altText || product.title} loading="lazy" width={640} height={640} className="aspect-square w-full object-contain p-5 transition duration-300 group-hover:scale-105 motion-reduce:transform-none" /> : <div className="flex aspect-square items-center justify-center text-muted-foreground">Pilt puudub</div>}
    </Link>
    <div className="flex flex-1 flex-col p-4">
      <p className="mb-2 text-xs font-semibold uppercase text-primary">{product.productType}</p>
      <Link to="/product/$handle" params={{ handle: product.handle }} className="flex-1 text-sm font-semibold leading-relaxed hover:text-primary">{product.title}</Link>
      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
      {variant && <p className="my-4 text-xl font-semibold">{formatMoney(variant.price)}</p>}
      <div className="flex gap-2"><Button className="flex-1" disabled={busy || !variant?.availableForSale} onClick={() => { if (variant) void add(variant.id); }}><ShoppingCart size={16} />{variant?.availableForSale ? 'Lisa ostukorvi' : 'Pole saadaval'}</Button><Button variant="outline" size="icon" asChild><Link to="/product/$handle" params={{ handle: product.handle }} aria-label={`Vaata: ${product.title}`}><ArrowUpRight size={17} /></Link></Button></div>
    </div>
  </article>;
}