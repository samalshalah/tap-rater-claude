import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(10).max(2000)
});

export const setupFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  businessName: z.string().trim().min(2).max(160),
  reviewUrl: z.string().trim().url().max(500),
  notes: z.string().trim().max(2000).default("")
});

export const changeLinkFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  tapraterId: z.string().trim().min(3).max(80),
  newReviewUrl: z.string().trim().url().max(500),
  notes: z.string().trim().max(2000).default("")
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SetupFormInput = z.infer<typeof setupFormSchema>;
export type ChangeLinkFormInput = z.infer<typeof changeLinkFormSchema>;

export const homepageContentSchema = z.object({
  eyebrow: z.string().trim().min(2).max(120),
  heroTitle: z.string().trim().min(10).max(160),
  heroDescription: z.string().trim().min(20).max(500),
  primaryButtonLabel: z.string().trim().min(2).max(40),
  primaryButtonHref: z.string().trim().min(1).max(120),
  secondaryButtonLabel: z.string().trim().min(2).max(40),
  secondaryButtonHref: z.string().trim().min(1).max(120),
  featuredBadge: z.string().trim().min(2).max(80),
  featuredLabel: z.string().trim().min(2).max(120)
});

export const pageContentSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(160),
  seoTitle: z.string().trim().min(2).max(160),
  seoDescription: z.string().trim().min(10).max(300),
  body: z.string().trim().min(10).max(10000),
  status: z.enum(["draft", "published"])
});

export const productContentSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(180),
  sku: z.string().trim().min(2).max(80),
  categorySlug: z.string().trim().min(2).max(120),
  basePriceCents: z.number().int().min(0),
  salePriceCents: z.number().int().min(0).optional(),
  stockStatus: z.enum(["instock", "outofstock"]),
  shortDescription: z.string().trim().min(5).max(500),
  description: z.string().trim().min(10).max(4000),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  isActive: z.boolean()
});

export type HomepageContentInput = z.infer<typeof homepageContentSchema>;
export type PageContentInput = z.infer<typeof pageContentSchema>;
export type ProductContentInput = z.infer<typeof productContentSchema>;
