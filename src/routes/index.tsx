import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShopCart } from "@/components/shop-cart";
import { productsOptions, formatMoney } from "@/lib/shopify";
import { useCart } from "@/stores/cart";
import { downpipeCategories } from "@/lib/downpipe-categories";
import downpipe from "@/assets/downpipe.jpg";
import hero from "@/assets/hero.jpg";
import wheel from "@/assets/wheel.jpg";
import splitter from "@/assets/splitter.jpg";
import spoiler from "@/assets/spoiler.jpg";
import coilover from "@/assets/coilover.jpg";
import exhaust from "@/assets/exhaust.jpg";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsOptions),
  head: () => ({
    meta: [
      { title: "BALTIC TUNING — Tuuningosad Baltikumis" },
      { name: "description", content: "Kereosad, veljed, spoilerid, vedrustus ja väljalaskesüsteemid tarnega Eestisse, Lätti ja Leetu." },
      { property: "og:title", content: "BALTIC TUNING — Tuuningosad Baltikumis" },
      { property: "og:description", content: "Tuuningosad kere, rataste, vedrustuse ja väljalaskesüsteemi jaoks — tarne üle Baltikumi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { cat: "Kereosad", img: splitter },
  { cat: "Veljed", img: wheel },
  { cat: "Spoilerid", img: spoiler },
  { cat: "Vedrustus", img: coilover },
  { cat: "Väljalaskesüsteem", img: exhaust },
];

const cars: Record<string, string[]> = {
  Audi: ["A4", "RS4"],
  BMW: ["3-seeria", "M3"],
  Subaru: ["WRX"],
  Volkswagen: ["Golf"],
};

function Index() {
  const { data: products } = useSuspenseQuery(productsOptions);
  const { add, busy, error } = useCart();
  const [downpipeSelected, setDownpipeSelected] = useState(false);
  const [downpipeMake, setDownpipeMake] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const filtered = useMemo(() => products.filter(p => {
    const isDownpipe = p.productType.toLowerCase() === "downpipe" || p.tags.includes("category:downpipe");
    const categoryMatch = !cat || p.productType === cat || (cat === "Väljalaskesüsteem" && isDownpipe);
    const makeMatch = !make || p.tags.includes(`make:${make}`) || p.tags.includes("fit:universal");
    const modelMatch = !model || p.tags.includes(`model:${make}:${model}`) || p.tags.includes("fit:universal");
    const downpipeMakeMatch = !downpipeMake || (downpipeMake === "Universaalne" ? p.tags.includes("fit:universal") : p.tags.includes(`make:${downpipeMake}`));
    return categoryMatch && makeMatch && modelMatch && (!downpipeSelected || isDownpipe) && downpipeMakeMatch;
  }), [products, cat, make, model, downpipeSelected, downpipeMake]);

  const selectCls = "rounded-sm border border-border bg-card px-4 py-3 text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-3xl tracking-wider">
          BALTIC<span className="text-primary">TUNING</span>
        </span>
        <nav className="hidden gap-8 text-sm uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#tooted" className="hover:text-foreground">Tooted</a>
          <a href="#tarne" className="hover:text-foreground">Tarne</a>
        </nav>
        <ShopCart />
      </header>

      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <img src={hero} alt="Tuuningosadega sportauto" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative z-10 max-w-2xl px-6 md:px-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Eesti · Läti · Leedu</p>
          <h1 className="text-7xl leading-none md:text-9xl">Tee oma auto<br />eriliseks</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Tuuningosad — kere, veljed, vedrustus ja väljalaskesüsteem — otse tootjalt, tarnega üle Baltikumi.
          </p>
          <a href="#tooted" className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:brightness-110">
            Vaata tooteid
          </a>
        </div>
      </section>

      <section id="tooted" className="px-6 py-20 md:px-12">
        <h2 className="mb-8 text-5xl md:text-6xl">Leia osad oma autole</h2>
        <div className="mb-12 flex flex-wrap gap-3">
          <select aria-label="Mark" className={selectCls} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}>
            <option value="">Vali mark</option>
            {Object.keys(cars).map((m) => <option key={m}>{m}</option>)}
          </select>
          <select aria-label="Mudel" className={selectCls} value={model} disabled={!make} onChange={(e) => setModel(e.target.value)}>
            <option value="">Vali mudel</option>
            {(cars[make] ?? []).map((m) => <option key={m}>{m}</option>)}
          </select>
          {(make || cat || downpipeSelected) && (
            <Button variant="ghost" onClick={() => { setMake(""); setModel(""); setCat(null); setDownpipeSelected(false); setDownpipeMake(""); }} className="px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Tühista filtrid
            </Button>
          )}
        </div>

        <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Button variant="ghost" aria-label={c.cat}
              key={c.cat}
              onClick={() => { setCat(cat === c.cat ? null : c.cat); setDownpipeSelected(false); setDownpipeMake(""); }}
              className={`group relative h-auto whitespace-normal p-0 aspect-[4/3] overflow-hidden rounded-sm border-2 text-left transition ${cat === c.cat ? "border-primary" : "border-transparent hover:border-border"}`}
            >
              <img src={c.img} alt={c.cat} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <span className="absolute bottom-3 inset-x-3 break-words font-display text-xl uppercase">{c.cat}</span>
            </Button>
          ))}
        </div>

        {cat === "Väljalaskesüsteem" && <div className="mb-12">
          <Button variant="ghost" aria-label="Downpipe" aria-pressed={downpipeSelected} onClick={() => { setDownpipeSelected(!downpipeSelected); setDownpipeMake(""); }} className={`group relative mb-6 h-auto w-full max-w-sm aspect-[4/3] overflow-hidden p-0 border-2 ${downpipeSelected ? "border-primary" : "border-border"}`}>
            <img src={downpipe} alt="Downpipe" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute bottom-0 inset-x-0 bg-background/80 p-4 text-left font-display text-3xl">Downpipe</span>
          </Button>
          {downpipeSelected && <><h3 className="mb-4 text-3xl">Downpipe · automark</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {downpipeCategories.map(c => <Button key={c.source} variant={downpipeMake === c.name ? "default" : "outline"} aria-pressed={downpipeMake === c.name} onClick={() => { setDownpipeMake(downpipeMake === c.name ? "" : c.name); setMake(""); setModel(""); }} className="h-14 whitespace-normal">{c.name}</Button>)}
          </div></>}
        </div>}

        <p className="mb-6 text-sm uppercase tracking-widest text-muted-foreground">
          {filtered.length} toodet{make ? ` · ${make}${model ? " " + model : ""}` : ""}{cat ? ` · ${cat}` : ""}
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
          {filtered.map((p) => {
            const variant = p.variants.nodes[0];
            const image = p.images.nodes[0];
            return <article key={p.id} className="group overflow-hidden rounded-sm border border-border bg-card">
              <Link to="/product/$handle" params={{ handle: p.handle }}>
                {image && <img src={image.url} alt={image.altText || p.title} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover" />}
                <div className="p-4"><p className="text-xs text-primary">{p.productType}</p><h3 className="text-lg leading-tight">{p.title}</h3>{variant && <p className="mt-2 font-display text-2xl">{formatMoney(variant.price)}</p>}</div>
              </Link>
              <Button className="m-4 mt-0" disabled={busy || !variant?.availableForSale} onClick={() => { if (variant) void add(variant.id); }}>Lisa ostukorvi</Button>
            </article>;
          })}
          {filtered.length === 0 && <p className="col-span-full text-muted-foreground">Tooteid ei leitud.</p>}
          {error && <p role="alert" className="col-span-full text-destructive">{error}</p>}
        </div>
      </section>

      <section id="tarne" className="grid gap-px border-y border-border bg-border md:grid-cols-3">
        {[
          ["Tarne Baltikumis", "Eestisse, Lätti ja Leetu 7–14 päevaga."],
          ["Otse tootjalt", "Osad tulevad otse tootja laost sinu ukseni."],
          ["14 päeva tagastus", "Ei sobinud? Saadad tagasi."],
        ].map(([t, d]) => (
          <div key={t} className="bg-background p-10">
            <h3 className="text-3xl">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <footer className="px-6 py-10 text-sm text-muted-foreground md:px-12">
        © 2026 Baltic Tuning
      </footer>
    </div>
  );
}
