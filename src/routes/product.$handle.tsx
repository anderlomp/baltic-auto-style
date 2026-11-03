import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { productOptions, formatMoney } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { ShopCart } from '@/components/shop-cart';
import { useCart } from '@/stores/cart';

export const Route = createFileRoute('/product/$handle')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productOptions(params.handle)),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? 'Toode'} — Baltic Tuning` },
    { name: 'description', content: loaderData?.description || 'Baltic Tuning tuuningosad Baltikumis.' },
    { property: 'og:title', content: `${loaderData?.title ?? 'Toode'} — Baltic Tuning` },
    { property: 'og:description', content: loaderData?.description || 'Baltic Tuning tuuningosad Baltikumis.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    ...(loaderData?.images.nodes[0]?.url.startsWith('https://') ? [
      { property: 'og:image', content: loaderData.images.nodes[0].url }, { name: 'twitter:image', content: loaderData.images.nodes[0].url },
    ] : []),
  ] }),
  component: Product,
});
function Product() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productOptions(handle));
  const [selected, setSelected] = useState('');
  const { add, busy, error } = useCart();
  const variant = product?.variants.nodes.find(v => v.id === selected) ?? product?.variants.nodes[0];
  return <main className="min-h-screen px-6 py-8 md:px-12">
    <header className="mb-12 flex justify-between"><Link to="/" className="font-display text-3xl">BALTIC TUNING</Link><ShopCart /></header>
    {!product ? <h1 className="text-4xl">Toodet ei leitud.</h1> : <div className="grid gap-8 md:grid-cols-2">
      <div>{product.images.nodes.map(img => <img key={img.url} src={img.url} alt={img.altText || product.title} width={1024} height={1024} className="mb-4 w-full object-contain" />)}</div>
      <div><p className="text-primary">{product.productType}</p><h1 className="my-4 text-5xl">{product.title}</h1><p className="whitespace-pre-line text-muted-foreground">{product.description}</p>
        {product.variants.nodes.length > 1 && <select aria-label="Variant" value={variant?.id ?? ''} onChange={e => setSelected(e.target.value)} className="mt-6 border border-border bg-card p-3">{product.variants.nodes.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}</select>}
        {variant && <p className="my-6 text-3xl">{formatMoney(variant.price)}</p>}
        <Button disabled={busy || !variant?.availableForSale} onClick={() => { if (variant) void add(variant.id); }}>{variant?.availableForSale ? 'Lisa ostukorvi' : 'Pole saadaval'}</Button>
        {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      </div>
    </div>}
  </main>;
}