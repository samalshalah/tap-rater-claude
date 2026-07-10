import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://taprater.com"),
  title: {
    default: "Tap Rater | NFC Review Products for Local Businesses",
    template: "%s | Tap Rater"
  },
  description:
    "Tap Rater sells NFC review stands and plates that help customers tap or scan to open Google, Facebook, Yelp, TripAdvisor, social, booking, menu, or feedback links.",
  keywords: [
    "Google review stand",
    "NFC review stand",
    "review us on Google sign",
    "NFC review plate",
    "NFC menu stand",
    "customer feedback NFC stand"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tap Rater | NFC Review Products for Local Businesses",
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
