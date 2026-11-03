import type { ShopProduct } from './shopify';

export type CatalogFilters = { category: string; make: string; model: string; search: string };
export function vehicleOptions(products: ShopProduct[]) {
  const vehicles: Record<string, string[]> = {};
  for (const product of products) {
    for (const tag of product.tags) {
      if (tag.startsWith('make:')) vehicles[tag.slice(5)] ??= [];
      if (tag.startsWith('model:')) {
        const [, make, ...parts] = tag.split(':');
        const model = parts.join(':');
        if (make && model) {
          vehicles[make] ??= [];
          if (!vehicles[make].includes(model)) vehicles[make].push(model);
        }
      }
    }
  }
  for (const models of Object.values(vehicles)) models.sort();
  return vehicles;
}

export function filterProducts(products: ShopProduct[], filters: CatalogFilters) {
  return products.filter(product => {
    const downpipe = product.productType.toLowerCase() === 'downpipe' || product.tags.includes('category:downpipe');
    const universal = product.tags.includes('fit:universal');
    return (!filters.category || product.productType === filters.category || (filters.category === 'Downpipe' && downpipe) || (filters.category === 'Väljalaskesüsteem' && downpipe))
      && (!filters.make || product.tags.includes(`make:${filters.make}`) || universal)
      && (!filters.model || product.tags.includes(`model:${filters.make}:${filters.model}`) || universal)
      && (!filters.search || `${product.title} ${product.description} ${product.tags.join(' ')}`.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase().trim()));
  });
}