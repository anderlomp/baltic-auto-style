import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StoreHeader } from '@/components/store-header';
import { ProductCard } from '@/components/product-card';
import { productsOptions } from '@/lib/shopify';
import { filterProducts, vehicleOptions } from '@/lib/product-filters';
import { useCart } from '@/stores/cart';
import wheel from '@/assets/wheel.jpg';
import splitter from '@/assets/splitter.jpg';
import spoiler from '@/assets/spoiler.jpg';
import coilover from '@/assets/coilover.jpg';
import exhaust from '@/assets/exhaust.jpg';
import downpipe from '@/assets/downpipe.jpg';
import hero from '@/assets/hero.jpg';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined } => ({ category: typeof search['category'] === 'string' ? search['category'] : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsOptions),
  head: () => ({ meta: [
    { title: 'Baltic Tuning — Downpipe ja tuuningosad Baltikumis' },
    { name: 'description', content: 'Downpipe, kereosad, veljed ja vedrustus. Leia tuuningosad automargi ja mudeli järgi, tarnega üle Baltikumi.' },
    { property: 'og:title', content: 'Baltic Tuning — Downpipe ja tuuningosad' },
    { property: 'og:description', content: 'Tuuningosade kataloog ja mudelipõhine otsing. Tarne Eestisse, Lätti ja Leetu.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
const categories = [{ name: 'Kereosad', image: splitter }, { name: 'Veljed', image: wheel }, { name: 'Spoilerid', image: spoiler }, { name: 'Vedrustus', image: coilover }, { name: 'Väljalaskesüsteem', image: exhaust }, { name: 'Downpipe', image: downpipe }];
function Index() {
  const { data: products } = useSuspenseQuery(productsOptions);
  const { category: routeCategory } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const { error } = useCart();
  const category = routeCategory ?? '';
  const vehicles = useMemo(() => vehicleOptions(products), [products]);
  const filtered = useMemo(() => {
    const result = filterProducts(products, { category, make, model, search });
    return result.sort((a, b) => sort === 'price-asc' ? Number(a.variants.nodes[0]?.price.amount ?? 0) - Number(b.variants.nodes[0]?.price.amount ?? 0) : sort === 'price-desc' ? Number(b.variants.nodes[0]?.price.amount ?? 0) - Number(a.variants.nodes[0]?.price.amount ?? 0) : a.title.localeCompare(b.title));
  }, [products, category, make, model, search, sort]);
  const select = 'h-11 min-w-0 rounded-sm border border-input bg-card px-3 text-sm text-foreground disabled:opacity-50';
  return <div className="min-h-screen bg-background text-foreground">
    <StoreHeader />
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      <img src={hero} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />
      <div className="mx-auto flex min-h-[430px] max-w-[1440px] items-center px-5 py-16 md:min-h-[500px] md:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-red-400"><span className="h-px w-8 bg-primary" /> Tuuningosad Baltikumis</p>
          <h1 className="text-5xl leading-[0.95] tracking-wide sm:text-6xl md:text-7xl">Sinu auto.<br /><span className="text-primary">Sinu reeglid.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/75 md:text-lg">Leia downpipe’id ja tuuningosad, mis sobivad sinu autole. Sirvi kataloogi või alusta margi ja mudeli järgi.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 font-semibold"><Link to="/" search={{ category: 'Downpipe' }}>Vaata downpipe’e <ArrowRight size={17} /></Link></Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-white/40 bg-white/5 px-6 text-white hover:bg-white/15 hover:text-white"><a href="#tooted">Kogu kataloog</a></Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/20 pt-5 text-xs font-medium text-white/70"><span>Eesti · Läti · Leedu</span><span>Tarne 7–14 päeva</span><span>14 päeva tagastus</span></div>
        </div>
      </div>
    </section>
    <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
      <div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs uppercase text-muted-foreground">Baltic Tuning / Tootekataloog</p><h2 className="text-4xl md:text-5xl">{category || 'Tuuningosad'}</h2></div><span className="text-sm text-muted-foreground">{products.length} toodet</span></div>
      <div className="mb-8 grid grid-cols-3 gap-3 lg:grid-cols-6">{categories.map(c => <Button key={c.name} variant="ghost" aria-label={c.name} aria-pressed={category === c.name} onClick={() => void navigate({ search: { category: category === c.name ? undefined : c.name } })} className={`group flex h-auto flex-col gap-0 overflow-hidden whitespace-normal rounded-sm border p-0 ${category === c.name ? 'border-primary bg-card' : 'border-border bg-card'}`}><img src={c.image} alt={c.name} className="aspect-[3/2] w-full object-cover" width={480} height={320} /><span className="flex min-h-12 w-full items-center justify-center px-2 py-2 text-center text-xs font-semibold sm:text-sm">{c.name}</span></Button>)}</div>
      <div className="mb-8 grid gap-3 border-y border-border py-5 md:grid-cols-[1fr_1fr_2fr]"><select aria-label="Mark" className={select} value={make} onChange={e => { setMake(e.target.value); setModel(''); }}><option value="">Kõik automargid</option>{Object.keys(vehicles).sort().map(m => <option key={m}>{m}</option>)}</select><select aria-label="Mudel" className={select} value={model} disabled={!make} onChange={e => setModel(e.target.value)}><option value="">Kõik mudelid</option>{(vehicles[make] ?? []).map(m => <option key={m}>{m}</option>)}</select><div className="relative"><Search size={18} className="absolute left-3 top-3 text-muted-foreground" /><Input aria-label="Otsi toodet" value={search} onChange={e => setSearch(e.target.value)} placeholder="Toote nimi, mootor või tootekood" className="h-11 bg-card pl-10" /></div></div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-border pb-5 lg:border-b-0 lg:border-r lg:pr-6"><h2 className="mb-4 flex items-center gap-2 text-xl"><SlidersHorizontal size={18} /> Kategooriad</h2><div className="flex flex-wrap gap-1 lg:flex-col"><Button variant={!category ? 'secondary' : 'ghost'} className="justify-start" onClick={() => void navigate({ search: {} })}>Kõik tooted</Button>{categories.map(c => <Button key={c.name} variant={category === c.name ? 'secondary' : 'ghost'} className="justify-start whitespace-normal text-left" onClick={() => void navigate({ search: { category: c.name } })}>{c.name}<span className="ml-auto text-xs text-muted-foreground">{filterProducts(products, { category: c.name, make: '', model: '', search: '' }).length}</span></Button>)}</div><div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Tarne Baltikumis</p><p className="mt-2">7–14 päeva</p><p className="mt-1">14 päeva tagastus</p></div></aside>
        <section id="tooted"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><p className="text-sm">{filtered.length} toodet{make ? ` · ${make} ${model}` : ''}</p>{(make || model || search || category) && <Button variant="ghost" size="sm" onClick={() => { setMake(''); setModel(''); setSearch(''); void navigate({ search: {} }); }}><X size={14} /> Tühista</Button>}</div><select aria-label="Sorteerimine" className={select} value={sort} onChange={e => setSort(e.target.value)}><option value="title">Nimetus A–Z</option><option value="price-asc">Hind: kasvav</option><option value="price-desc">Hind: kahanev</option></select></div><div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>{filtered.length === 0 && <div className="border-y border-border py-16 text-center"><Search className="mx-auto mb-4 text-muted-foreground" size={28} /><h2 className="text-2xl">Tooteid ei leitud.</h2></div>}{error && <p role="alert" className="mt-5 text-destructive">{error}</p>}</section>
      </div>
    </main>
    <footer className="mt-10 border-t border-border bg-secondary px-5 py-7 text-sm text-secondary-foreground"><div className="mx-auto flex max-w-[1376px] flex-wrap justify-between gap-3"><span className="font-display text-xl">BALTIC TUNING</span><span>© 2026 Baltic Tuning · Eesti / Läti / Leedu</span></div></footer>
  </div>;
}
