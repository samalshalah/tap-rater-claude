import Link from "next/link";
import { solutions } from "@/data/solutions";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop#all-products", label: "Shop All" },
      { href: "/shop/by-stand", label: "Shop by Stand" },
      { href: "/shop", label: "Shop by Use" },
      { href: "/category/business-bundles", label: "Bundles" }
    ]
  },
  {
    title: "Solutions",
    links: solutions.map((solution) => ({
      href: `/category/${solution.categorySlug}`,
      label: solution.title
    }))
  },
  {
    title: "Products",
    links: [
      { href: "/product/google-review-stand", label: "Google Review Stand" },
      { href: "/product/follow-us-social-media-stand", label: "Social Media Stand" },
      { href: "/product/book-your-next-visit-stand", label: "Appointment Stand" },
      { href: "/product/view-our-menu-stand", label: "Menu Stand" },
      { href: "/shop/custom", label: "Custom Printed Stands" },
      { href: "/shop/hosted-pages", label: "Hosted Tap Rater Pages" }
    ]
  },
  {
    title: "Platform",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/setup-new-taprater", label: "Setup a new Tap Rater" },
      { href: "/change-taprater-link", label: "Change your link" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faqs", label: "FAQs" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <p className="text-[15px] font-semibold text-ink">Tap Rater</p>
        <p className="mt-3 max-w-sm text-[13px] leading-6 text-muted">
          NFC stands, custom printed stands, and hosted Tap Rater pages that help local businesses collect reviews, share menus, and stay connected with customers.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[13px] font-semibold text-ink">{column.title}</p>
              <div className="mt-3 grid gap-2.5">
                {column.links.map((link) => (
                  <Link key={link.href + link.label} href={link.href} className="text-[13px] text-muted transition hover:text-ink">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 sm:px-8">
        <p className="mx-auto max-w-[1280px] text-[12px] text-muted">© 2026 Tap Rater. All rights reserved.</p>
      </div>
    </footer>
  );
}
