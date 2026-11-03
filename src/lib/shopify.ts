import { queryOptions } from '@tanstack/react-query';

export type Money = { amount: string; currencyCode: string };
export type Variant = { id: string; title: string; availableForSale: boolean; price: Money; selectedOptions: { name: string; value: string }[] };
export type ShopProduct = { id: string; title: string; handle: string; description: string; productType: string; tags: string[]; images: { nodes: { url: string; altText: string | null }[] }; variants: { nodes: Variant[] } };
export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch('https://baltic-auto-style-keok0-shidpdv1.myshopify.com/api/2026-10/graphql.json', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': 'c6aae713ce4b559c2c0d5e1ed5b36932' }, body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify vastas veaga (${response.status}).`);
  const result = await response.json() as { data: T; errors?: { message: string }[] };
  if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join(', '));
  return result.data;
}
const fields = `id title handle description productType tags images(first:5){nodes{url altText}} variants(first:100){nodes{id title availableForSale price{amount currencyCode} selectedOptions{name value}}}`;
export const productsOptions = queryOptions({ queryKey: ['shopify-products'], queryFn: async () => {
  const result = await storefrontApiRequest<{ products: { nodes: ShopProduct[] } }>(`query { products(first:250){nodes{${fields}}} }`);
  return result.products.nodes;
} });
export const productOptions = (handle: string) => queryOptions({ queryKey: ['shopify-product', handle], queryFn: async () => {
  const result = await storefrontApiRequest<{ product: ShopProduct | null }>(`query($handle:String!){product(handle:$handle){${fields}}}`, { handle });
  return result.product;
} });
export const formatMoney = (price: Money) => new Intl.NumberFormat('et-EE', { style: 'currency', currency: price.currencyCode }).format(Number(price.amount));