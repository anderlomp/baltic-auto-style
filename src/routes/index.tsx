import { createFileRoute } from "@tanstack/react-router";
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
      { name: "description", content: "Kereosad, veljed, spoilerid, võhk ja jõudlusosad tarnega Eestisse, Lätti ja Leetu." },
      { property: "og:title", content: "BALTIC TUNING — Tuuningosad Baltikumis" },
      { property: "og:description", content: "Tuuningosad kere, rataste, võhku ja jõudlusele — tarne üle Baltikumi." },
    ],
  }),
  component: Index,
});

const productGroups = [
  {
    cat: "Kereosad",
    items: [
      { name: "Karbon esisplitter M-Line", price: 549, img: splitter },
      { name: "Widebody esisplitter V2", price: 619, img: splitter },
      { name: "Karbon näosirm GT-Line", price: 479, img: splitter },
    ],
  },
  {
    cat: "Veljed",
    items: [
      { name: "Forged FX-10 velg 19\"", price: 389, img: wheel },
      { name: "Forged FX-10 velg 20\"", price: 429, img: wheel },
    ],
  },
  {
    cat: "Spoilerid",
    items: [
      { name: "GT karbonspoiler 1600mm", price: 699, img: spoiler },
      { name: "Track wing Pro 1700mm", price: 849, img: spoiler },
    ],
  },
  {
    cat: "Võhk",
    items: [
      { name: "Coilover komplekt CR-9", price: 649, img: coilover },
      { name: "Sportvedrud E-Line", price: 219, img: coilover },
    ],
  },
  {
    cat: "Jõudlus",
    items: [
      { name: "Sport heitkogus E-2", price: 799, img: exhaust },
      { name: "Heitkolbide komplekt SS", price: 349, img: exhaust },
    ],
  },
];

function Index() {
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
            Tuuningosad — kere, veljed, võhk ja jõudlus — otse tootjalt, tarnega üle Baltikumi.
          </p>
          <a href="#tooted" className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:brightness-110">
            Vaata tooteid
          </a>
        </div>
      </section>

      <section id="tooted" className="px-6 py-20 md:px-12">
        <h2 className="mb-10 text-5xl md:text-6xl">Tooted</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {productGroups.map((group) => (
            <div key={group.cat} className="flex flex-col gap-4">
              <h3 className="border-b border-border pb-3 text-xl uppercase tracking-widest text-primary">{group.cat}</h3>
              {group.items.map((p) => (
                <article key={p.name} className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.img} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg leading-tight">{p.name}</h3>
                    <span className="mt-2 block font-display text-2xl">{p.price} €</span>
                  </div>
                </article>
              ))}
            </div>
          ))}
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
