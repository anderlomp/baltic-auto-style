import { Link } from '@tanstack/react-router';
import { Truck, ArrowUpRight } from 'lucide-react';
import { ShopCart } from './shop-cart';

export function StoreHeader() {
  return <>
    <div className="border-b border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-2 px-5 py-2 text-xs md:px-8">
        <span>EESTI · LÄTI · LEEDU</span><span className="flex items-center gap-2"><Truck size={14} /> Tarne 7–14 päeva · 14 päeva tagastus</span>
      </div>
    </div>
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-6 md:px-8">
        <Link to="/" className="font-display text-3xl leading-none md:text-4xl">BALTIC<span className="text-primary">TUNING</span></Link>
        <span className="hidden text-sm text-muted-foreground lg:block">Kereosad / Veljed / Vedrustus / Väljalaskesüsteem</span>
        <ShopCart />
      </div>
      <div className="border-t border-border">
        <nav className="mx-auto flex max-w-[1440px] items-center gap-7 px-5 py-3 text-sm font-semibold md:px-8">
          <Link to="/" className="hover:text-primary">Kõik tooted</Link><Link to="/" search={{ category: 'Downpipe' }} className="flex items-center gap-2 text-primary">Downpipe <ArrowUpRight size={15} /></Link>
          <span className="ml-auto hidden text-xs font-normal text-muted-foreground sm:block">Tuuningosad Baltikumis</span>
        </nav>
      </div>
    </header>
  </>;
}