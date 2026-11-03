import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storefrontApiRequest, type Money } from '@/lib/shopify';

type CartLine = { id: string; quantity: number; merchandise: { id: string; title: string; price: Money; product: { title: string } } };
type Cart = { id: string; checkoutUrl: string; lines: { nodes: CartLine[] }; cost: { totalAmount: Money } };
type State = { cart: Cart | null; busy: boolean; error: string; add: (id: string) => Promise<void>; update: (id: string, quantity: number) => Promise<void>; sync: () => Promise<void> };
const fields = `id checkoutUrl lines(first:100){nodes{id quantity merchandise{... on ProductVariant{id title price{amount currencyCode} product{title}}}}} cost{totalAmount{amount currencyCode}}`;
type Payload = { cart: Cart | null; userErrors: { message: string }[] };
export const useCart = create<State>()(persist((set, get) => ({
  cart: null, busy: false, error: '',
  add: async (id) => {
    if (get().busy) return;
    set({ busy: true, error: '' });
    try {
      const cart = get().cart;
      const key = cart ? 'cartLinesAdd' : 'cartCreate';
      const query = cart ? `mutation($cartId:ID!,$lines:[CartLineInput!]!){cartLinesAdd(cartId:$cartId,lines:$lines){cart{${fields}} userErrors{message}}}` : `mutation($input:CartInput!){cartCreate(input:$input){cart{${fields}} userErrors{message}}}`;
      const lines = [{ merchandiseId: id, quantity: 1 }];
      const data = await storefrontApiRequest<Record<string, Payload>>(query, cart ? { cartId: cart.id, lines } : { input: { lines } });
      const payload = data[key];
      if (!payload || payload.userErrors.length) throw new Error(payload?.userErrors.map(e => e.message).join(', ') || 'Ostukorvi ei saanud lisada.');
      set({ cart: payload.cart });
    } catch (e) { set({ error: e instanceof Error ? e.message : 'Ostukorvi viga.' }); } finally { set({ busy: false }); }
  },
  update: async (id, quantity) => {
    const cart = get().cart;
    if (!cart || get().busy) return;
    set({ busy: true, error: '' });
    try {
      const key = quantity > 0 ? 'cartLinesUpdate' : 'cartLinesRemove';
      const query = quantity > 0 ? `mutation($cartId:ID!,$lines:[CartLineUpdateInput!]!){cartLinesUpdate(cartId:$cartId,lines:$lines){cart{${fields}} userErrors{message}}}` : `mutation($cartId:ID!,$lineIds:[ID!]!){cartLinesRemove(cartId:$cartId,lineIds:$lineIds){cart{${fields}} userErrors{message}}}`;
      const data = await storefrontApiRequest<Record<string, Payload>>(query, quantity > 0 ? { cartId: cart.id, lines: [{ id, quantity }] } : { cartId: cart.id, lineIds: [id] });
      const payload = data[key];
      if (!payload || payload.userErrors.length) throw new Error(payload?.userErrors.map(e => e.message).join(', ') || 'Ostukorvi viga.');
      set({ cart: payload.cart });
    } catch(e) { set({ error: e instanceof Error ? e.message : 'Ostukorvi viga.' }); } finally { set({ busy: false }); }
  },
  sync: async () => {
    const cart = get().cart;
    if (!cart || get().busy) return;
    try {
      const data = await storefrontApiRequest<{ cart: Cart | null }>(`query($id:ID!){cart(id:$id){${fields}}}`, { id: cart.id });
      set({ cart: data.cart });
    } catch(e) { set({ error: e instanceof Error ? e.message : 'Ostukorvi viga.' }); }
  },
}), { name: 'shopify-cart', skipHydration: true, partialize: state => ({ cart: state.cart }) }));