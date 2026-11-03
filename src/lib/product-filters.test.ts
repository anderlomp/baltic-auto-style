import { describe, expect, it } from 'vitest';
import { filterProducts, vehicleOptions } from './product-filters';
import type { ShopProduct } from './shopify';

const product = (id: string, tags: string[]): ShopProduct => ({ id, title: id, handle: id, description: '', productType: 'Downpipe', tags, images: { nodes: [] }, variants: { nodes: [] } });
const products = [product('audi-a4', ['make:Audi', 'model:Audi:A4']), product('bmw-e90', ['make:BMW', 'model:BMW:E90']), product('unknown-fitment', [])];
describe('Model-based downpipe search', () => {
  it('returns only verified Audi A4 fitment for an Audi A4 search', () => {
    expect(filterProducts(products, { category: 'Downpipe', make: 'Audi', model: 'A4', search: '' }).map(p => p.id)).toEqual(['audi-a4']);
  });
  it('derives vehicle choices only from product fitment, not supplier categories', () => {
    expect(vehicleOptions(products)).toEqual({ Audi: ['A4'], BMW: ['E90'] });
  });
});