import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getCatalogCategories, getActiveProducts } from "@/lib/products";
import { standCategories } from "@/data/stand-categories";
import { useCases } from "@/data/use-cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/shop/by-stand"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/shop/stands"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/shop/use"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/how-it-works"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/pricing"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms-of-service"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/shipping-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getCatalogCategories().map((category) => ({
    url: absoluteUrl(`/category/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const standCategoryRoutes: MetadataRoute.Sitemap = standCategories.map((category) => ({
    url: absoluteUrl(`/shop/stands/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const useCaseRoutes: MetadataRoute.Sitemap = useCases.map((useCase) => ({
    url: absoluteUrl(`/use/${useCase.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const productRoutes: MetadataRoute.Sitemap = getActiveProducts().map((product) => ({
    url: absoluteUrl(`/product/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5
  }));

  return [...staticRoutes, ...categoryRoutes, ...standCategoryRoutes, ...useCaseRoutes, ...productRoutes];
}
