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

export const activationFormSchema = z.object({
  deviceCode: z.string().trim().min(3).max(80).regex(/^[A-Za-z0-9-]+$/),
  activationCode: z.string().trim().min(4).max(120),
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  destinationType: z.enum(["google_review_url", "direct_url", "facebook_url", "yelp_url", "booking_url", "social_url"]),
  destinationUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Destination URL must start with http or https.")
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SetupFormInput = z.infer<typeof setupFormSchema>;
export type ChangeLinkFormInput = z.infer<typeof changeLinkFormSchema>;
export type ActivationFormInput = z.infer<typeof activationFormSchema>;

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

export const adminConfigSchema = z.object({
  area: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(120),
  status: z.enum(["draft", "published"]),
  settings: z.object({
    primary: z.string().trim().min(2).max(300),
    secondary: z.string().trim().min(2).max(300),
    notes: z.string().trim().max(2000).default("")
  })
});

export type AdminConfigInput = z.infer<typeof adminConfigSchema>;
