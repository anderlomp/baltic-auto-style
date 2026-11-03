import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import hero from "@/assets/hero.jpg";
import wheel from "@/assets/wheel.jpg";
import splitter from "@/assets/splitter.jpg";
import spoiler from "@/assets/spoiler.jpg";
import coilover from "@/assets/coilover.jpg";
import exhaust from "@/assets/exhaust.jpg";

export const Route = createFileRoute("/")({
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

// Sobivus: "Mark Mudel" või "*" = universaalne
type Product = { name: string; price: number; img: string; cat: string; fits: string[] };

const products: Product[] = [
  { name: "Karbon esisplitter M-Line", price: 549, img: splitter, cat: "Kereosad", fits: ["BMW 3-seeria", "BMW M3"] },
  { name: "Widebody esisplitter V2", price: 619, img: splitter, cat: "Kereosad", fits: ["Audi A4", "Audi RS4"] },
  { name: "Karbon näosirm GT-Line", price: 479, img: splitter, cat: "Kereosad", fits: ["Volkswagen Golf"] },
  { name: "Forged FX-10 velg 19\"", price: 389, img: wheel, cat: "Veljed", fits: ["*"] },
  { name: "Forged FX-10 velg 20\"", price: 429, img: wheel, cat: "Veljed", fits: ["*"] },
  { name: "GT karbonspoiler 1600mm", price: 699, img: spoiler, cat: "Spoilerid", fits: ["BMW M3", "Subaru WRX"] },
  { name: "Track wing Pro 1700mm", price: 849, img: spoiler, cat: "Spoilerid", fits: ["*"] },
  { name: "Coilover komplekt CR-9", price: 649, img: coilover, cat: "Vedrustus", fits: ["BMW 3-seeria", "Volkswagen Golf"] },
  { name: "Sportvedrud E-Line", price: 219, img: coilover, cat: "Vedrustus", fits: ["Audi A4", "Subaru WRX"] },
  { name: "Sport heitkogus E-2", price: 799, img: exhaust, cat: "Väljalaskesüsteem", fits: ["Volkswagen Golf", "Audi RS4"] },
  { name: "Heitkolbide komplekt SS", price: 349, img: exhaust, cat: "Väljalaskesüsteem", fits: ["*"] },
];

const cars: Record<string, string[]> = {
  Audi: ["A4", "RS4"],
  BMW: ["3-seeria", "M3"],
  Subaru: ["WRX"],
  Volkswagen: ["Golf"],
};

function Index() {
  const [cat, setCat] = useState<string | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const filtered = useMemo(() => {
    const car = make && model ? `${make} ${model}` : "";
    return products.filter(
      (p) =>
        (!cat || p.cat === cat) &&
        (!make || p.fits.includes("*") || (car ? p.fits.includes(car) : p.fits.some((f) => f.startsWith(make + " ")))),
    );
  }, [cat, make, model]);

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
          {(make || cat) && (
            <button onClick={() => { setMake(""); setModel(""); setCat(null); }} className="px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Tühista filtrid
            </button>
          )}
        </div>

        <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <button
              key={c.cat}
              onClick={() => setCat(cat === c.cat ? null : c.cat)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-sm border-2 text-left transition ${cat === c.cat ? "border-primary" : "border-transparent hover:border-border"}`}
            >
              <img src={c.img} alt={c.cat} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <span className="absolute bottom-3 left-4 font-display text-2xl uppercase tracking-wider">{c.cat}</span>
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm uppercase tracking-widest text-muted-foreground">
          {filtered.length} toodet{make ? ` · ${make}${model ? " " + model : ""}` : ""}{cat ? ` · ${cat}` : ""}
        </p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
          {filtered.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary">
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-primary">{p.cat}</p>
                <h3 className="text-lg leading-tight">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.fits.includes("*") ? "Universaalne" : p.fits.join(", ")}</p>
                <span className="mt-2 block font-display text-2xl">{p.price} €</span>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground">Sellele valikule tooteid veel pole.</p>}
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
