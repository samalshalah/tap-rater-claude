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
