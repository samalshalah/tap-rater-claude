"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// Operational and public stand surfaces use dedicated shells and should not
// also carry the marketing site's header and footer.
const NO_CHROME_PREFIXES = ["/admin", "/account", "/dashboard", "/t"];
const NO_CHROME_PATHS = ["/"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    NO_CHROME_PATHS.includes(pathname) ||
    NO_CHROME_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (hideChrome) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
