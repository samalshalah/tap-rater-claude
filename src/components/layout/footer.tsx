import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/category/reviews", label: "Review stands" },
      { href: "/category/social-media", label: "Social media" },
      { href: "/category/appointments", label: "Appointments" },
      { href: "/category/menu", label: "Menu" }
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/setup-new-taprater", label: "Setup a new Tap Rater" },
      { href: "/change-taprater-link", label: "Change your link" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact-us", label: "Contact us" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-[15px] font-semibold text-ink">Tap Rater</p>
          <p className="mt-3 max-w-xs text-[13px] leading-6 text-muted">
            NFC review stands and plates that help local businesses collect reviews, share menus, and stay connected with customers.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-[13px] font-semibold text-ink">{column.title}</p>
            <div className="mt-3 grid gap-2.5">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-[13px] text-muted transition hover:text-ink">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-5 py-5 sm:px-8">
        <p className="mx-auto max-w-[1200px] text-[12px] text-muted">© 2026 Tap Rater. All rights reserved.</p>
      </div>
    </footer>
  );
}
