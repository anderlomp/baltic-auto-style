import { useEffect, useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/stores/cart';
import { formatMoney } from '@/lib/shopify';
export function ShopCart() {
  const { cart, busy, error, update, sync } = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    void useCart.persist.rehydrate();
    void sync();
    const visible = () => { if (document.visibilityState === 'visible') void sync(); };
    document.addEventListener('visibilitychange', visible);
    return () => document.removeEventListener('visibilitychange', visible);
  }, [sync]);
  const count = cart?.lines.nodes.reduce((sum, l) => sum + l.quantity, 0) ?? 0;
  return <Sheet open={open} onOpenChange={value => { setOpen(value); if (value) void sync(); }}>
    <SheetTrigger asChild><Button variant="outline" aria-label="Ostukorv"><ShoppingCart />{count > 0 && count}</Button></SheetTrigger>
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader><SheetTitle>Ostukorv</SheetTitle><SheetDescription>{count} toodet</SheetDescription></SheetHeader>
      <div className="flex-1 overflow-auto py-6">
        {!count && <p className="text-muted-foreground">Ostukorv on tühi.</p>}
        {cart?.lines.nodes.map(line => <div key={line.id} className="border-b border-border py-4">
          <p>{line.merchandise.product.title}</p><p className="text-muted-foreground">{formatMoney(line.merchandise.price)}</p>
          <div className="mt-3 flex items-center gap-3">
            <Button size="icon" variant="outline" aria-label="Vähenda kogust" disabled={busy} onClick={() => void update(line.id, line.quantity - 1)}><Minus /></Button>
            <span>{line.quantity}</span><Button size="icon" variant="outline" aria-label="Suurenda kogust" disabled={busy} onClick={() => void update(line.id, line.quantity + 1)}><Plus /></Button>
            <Button size="icon" variant="ghost" aria-label="Eemalda toode" disabled={busy} onClick={() => void update(line.id, 0)}><Trash2 /></Button>
          </div>
        </div>)}
      </div>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {cart && count > 0 && <><p>Kokku: {formatMoney(cart.cost.totalAmount)}</p><Button disabled={busy} onClick={() => {
        const url = new URL(cart.checkoutUrl); url.searchParams.set('channel', 'online_store'); window.open(url.toString(), '_blank');
      }}>Mine maksma</Button></>}
    </SheetContent>
  </Sheet>;
}