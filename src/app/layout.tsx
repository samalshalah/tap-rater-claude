import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://taprater.com"),
  title: {
    default: "Tap Rater | NFC Review Stands for Google Reviews",
    template: "%s | Tap Rater"
  },
  description:
    "Tap Rater sells NFC review stands, plates, and bundles that help customers tap their phone to open your Google, Facebook, Yelp, or custom review link.",
  keywords: [
    "Google review NFC stand",
    "NFC review stand",
    "review us on Google sign",
    "Google review tap card",
    "NFC review plate",
    "customer feedback NFC stand"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tap Rater | NFC Review Stands for Google Reviews",
    description:
      "NFC review stands and plates that help customers open your review link with one tap.",
    url: "/",
    siteName: "Tap Rater",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
