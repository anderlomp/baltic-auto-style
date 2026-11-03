import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { productOptions, formatMoney } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { ShopCart } from '@/components/shop-cart';
import { useCart } from '@/stores/cart';
import { StoreHeader } from '@/components/store-header';
import { ArrowLeft, ShoppingCart, Truck, RotateCcw } from 'lucide-react';

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
  const [imageIndex, setImageIndex] = useState(0);
  const { add, busy, error } = useCart();
  const variant = product?.variants.nodes.find(v => v.id === selected) ?? product?.variants.nodes[0];
  const image = product?.images.nodes[imageIndex] ?? product?.images.nodes[0];
  const fitment = product?.tags.filter(t => t.startsWith('model:')).map(t => t.slice(6).replaceAll(':', ' ')) ?? [];
  return <div className="min-h-screen bg-background"><StoreHeader /><main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
    <Link to="/" search={{ category: 'Downpipe' }} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} /> Tagasi kataloogi</Link>
    {!product ? <h1 className="text-4xl">Toodet ei leitud.</h1> : <>
      <p className="mb-6 text-xs text-muted-foreground">Baltic Tuning / {product.productType} / {product.title}</p>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div><div className="border border-border bg-card">{image && <img src={image.url} alt={image.altText || product.title} width={1024} height={1024} className="aspect-square w-full object-contain p-6" />}</div><div className="mt-3 flex gap-3 overflow-x-auto">{product.images.nodes.length > 1 && product.images.nodes.map((img, index) => <Button key={img.url} variant="outline" onClick={() => setImageIndex(index)} aria-label={`Tootepilt ${index + 1}`} aria-pressed={imageIndex === index} className={`h-20 w-20 shrink-0 p-2 ${imageIndex === index ? 'border-primary' : ''}`}><img src={img.url} alt="" className="h-full w-full object-contain" /></Button>)}</div></div>
        <div><p className="text-xs font-semibold uppercase text-primary">{product.productType}</p><h1 className="my-4 break-words text-3xl leading-tight md:text-4xl">{product.title}</h1>
          {fitment.length > 0 && <div className="my-5 border-y border-border py-4"><p className="mb-2 text-sm font-semibold">Sobivus</p><p className="text-sm text-muted-foreground">{fitment.join(' · ')}</p></div>}
          {product.variants.nodes.length > 1 && <select aria-label="Variant" value={variant?.id ?? ''} onChange={e => setSelected(e.target.value)} className="mt-4 w-full border border-border bg-card p-3">{product.variants.nodes.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}</select>}
          {variant && <p className="my-6 text-4xl font-semibold">{formatMoney(variant.price)}</p>}
          <Button size="lg" className="w-full sm:w-auto" disabled={busy || !variant?.availableForSale} onClick={() => { if (variant) void add(variant.id); }}><ShoppingCart size={19} />{variant?.availableForSale ? 'Lisa ostukorvi' : 'Pole saadaval'}</Button>
          {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
          <div className="mt-7 flex flex-wrap gap-6 border-t border-border py-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Truck size={18} /> Tarne Baltikumis 7–14 päeva</span><span className="flex items-center gap-2"><RotateCcw size={18} /> 14 päeva tagastus</span></div>
        </div>
      </div>
      <section className="mt-12 border-t border-border py-8"><h2 className="mb-5 text-3xl">Toote kirjeldus</h2><p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-muted-foreground">{product.description}</p></section>
    </>}
  </main></div>;
}