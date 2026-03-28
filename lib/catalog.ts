import { cache } from "react";
import { db } from "@/lib/db";
import type { Store } from "@/lib/domain";
import { getStoreBySlug } from "@/lib/data";

export function toCatalogSegment(value: string) {
  return value.trim().toLowerCase().replaceAll(/\s+/g, "-");
}

export function buildAreaCategoryPath(area: string, category: string) {
  return `/areas/${encodeURIComponent(toCatalogSegment(area))}/${encodeURIComponent(toCatalogSegment(category))}`;
}

type AreaCategoryView = {
  area: string;
  category: string;
  stores: Store[];
};

export const getAreaCategoryStaticParams = cache(async () => {
  const stores = await db.store.findMany({
    select: {
      area: true,
      category: true
    }
  });

  const seen = new Set<string>();

  return stores
    .map((store) => ({
      area: toCatalogSegment(store.area),
      category: toCatalogSegment(store.category)
    }))
    .filter((entry) => {
      const key = `${entry.area}:${entry.category}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
});

export const getAreaCategoryView = cache(async (areaSegment: string, categorySegment: string) => {
  const stores = await db.store.findMany({
    select: {
      slug: true,
      area: true,
      category: true
    }
  });

  const matched = stores.filter(
    (store) =>
      toCatalogSegment(store.area) === areaSegment && toCatalogSegment(store.category) === categorySegment
  );

  if (matched.length === 0) {
    return null;
  }

  const fullStores = await Promise.all(matched.map((store) => getStoreBySlug(store.slug)));
  const safeStores = fullStores.filter((store): store is Store => Boolean(store));

  return {
    area: matched[0].area,
    category: matched[0].category,
    stores: safeStores
  } satisfies AreaCategoryView;
});
