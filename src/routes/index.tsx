import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import wheel from "@/assets/wheel.jpg";
import splitter from "@/assets/splitter.jpg";
import spoiler from "@/assets/spoiler.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BALTIC BODYKIT — Bodykitid ja veljed Baltikumis" },
      { name: "description", content: "Bodykitid, karbonosad ja veljed tarnega Eestisse, Lätti ja Leetu." },
      { property: "og:title", content: "BALTIC BODYKIT — Bodykitid ja veljed" },
      { property: "og:description", content: "Bodykitid, karbonosad ja veljed tarnega üle Baltikumi." },
    ],
  }),
  component: Index,
});

const categories = ["Kõik", "Bodykitid", "Veljed", "Spoilerid"] as const;

const products = [
  { name: "Forged FX-10 velg 19\"", cat: "Veljed", price: 389, img: wheel },
  { name: "Karbon esisplitter M-Line", cat: "Bodykitid", price: 549, img: splitter },
  { name: "GT karbonspoiler 1600mm", cat: "Spoilerid", price: 699, img: spoiler },
  { name: "Forged FX-10 velg 20\"", cat: "Veljed", price: 429, img: wheel },
  { name: "Widebody esisplitter V2", cat: "Bodykitid", price: 619, img: splitter },
  { name: "Track wing Pro 1700mm", cat: "Spoilerid", price: 849, img: spoiler },
];

function Index() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Kõik");
  const list = cat === "Kõik" ? products : products.filter((p) => p.cat === cat);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-3xl tracking-wider">
          BALTIC<span className="text-primary">BODYKIT</span>
        </span>
        <nav className="hidden gap-8 text-sm uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#tooted" className="hover:text-foreground">Tooted</a>
          <a href="#tarne" className="hover:text-foreground">Tarne</a>
        </nav>
      </header>

      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <img src={hero} alt="Widebody bodykitiga sportauto" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative z-10 max-w-2xl px-6 md:px-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Eesti · Läti · Leedu</p>
          <h1 className="text-7xl leading-none md:text-9xl">Tee oma auto<br />eriliseks</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Bodykitid, karbonosad ja veljed otse tootjalt — tasuta tarne üle Baltikumi.
          </p>
          <a href="#tooted" className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:brightness-110">
            Vaata tooteid
          </a>
        </div>
      </section>

      <section id="tooted" className="px-6 py-20 md:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-5xl md:text-6xl">Tooted</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-sm border px-4 py-2 text-sm uppercase tracking-wider transition ${
                  cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary">
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary">{p.cat}</p>
                  <h3 className="text-2xl">{p.name}</h3>
                </div>
                <span className="font-display text-3xl">{p.price} €</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tarne" className="grid gap-px border-y border-border bg-border md:grid-cols-3">
        {[
          ["Tasuta tarne", "Kõikidele tellimustele Eestis, Lätis ja Leedus."],
          ["7–14 päeva", "Otse tootja laost sinu ukseni."],
          ["14 päeva tagastus", "Ei sobinud? Saadad tagasi."],
        ].map(([t, d]) => (
          <div key={t} className="bg-background p-10">
            <h3 className="text-3xl">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <footer className="px-6 py-10 text-sm text-muted-foreground md:px-12">
        © 2026 Baltic Bodykit
      </footer>
    </div>
  );
}
