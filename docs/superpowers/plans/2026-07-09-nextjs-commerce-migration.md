# Tap Rater Next.js Commerce Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full Next.js ecommerce replacement for Tap Rater with Stripe payments, Postgres persistence, migrated WordPress content, forms, admin views, and production redirects.

**Architecture:** Next.js App Router owns the public storefront, API routes, cart flow, forms, admin pages, and Stripe webhooks. Supabase Postgres stores products, images, variants, orders, and requests. Stripe Checkout is the payment source of truth; webhook events create paid order records.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase Postgres, Stripe, Resend, Zod, Vitest, Playwright.

---

## File Structure

- `package.json`: project scripts and dependencies.
- `next.config.ts`: image host allowlist and redirects.
- `.env.example`: required local and production environment variables.
- `src/app/layout.tsx`: root metadata, global layout, header/footer shell.
- `src/app/page.tsx`: homepage.
- `src/app/shop/page.tsx`: shop grid.
- `src/app/product/[slug]/page.tsx`: product detail page.
- `src/app/cart/page.tsx`: cart page.
- `src/app/checkout/success/page.tsx`: Stripe success page.
- `src/app/checkout/cancel/page.tsx`: Stripe cancel page.
- `src/app/(content)/*/page.tsx`: static content pages.
- `src/app/api/checkout/route.ts`: creates Stripe Checkout sessions.
- `src/app/api/stripe/webhook/route.ts`: verifies Stripe webhooks and records orders.
- `src/app/api/forms/contact/route.ts`: stores and emails contact messages.
- `src/app/api/forms/setup/route.ts`: stores and emails setup requests.
- `src/app/api/forms/change-link/route.ts`: stores and emails change-link requests.
- `src/app/admin/*`: protected admin pages.
- `src/components/layout/*`: header, footer, navigation, shell.
- `src/components/product/*`: product card, gallery, price, variant picker.
- `src/components/cart/*`: cart provider, cart table, checkout button.
- `src/components/forms/*`: reusable form fields and form views.
- `src/lib/db.ts`: Supabase server client.
- `src/lib/stripe.ts`: Stripe server client.
- `src/lib/resend.ts`: Resend server client.
- `src/lib/products.ts`: product query helpers.
- `src/lib/cart.ts`: cart validation and total helpers.
- `src/lib/admin-auth.ts`: first-version admin cookie helpers.
- `src/lib/validators.ts`: shared Zod schemas.
- `src/data/migrated-products.ts`: seedable product data extracted from WordPress.
- `src/data/content.ts`: migrated static page/FAQ content.
- `src/scripts/extract-wordpress.ts`: reads WordPress XML and writes seed data.
- `supabase/schema.sql`: database schema.
- `supabase/seed.sql`: generated product seed SQL.
- `tests/unit/*`: Vitest unit tests.
- `tests/e2e/*`: Playwright smoke tests.

## Decisions Locked For This Plan

- Database provider: Supabase Postgres.
- Email provider: Resend.
- Admin auth: one first-version admin account configured with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
- Product administration: implemented in `/admin/products` after product seed migration; product image upload management is not part of this plan. Images are migrated into `public/uploads`.
- Template usage: Goru files are used as visual references and selected static assets only. The app is implemented as React components with Tailwind.

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Create project files**

Create `package.json`:

```json
{
  "name": "tap-rater",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "resend": "^4.0.0",
    "stripe": "^17.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taprater.com",
        pathname: "/wp-content/uploads/**"
      }
    ]
  },
  async redirects() {
    return [
      { source: "/product-category/:slug*", destination: "/shop", permanent: true },
      { source: "/my-account", destination: "/admin", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: false }
    ];
  }
};

export default nextConfig;
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#6B7280",
        line: "#E5E7EB",
        brand: "#0B7A75",
        accent: "#F5A524"
      }
    }
  },
  plugins: []
};

export default config;
```

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #111827;
  background: #ffffff;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}
```

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tap Rater",
  description: "NFC review stands and plates for businesses."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=admin@taprater.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
ORDER_NOTIFICATION_EMAIL=
```

Create `.gitignore`:

```gitignore
node_modules
.next
.env
.env.local
.vercel
coverage
playwright-report
test-results
```

- [ ] **Step 2: Install dependencies**

Run:

```powershell
npm install
```

Expected: `node_modules` is created and `package-lock.json` is written.

- [ ] **Step 3: Verify scaffold builds**

Run:

```powershell
npm run build
```

Expected: build completes with a generated `.next` folder.

- [ ] **Step 4: Commit scaffold**

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs tailwind.config.ts src/app/globals.css src/app/layout.tsx .env.example .gitignore
git commit -m "chore: scaffold Next.js app"
```

---

### Task 2: Database Schema And Server Clients

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/db.ts`
- Create: `src/lib/stripe.ts`
- Create: `src/lib/resend.ts`
- Create: `src/lib/validators.ts`
- Test: `tests/unit/validators.test.ts`

- [ ] **Step 1: Write validator tests**

Create `tests/unit/validators.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { checkoutItemSchema, contactFormSchema } from "@/lib/validators";

describe("validators", () => {
  it("accepts a valid checkout item", () => {
    const item = checkoutItemSchema.parse({
      productId: "google-review-white-stand",
      variantId: "white",
      quantity: 2
    });

    expect(item.quantity).toBe(2);
  });

  it("rejects a zero quantity", () => {
    expect(() =>
      checkoutItemSchema.parse({
        productId: "google-review-white-stand",
        quantity: 0
      })
    ).toThrow();
  });

  it("accepts a contact request", () => {
    const form = contactFormSchema.parse({
      name: "Tap Rater Customer",
      email: "customer@example.com",
      message: "I need help with my stand."
    });

    expect(form.email).toBe("customer@example.com");
  });
});
```

- [ ] **Step 2: Run validator tests and confirm failure**

Run:

```powershell
npm run test -- tests/unit/validators.test.ts
```

Expected: FAIL because `src/lib/validators.ts` does not exist.

- [ ] **Step 3: Create schema and clients**

Create `supabase/schema.sql`:

```sql
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  short_description text not null default '',
  sku text not null unique,
  base_price_cents integer not null check (base_price_cents >= 0),
  sale_price_cents integer check (sale_price_cents >= 0),
  stock_status text not null check (stock_status in ('instock', 'outofstock')),
  category text not null default 'Tap Rater',
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  src text not null,
  alt text not null default '',
  sort_order integer not null default 0
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  sku text not null unique,
  price_cents integer check (price_cents >= 0),
  stock_status text not null check (stock_status in ('instock', 'outofstock'))
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_id uuid references customers(id),
  status text not null,
  currency text not null default 'usd',
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  title text not null,
  sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0)
);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists setup_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  business_name text not null,
  review_url text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists change_link_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  taprater_id text not null,
  new_review_url text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);
```

Create `src/lib/db.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
```

Create `src/lib/stripe.ts`:

```ts
import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2024-12-18.acacia"
  });
}
```

Create `src/lib/resend.ts`:

```ts
import { Resend } from "resend";

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}
```

Create `src/lib/validators.ts`:

```ts
import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(50)
});

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1)
});

export const contactFormSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(2000)
});

export const setupFormSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  businessName: z.string().min(2).max(160),
  reviewUrl: z.string().url(),
  notes: z.string().max(2000).default("")
});

export const changeLinkFormSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  tapraterId: z.string().min(3).max(80),
  newReviewUrl: z.string().url(),
  notes: z.string().max(2000).default("")
});
```

- [ ] **Step 4: Run validator tests and confirm pass**

Run:

```powershell
npm run test -- tests/unit/validators.test.ts
```

Expected: PASS for all validator tests.

- [ ] **Step 5: Commit schema and clients**

```powershell
git add supabase/schema.sql src/lib/db.ts src/lib/stripe.ts src/lib/resend.ts src/lib/validators.ts tests/unit/validators.test.ts
git commit -m "feat: add backend schema and server clients"
```

---

### Task 3: Migrate Products And Images

**Files:**
- Create: `src/data/migrated-products.ts`
- Create: `src/lib/products.ts`
- Create: `src/scripts/extract-wordpress.ts`
- Create: `public/uploads/`
- Test: `tests/unit/products.test.ts`

- [ ] **Step 1: Write product helper tests**

Create `tests/unit/products.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getActiveProducts, getProductBySlug } from "@/lib/products";

describe("product helpers", () => {
  it("returns migrated active products", () => {
    const products = getActiveProducts();
    expect(products.length).toBeGreaterThanOrEqual(7);
    expect(products.map((product) => product.slug)).toContain("google-review-white-stand");
  });

  it("finds a product by slug", () => {
    const product = getProductBySlug("tap-rater-white-stand-rate-your-experience");
    expect(product?.sku).toBe("TRATER12");
  });

  it("does not return inactive products from active query", () => {
    const products = getActiveProducts();
    expect(products.every((product) => product.isActive)).toBe(true);
  });
});
```

- [ ] **Step 2: Run product tests and confirm failure**

Run:

```powershell
npm run test -- tests/unit/products.test.ts
```

Expected: FAIL because product data and helpers do not exist.

- [ ] **Step 3: Add migrated product seed data**

Create `src/data/migrated-products.ts`:

```ts
export type MigratedProduct = {
  slug: string;
  title: string;
  sku: string;
  basePriceCents: number;
  salePriceCents?: number;
  stockStatus: "instock" | "outofstock";
  shortDescription: string;
  description: string;
  images: { src: string; alt: string }[];
  variants: { id: string; label: string; sku: string; priceCents?: number; stockStatus: "instock" | "outofstock" }[];
  isActive: boolean;
};

export const migratedProducts: MigratedProduct[] = [
  {
    slug: "google-review-white-stand",
    title: "White Stand - Google Review",
    sku: "TRATER01",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "White NFC review stand for Google reviews.",
    description: "A Tap Rater NFC stand that helps customers open your Google review link with a tap.",
    images: [{ src: "/uploads/products/google-review-white-stand.jpg", alt: "Tap Rater Google Review white stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER01-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER01-B", stockStatus: "instock" }
    ],
    isActive: true
  },
  {
    slug: "google-review-white-plate",
    title: "White Plate - Google Review",
    sku: "TRATER02",
    basePriceCents: 3900,
    stockStatus: "instock",
    shortDescription: "White NFC review plate for Google reviews.",
    description: "A Tap Rater NFC plate for counters, tables, and front desks.",
    images: [{ src: "/uploads/products/google-review-white-plate.jpg", alt: "Tap Rater Google Review white plate" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER02-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER02-B", stockStatus: "instock" }
    ],
    isActive: true
  },
  {
    slug: "facebook-review-stand",
    title: "White Stand - Facebook Review",
    sku: "TRATER05",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "White NFC review stand for Facebook reviews.",
    description: "A Tap Rater NFC stand that opens your Facebook review destination.",
    images: [{ src: "/uploads/products/facebook-review-stand.jpg", alt: "Tap Rater Facebook Review white stand" }],
    variants: [],
    isActive: true
  },
  {
    slug: "yelp-review-stand",
    title: "White Stand - Yelp Review",
    sku: "TRATER06",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "White NFC review stand for Yelp reviews.",
    description: "A Tap Rater NFC stand that opens your Yelp review destination.",
    images: [{ src: "/uploads/products/yelp-review-stand.jpg", alt: "Tap Rater Yelp Review white stand" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-business-white-bundle",
    title: "Business - Google White Bundle",
    sku: "TRATER07",
    basePriceCents: 12700,
    salePriceCents: 10160,
    stockStatus: "instock",
    shortDescription: "Google review business bundle with Tap Rater products.",
    description: "A discounted Tap Rater bundle for businesses that want multiple Google review touchpoints.",
    images: [{ src: "/uploads/products/business-google-white-bundle.jpg", alt: "Tap Rater Google white business bundle" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-business-white-stands-bundle",
    title: "Business - Google White Stands Bundle",
    sku: "TRATER10",
    basePriceCents: 14700,
    salePriceCents: 11760,
    stockStatus: "instock",
    shortDescription: "Bundle of white Google review stands.",
    description: "A discounted bundle for businesses that need multiple Tap Rater Google review stands.",
    images: [{ src: "/uploads/products/business-google-white-stands-bundle.jpg", alt: "Tap Rater Google white stands bundle" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-white-stand-rate-your-experience",
    title: "White Stand - Rate Your Experience",
    sku: "TRATER12",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "White NFC stand for a Rate Your Experience flow.",
    description: "A Tap Rater NFC stand for directing customers to your preferred review or feedback flow.",
    images: [{ src: "/uploads/products/rate-your-experience-white-stand.jpg", alt: "Tap Rater Rate Your Experience white stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER12-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER12-B", stockStatus: "instock" }
    ],
    isActive: true
  }
];
```

Create `src/lib/products.ts`:

```ts
import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";

export function getActiveProducts(): MigratedProduct[] {
  return migratedProducts.filter((product) => product.isActive);
}

export function getProductBySlug(slug: string): MigratedProduct | undefined {
  return migratedProducts.find((product) => product.slug === slug && product.isActive);
}

export function getProductPriceCents(product: MigratedProduct): number {
  return product.salePriceCents ?? product.basePriceCents;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
```

Create `src/scripts/extract-wordpress.ts`:

```ts
import fs from "node:fs";
import path from "node:path";

const exportPath = "C:/Users/hussa/Downloads/taprater.WordPress.2026-07-09.xml";

if (!fs.existsSync(exportPath)) {
  throw new Error(`WordPress export not found at ${exportPath}`);
}

const xml = fs.readFileSync(exportPath, "utf8");
const productMatches = [...xml.matchAll(/<wp:post_type><!\[CDATA\[product\]\]><\/wp:post_type>/g)];
const output = {
  source: exportPath,
  productCountMarkers: productMatches.length,
  generatedAt: new Date().toISOString()
};

fs.mkdirSync(path.join(process.cwd(), "tmp"), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), "tmp", "wordpress-product-audit.json"), JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));
```

- [ ] **Step 4: Copy product images**

Extract the WordPress uploads archive:

```powershell
$tmp = Join-Path $env:TEMP "taprater-uploads"
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $tmp | Out-Null
Expand-Archive -LiteralPath "C:/Users/hussa/Downloads/backup_2026-07-08-2247_TAP_RATER_ecf9a1d7cfbb-uploads.zip" -DestinationPath $tmp -Force
New-Item -ItemType Directory -Force "public/uploads/products" | Out-Null
```

Copy exact product images into the names referenced by `src/data/migrated-products.ts`:

```powershell
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/01/Tap-Rater-Google-Review-White-Stand.jpg") -Destination "public/uploads/products/google-review-white-stand.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/01/Tap-Rater-Google-Review-White-Plate.jpg") -Destination "public/uploads/products/google-review-white-plate.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/01/Tap-Rater-Facebook-Review-White-Stand.jpg") -Destination "public/uploads/products/facebook-review-stand.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/01/Tap-Rater-Yelp-Review-White-Stand.jpg") -Destination "public/uploads/products/yelp-review-stand.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/02/TAP-RATER-Business-White-Bundle.jpg") -Destination "public/uploads/products/business-google-white-bundle.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/02/TAP-RATER-Business-White-Stands-Bundle.jpg") -Destination "public/uploads/products/business-google-white-stands-bundle.jpg"
Copy-Item -LiteralPath (Join-Path $tmp "uploads/2024/02/TAP-RATER-white-stand-rate-your-experiance.jpg") -Destination "public/uploads/products/rate-your-experience-white-stand.jpg"
```

- [ ] **Step 5: Run product tests and confirm pass**

Run:

```powershell
npm run test -- tests/unit/products.test.ts
```

Expected: PASS for all product helper tests.

- [ ] **Step 6: Commit migrated product data**

```powershell
git add src/data/migrated-products.ts src/lib/products.ts src/scripts/extract-wordpress.ts public/uploads/products tests/unit/products.test.ts
git commit -m "feat: add migrated product catalog"
```

---

### Task 4: Storefront Layout And Product Pages

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/site-shell.tsx`
- Create: `src/components/product/product-card.tsx`
- Create: `src/components/product/product-gallery.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/shop/page.tsx`
- Create: `src/app/product/[slug]/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Build layout components**

Create `src/components/layout/header.tsx`:

```tsx
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/setup-new-taprater", label: "Setup" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact-us", label: "Contact" }
];

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-ink">
          Tap Rater
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/cart" aria-label="Cart" className="rounded-md border border-line p-2 hover:border-brand">
          <ShoppingCart size={20} />
        </Link>
      </div>
    </header>
  );
}
```

Create `src/components/layout/footer.tsx`:

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-bold text-ink">Tap Rater</p>
          <p className="mt-2 text-sm text-muted">NFC review stands and plates for local businesses.</p>
        </div>
        <div className="grid gap-2 text-sm text-muted">
          <Link href="/shop">Shop</Link>
          <Link href="/about-us">About Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
        <div className="grid gap-2 text-sm text-muted">
          <Link href="/review-links-generator">Review Links Generator</Link>
          <Link href="/setup-new-taprater">Setup New TapRater</Link>
          <Link href="/change-taprater-link">Change TapRater Link</Link>
        </div>
      </div>
    </footer>
  );
}
```

Create `src/components/layout/site-shell.tsx`:

```tsx
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tap Rater",
  description: "NFC review stands and plates for businesses."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Build product display components**

Create `src/components/product/product-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductPriceCents } from "@/lib/products";
import type { MigratedProduct } from "@/data/migrated-products";

export function ProductCard({ product }: { product: MigratedProduct }) {
  const image = product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block rounded-md border border-line bg-white p-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
        <Image src={image.src} alt={image.alt} fill className="object-contain p-4 transition group-hover:scale-105" />
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted">{product.stockStatus === "instock" ? "In stock" : "Out of stock"}</p>
        <h2 className="mt-1 text-base font-semibold text-ink">{product.title}</h2>
        <p className="mt-2 text-lg font-bold text-brand">{formatPrice(getProductPriceCents(product))}</p>
      </div>
    </Link>
  );
}
```

Create `src/components/product/product-gallery.tsx`:

```tsx
import Image from "next/image";
import type { MigratedProduct } from "@/data/migrated-products";

export function ProductGallery({ product }: { product: MigratedProduct }) {
  const image = product.images[0];

  return (
    <div className="relative aspect-square rounded-md border border-line bg-gray-50">
      <Image src={image.src} alt={image.alt} fill priority className="object-contain p-8" />
    </div>
  );
}
```

- [ ] **Step 3: Build pages**

Create `src/app/page.tsx`:

```tsx
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts } from "@/lib/products";

export default function HomePage() {
  const products = getActiveProducts().slice(0, 4);

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Tap Rater NFC Products</p>
          <h1 className="mt-3 text-4xl font-bold text-ink md:text-6xl">Get more customer reviews with one tap.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Tap Rater stands and plates help customers open your Google, Facebook, Yelp, or feedback link instantly.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/shop" className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
              Shop products
            </Link>
            <Link href="/setup-new-taprater" className="rounded-md border border-line px-5 py-3 text-sm font-bold text-ink">
              Setup TapRater
            </Link>
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-6">
          <ProductCard product={products[0]} />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold text-ink">Popular products</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

Create `src/app/shop/page.tsx`:

```tsx
import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts } from "@/lib/products";

export default function ShopPage() {
  const products = getActiveProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Shop Tap Rater</h1>
      <p className="mt-3 text-muted">NFC stands, plates, and bundles for customer reviews.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
```

Create `src/app/product/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatPrice, getProductBySlug, getProductPriceCents } from "@/lib/products";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
      <ProductGallery product={product} />
      <div>
        <p className="text-sm font-semibold text-brand">{product.stockStatus === "instock" ? "In stock" : "Out of stock"}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{product.title}</h1>
        <p className="mt-4 text-2xl font-bold text-brand">{formatPrice(getProductPriceCents(product))}</p>
        <p className="mt-5 text-muted">{product.description}</p>
        <button
          className="mt-8 w-full rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={product.stockStatus !== "instock"}
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify pages build**

Run:

```powershell
npm run build
```

Expected: build completes and routes are generated.

- [ ] **Step 5: Commit storefront pages**

```powershell
git add src/app src/components
git commit -m "feat: build storefront pages"
```

---

### Task 5: Cart State And Checkout Session API

**Files:**
- Create: `src/components/cart/cart-provider.tsx`
- Create: `src/components/cart/add-to-cart-button.tsx`
- Create: `src/components/cart/cart-table.tsx`
- Create: `src/lib/cart.ts`
- Create: `src/app/cart/page.tsx`
- Create: `src/app/api/checkout/route.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/product/[slug]/page.tsx`
- Test: `tests/unit/cart.test.ts`

- [ ] **Step 1: Write cart tests**

Create `tests/unit/cart.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateCartTotal, validateCartItems } from "@/lib/cart";

describe("cart helpers", () => {
  it("calculates totals in cents", () => {
    const total = calculateCartTotal([
      { productId: "google-review-white-stand", quantity: 2 },
      { productId: "google-review-white-plate", quantity: 1 }
    ]);

    expect(total).toBe(13700);
  });

  it("rejects out of stock products", () => {
    expect(() => validateCartItems([{ productId: "facebook-review-stand", quantity: 1 }])).toThrow("out of stock");
  });
});
```

- [ ] **Step 2: Run cart tests and confirm failure**

Run:

```powershell
npm run test -- tests/unit/cart.test.ts
```

Expected: FAIL because `src/lib/cart.ts` does not exist.

- [ ] **Step 3: Add cart helpers**

Create `src/lib/cart.ts`:

```ts
import { getProductBySlug, getProductPriceCents } from "@/lib/products";

export type CartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type ValidatedCartItem = CartItemInput & {
  title: string;
  sku: string;
  unitPriceCents: number;
  lineTotalCents: number;
};

export function validateCartItems(items: CartItemInput[]): ValidatedCartItem[] {
  return items.map((item) => {
    const product = getProductBySlug(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} was not found.`);
    }

    if (product.stockStatus !== "instock") {
      throw new Error(`${product.title} is out of stock.`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw new Error(`${product.title} has an invalid quantity.`);
    }

    const unitPriceCents = getProductPriceCents(product);

    return {
      ...item,
      title: product.title,
      sku: product.sku,
      unitPriceCents,
      lineTotalCents: unitPriceCents * item.quantity
    };
  });
}

export function calculateCartTotal(items: CartItemInput[]): number {
  return validateCartItems(items).reduce((sum, item) => sum + item.lineTotalCents, 0);
}
```

- [ ] **Step 4: Add cart provider and UI**

Create `src/components/cart/cart-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.productId === item.productId && entry.variantId === item.variantId);
          if (!existing) {
            return [...current, item];
          }
          return current.map((entry) =>
            entry.productId === item.productId && entry.variantId === item.variantId
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          );
        });
      },
      removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
      clearCart: () => setItems([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
```

Create `src/components/cart/add-to-cart-button.tsx`:

```tsx
"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({ productId, disabled }: { productId: string; disabled: boolean }) {
  const cart = useCart();

  return (
    <button
      className="mt-8 w-full rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      disabled={disabled}
      onClick={() => cart.addItem({ productId, quantity: 1 })}
    >
      Add to cart
    </button>
  );
}
```

Create `src/components/cart/cart-table.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function CartTable() {
  const { items, removeItem } = useCart();
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error ?? "Checkout failed.");
      return;
    }
    window.location.href = body.url;
  }

  if (items.length === 0) {
    return <p className="text-muted">Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={`${item.productId}-${item.variantId ?? "default"}`} className="flex items-center justify-between border-b border-line py-3">
          <div>
            <p className="font-semibold text-ink">{item.productId}</p>
            <p className="text-sm text-muted">Quantity: {item.quantity}</p>
          </div>
          <button className="text-sm font-semibold text-brand" onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}
      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}
```

Modify `src/app/layout.tsx` to wrap `SiteShell` with `CartProvider`:

```tsx
import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tap Rater",
  description: "NFC review stands and plates for businesses."
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
```

Create `src/app/cart/page.tsx`:

```tsx
import { CartTable } from "@/components/cart/cart-table";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Cart</h1>
      <div className="mt-8">
        <CartTable />
      </div>
    </section>
  );
}
```

Modify `src/app/product/[slug]/page.tsx` to use `AddToCartButton`:

```tsx
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatPrice, getProductBySlug, getProductPriceCents } from "@/lib/products";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
      <ProductGallery product={product} />
      <div>
        <p className="text-sm font-semibold text-brand">{product.stockStatus === "instock" ? "In stock" : "Out of stock"}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{product.title}</h1>
        <p className="mt-4 text-2xl font-bold text-brand">{formatPrice(getProductPriceCents(product))}</p>
        <p className="mt-5 text-muted">{product.description}</p>
        <AddToCartButton productId={product.slug} disabled={product.stockStatus !== "instock"} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create checkout API route**

Create `src/app/api/checkout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { validateCartItems } from "@/lib/cart";
import { getStripe } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = checkoutRequestSchema.parse(await request.json());
    const items = validateCartItems(body.items);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.unitPriceCents,
          product_data: {
            name: item.title,
            metadata: {
              sku: item.sku,
              productId: item.productId,
              variantId: item.variantId ?? ""
            }
          }
        }
      })),
      metadata: {
        cart: JSON.stringify(items.map((item) => ({ productId: item.productId, variantId: item.variantId ?? "", quantity: item.quantity })))
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm run test -- tests/unit/cart.test.ts
npm run build
```

Expected: cart tests pass and build completes.

- [ ] **Step 7: Commit cart and checkout API**

```powershell
git add src/components/cart src/lib/cart.ts src/app/cart src/app/api/checkout src/app/layout.tsx src/app/product tests/unit/cart.test.ts
git commit -m "feat: add cart and Stripe checkout session"
```

---

### Task 6: Stripe Webhook And Order Persistence

**Files:**
- Create: `src/app/api/stripe/webhook/route.ts`
- Create: `src/lib/orders.ts`
- Test: `tests/unit/orders.test.ts`

- [ ] **Step 1: Write order metadata test**

Create `tests/unit/orders.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseCheckoutCartMetadata } from "@/lib/orders";

describe("order helpers", () => {
  it("parses checkout cart metadata", () => {
    const items = parseCheckoutCartMetadata('[{"productId":"google-review-white-stand","quantity":2}]');
    expect(items[0].productId).toBe("google-review-white-stand");
    expect(items[0].quantity).toBe(2);
  });

  it("returns an empty cart for invalid metadata", () => {
    expect(parseCheckoutCartMetadata("not-json")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run order tests and confirm failure**

Run:

```powershell
npm run test -- tests/unit/orders.test.ts
```

Expected: FAIL because `src/lib/orders.ts` does not exist.

- [ ] **Step 3: Add order helpers**

Create `src/lib/orders.ts`:

```ts
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/db";
import { validateCartItems, type CartItemInput } from "@/lib/cart";

export function parseCheckoutCartMetadata(value: string | undefined | null): CartItemInput[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => typeof item.productId === "string" && Number.isInteger(item.quantity))
      .map((item) => ({
        productId: item.productId,
        variantId: typeof item.variantId === "string" && item.variantId.length > 0 ? item.variantId : undefined,
        quantity: item.quantity
      }));
  } catch {
    return [];
  }
}

export async function recordPaidCheckoutSession(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();
  const email = session.customer_details?.email ?? "";
  const name = session.customer_details?.name ?? "";
  const cartItems = validateCartItems(parseCheckoutCartMetadata(session.metadata?.cart));

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert({ email, name }, { onConflict: "email" })
    .select("id")
    .single();

  if (customerError) {
    throw new Error(customerError.message);
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      customer_id: customer.id,
      status: "paid",
      currency: session.currency ?? "usd",
      subtotal_cents: session.amount_subtotal ?? 0,
      total_cents: session.amount_total ?? 0
    })
    .select("id")
    .single();

  if (orderError) {
    if (orderError.message.includes("duplicate")) {
      return;
    }
    throw new Error(orderError.message);
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: null,
    variant_id: null,
    title: item.title,
    sku: item.sku,
    quantity: item.quantity,
    unit_price_cents: item.unitPriceCents,
    line_total_cents: item.lineTotalCents
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }
}
```

- [ ] **Step 4: Create webhook route**

Create `src/app/api/stripe/webhook/route.ts`:

```ts
import { NextResponse } from "next/server";
import { recordPaidCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      await recordPaidCheckoutSession(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

- [ ] **Step 5: Run order tests and build**

Run:

```powershell
npm run test -- tests/unit/orders.test.ts
npm run build
```

Expected: tests pass and build completes.

- [ ] **Step 6: Commit webhook**

```powershell
git add src/app/api/stripe src/lib/orders.ts tests/unit/orders.test.ts
git commit -m "feat: record Stripe paid orders"
```

---

### Task 7: Content Pages And Forms

**Files:**
- Create: `src/data/content.ts`
- Create: `src/components/forms/contact-form.tsx`
- Create: `src/components/forms/setup-form.tsx`
- Create: `src/components/forms/change-link-form.tsx`
- Create: `src/app/(content)/about-us/page.tsx`
- Create: `src/app/(content)/faqs/page.tsx`
- Create: `src/app/(content)/privacy-policy/page.tsx`
- Create: `src/app/(content)/review-links-generator/page.tsx`
- Create: `src/app/(content)/contact-us/page.tsx`
- Create: `src/app/(content)/setup-new-taprater/page.tsx`
- Create: `src/app/(content)/change-taprater-link/page.tsx`
- Create: `src/app/api/forms/contact/route.ts`
- Create: `src/app/api/forms/setup/route.ts`
- Create: `src/app/api/forms/change-link/route.ts`

- [ ] **Step 1: Add content data**

Create `src/data/content.ts`:

```ts
export const faqs = [
  {
    question: "How does Tap Rater work?",
    answer: "Tap Rater uses NFC so customers can tap their phone and open your review or feedback link."
  },
  {
    question: "Can I change my review link?",
    answer: "Yes. Submit the Change TapRater Link form with your TapRater ID and the new review URL."
  },
  {
    question: "Do customers need an app?",
    answer: "No app is required. Modern phones can open NFC links directly from the tap."
  }
];

export const privacyPolicy = [
  "Tap Rater collects order and contact information needed to process purchases, provide support, and respond to setup requests.",
  "Payment details are processed by Stripe. Tap Rater does not store full card numbers.",
  "Contact and setup form submissions are used to provide Tap Rater service and support."
];
```

- [ ] **Step 2: Add form API routes**

Create `src/app/api/forms/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = contactFormSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_requests").insert({
      name: body.name,
      email: body.email,
      message: body.message
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Contact request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

Create `src/app/api/forms/setup/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { setupFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = setupFormSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("setup_requests").insert({
      name: body.name,
      email: body.email,
      business_name: body.businessName,
      review_url: body.reviewUrl,
      notes: body.notes
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Setup request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

Create `src/app/api/forms/change-link/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db";
import { changeLinkFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = changeLinkFormSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("change_link_requests").insert({
      name: body.name,
      email: body.email,
      taprater_id: body.tapraterId,
      new_review_url: body.newReviewUrl,
      notes: body.notes
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Change link request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

- [ ] **Step 3: Add static pages**

Create `src/app/(content)/about-us/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">About Tap Rater</h1>
      <p className="mt-5 text-muted">
        Tap Rater helps businesses collect more reviews by making the review link easy to open from a counter stand or plate.
      </p>
    </section>
  );
}
```

Create `src/app/(content)/faqs/page.tsx`:

```tsx
import { faqs } from "@/data/content";

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">FAQs</h1>
      <div className="mt-8 grid gap-5">
        {faqs.map((faq) => (
          <article key={faq.question} className="border-b border-line pb-5">
            <h2 className="font-semibold text-ink">{faq.question}</h2>
            <p className="mt-2 text-muted">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/app/(content)/privacy-policy/page.tsx`:

```tsx
import { privacyPolicy } from "@/data/content";

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
      <div className="mt-6 grid gap-4 text-muted">
        {privacyPolicy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
```

Create `src/app/(content)/review-links-generator/page.tsx`:

```tsx
export default function ReviewLinksGeneratorPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Review Links Generator</h1>
      <p className="mt-5 text-muted">Enter your business review destination and use the generated link for Tap Rater setup.</p>
    </section>
  );
}
```

- [ ] **Step 4: Add form pages**

Create `src/components/forms/contact-form.tsx`:

```tsx
"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message")
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Message sent." : body.error ?? "Message failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-md border border-line px-3 py-2" name="name" placeholder="Name" required />
      <input className="rounded-md border border-line px-3 py-2" name="email" type="email" placeholder="Email" required />
      <textarea className="min-h-32 rounded-md border border-line px-3 py-2" name="message" placeholder="Message" required />
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">Send</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
```

Create `src/components/forms/setup-form.tsx`:

```tsx
"use client";

import { FormEvent, useState } from "react";

export function SetupForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        businessName: form.get("businessName"),
        reviewUrl: form.get("reviewUrl"),
        notes: form.get("notes") ?? ""
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Setup request sent." : body.error ?? "Setup request failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-md border border-line px-3 py-2" name="name" placeholder="Name" required />
      <input className="rounded-md border border-line px-3 py-2" name="email" type="email" placeholder="Email" required />
      <input className="rounded-md border border-line px-3 py-2" name="businessName" placeholder="Business name" required />
      <input className="rounded-md border border-line px-3 py-2" name="reviewUrl" type="url" placeholder="Review URL" required />
      <textarea className="min-h-28 rounded-md border border-line px-3 py-2" name="notes" placeholder="Notes" />
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">Send setup request</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
```

Create `src/components/forms/change-link-form.tsx`:

```tsx
"use client";

import { FormEvent, useState } from "react";

export function ChangeLinkForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/change-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        tapraterId: form.get("tapraterId"),
        newReviewUrl: form.get("newReviewUrl"),
        notes: form.get("notes") ?? ""
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Change request sent." : body.error ?? "Change request failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-md border border-line px-3 py-2" name="name" placeholder="Name" required />
      <input className="rounded-md border border-line px-3 py-2" name="email" type="email" placeholder="Email" required />
      <input className="rounded-md border border-line px-3 py-2" name="tapraterId" placeholder="TapRater ID" required />
      <input className="rounded-md border border-line px-3 py-2" name="newReviewUrl" type="url" placeholder="New review URL" required />
      <textarea className="min-h-28 rounded-md border border-line px-3 py-2" name="notes" placeholder="Notes" />
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">Send change request</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
```

Create pages:

```tsx
// src/app/(content)/contact-us/page.tsx
import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Contact us</h1>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
```

```tsx
// src/app/(content)/setup-new-taprater/page.tsx
import { SetupForm } from "@/components/forms/setup-form";

export default function SetupPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Setup New TapRater</h1>
      <div className="mt-8">
        <SetupForm />
      </div>
    </section>
  );
}
```

```tsx
// src/app/(content)/change-taprater-link/page.tsx
import { ChangeLinkForm } from "@/components/forms/change-link-form";

export default function ChangeTapRaterLinkPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Change TapRater Link</h1>
      <div className="mt-8">
        <ChangeLinkForm />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run build and commit**

Run:

```powershell
npm run build
```

Expected: build completes.

Commit:

```powershell
git add src/data/content.ts src/components/forms src/app/(content) src/app/api/forms
git commit -m "feat: add content pages and request forms"
```

---

### Task 8: Admin Dashboard

**Files:**
- Create: `src/lib/admin-auth.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/app/admin/requests/page.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`

- [ ] **Step 1: Add admin auth helper**

Create `src/lib/admin-auth.ts`:

```ts
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "taprater_admin";

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSessionValue(email: string) {
  const payload = `${email}:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!value) {
    return false;
  }
  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return false;
  }
  const expected = sign(payload);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value;
  if (!isValidAdminSession(session)) {
    throw new Error("Admin authentication required.");
  }
}

export { cookieName };
```

- [ ] **Step 2: Add login/logout API**

Create `src/app/api/admin/login/route.ts`:

```ts
import { NextResponse } from "next/server";
import { cookieName, createAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createAdminSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return response;
}
```

Create `src/app/api/admin/logout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { cookieName } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(cookieName);
  return response;
}
```

- [ ] **Step 3: Add admin pages**

Create `src/app/admin/page.tsx`:

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Admin</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link className="rounded-md border border-line p-5 font-semibold" href="/admin/orders">Orders</Link>
        <Link className="rounded-md border border-line p-5 font-semibold" href="/admin/products">Products</Link>
        <Link className="rounded-md border border-line p-5 font-semibold" href="/admin/requests">Requests</Link>
      </div>
    </section>
  );
}
```

Create `src/app/admin/orders/page.tsx`:

```tsx
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/db";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id,status,total_cents,created_at,stripe_checkout_session_id")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Orders</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3">Order</th>
              <th className="py-3">Status</th>
              <th className="py-3">Total</th>
              <th className="py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr className="border-b border-line" key={order.id}>
                <td className="py-3">{order.stripe_checkout_session_id}</td>
                <td className="py-3">{order.status}</td>
                <td className="py-3">${(order.total_cents / 100).toFixed(2)}</td>
                <td className="py-3">{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

Create `src/app/admin/products/page.tsx`:

```tsx
import { getActiveProducts, formatPrice, getProductPriceCents } from "@/lib/products";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = getActiveProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Products</h1>
      <div className="mt-8 grid gap-3">
        {products.map((product) => (
          <div className="grid gap-2 rounded-md border border-line p-4 md:grid-cols-4" key={product.slug}>
            <p className="font-semibold text-ink">{product.title}</p>
            <p className="text-muted">{product.sku}</p>
            <p className="text-muted">{formatPrice(getProductPriceCents(product))}</p>
            <p className="text-muted">{product.stockStatus}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

Create `src/app/admin/requests/page.tsx`:

```tsx
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/db";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const [contacts, setups, changes] = await Promise.all([
    supabase.from("contact_requests").select("id,name,email,created_at").order("created_at", { ascending: false }),
    supabase.from("setup_requests").select("id,name,email,business_name,created_at").order("created_at", { ascending: false }),
    supabase.from("change_link_requests").select("id,name,email,taprater_id,created_at").order("created_at", { ascending: false })
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Requests</h1>
      <div className="mt-8 grid gap-8">
        <RequestList title="Contact" rows={contacts.data ?? []} labelKey="email" />
        <RequestList title="Setup" rows={setups.data ?? []} labelKey="business_name" />
        <RequestList title="Change Link" rows={changes.data ?? []} labelKey="taprater_id" />
      </div>
    </section>
  );
}

function RequestList({ title, rows, labelKey }: { title: string; rows: Record<string, string>[]; labelKey: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 grid gap-2">
        {rows.map((row) => (
          <div className="rounded-md border border-line p-3 text-sm" key={row.id}>
            <p className="font-semibold">{row.name}</p>
            <p className="text-muted">{row[labelKey]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run build and commit**

Run:

```powershell
npm run build
```

Expected: build completes.

Commit:

```powershell
git add src/lib/admin-auth.ts src/app/admin src/app/api/admin
git commit -m "feat: add admin dashboard"
```

---

### Task 9: Checkout Result Pages, Redirects, And SEO

**Files:**
- Create: `src/app/checkout/success/page.tsx`
- Create: `src/app/checkout/cancel/page.tsx`
- Modify: `next.config.ts`
- Modify: page files for metadata exports

- [ ] **Step 1: Add checkout result pages**

Create `src/app/checkout/success/page.tsx`:

```tsx
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink">Payment received</h1>
      <p className="mt-4 text-muted">Thank you for your Tap Rater order. A confirmation email will be sent after payment processing completes.</p>
      <Link href="/shop" className="mt-8 inline-block rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
        Continue shopping
      </Link>
    </section>
  );
}
```

Create `src/app/checkout/cancel/page.tsx`:

```tsx
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink">Checkout canceled</h1>
      <p className="mt-4 text-muted">Your payment was not completed. You can return to your cart and try again.</p>
      <Link href="/cart" className="mt-8 inline-block rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
        Return to cart
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Add product redirects**

Modify `next.config.ts` redirects to include:

```ts
{ source: "/product/google-review-white-stand/", destination: "/product/google-review-white-stand", permanent: true },
{ source: "/product/google-review-white-plate/", destination: "/product/google-review-white-plate", permanent: true },
{ source: "/product/facebook-review-stand/", destination: "/product/facebook-review-stand", permanent: true },
{ source: "/product/yelp-review-stand/", destination: "/product/yelp-review-stand", permanent: true },
{ source: "/product/tap-rater-business-white-bundle/", destination: "/product/tap-rater-business-white-bundle", permanent: true },
{ source: "/product/tap-rater-business-white-stands-bundle/", destination: "/product/tap-rater-business-white-stands-bundle", permanent: true },
{ source: "/product/tap-rater-white-stand-rate-your-experience/", destination: "/product/tap-rater-white-stand-rate-your-experience", permanent: true }
```

- [ ] **Step 3: Run build and commit**

Run:

```powershell
npm run build
```

Expected: build completes.

Commit:

```powershell
git add src/app/checkout next.config.ts src/app
git commit -m "feat: add checkout results and redirects"
```

---

### Task 10: End-To-End Verification And Deployment Notes

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/storefront.spec.ts`
- Create: `docs/deployment.md`

- [ ] **Step 1: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

Create `tests/e2e/storefront.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("shop and product pages render", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Shop Tap Rater" })).toBeVisible();
  await page.getByText("White Stand - Google Review").click();
  await expect(page.getByRole("heading", { name: "White Stand - Google Review" })).toBeVisible();
});

test("cart page renders", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Cart" })).toBeVisible();
});
```

- [ ] **Step 2: Add deployment notes**

Create `docs/deployment.md`:

```md
# Tap Rater Deployment

## Required Services

- Vercel for Next.js hosting.
- Supabase for Postgres.
- Stripe for Checkout and webhooks.
- Resend for transactional email.

## Environment Variables

Copy `.env.example` into Vercel and local `.env.local`.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor before testing checkout webhooks.

## Stripe

Create a webhook endpoint pointing to:

`https://taprater.com/api/stripe/webhook`

Enable the `checkout.session.completed` event.

## Launch

1. Run unit tests.
2. Run Playwright tests.
3. Run `npm run build`.
4. Verify Stripe test checkout.
5. Point `taprater.com` DNS to Vercel.
6. Verify old product URLs redirect.
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run test
npm run build
npm run e2e
```

Expected: unit tests pass, production build completes, and Playwright storefront tests pass on desktop and mobile.

- [ ] **Step 4: Commit verification assets**

```powershell
git add playwright.config.ts tests/e2e docs/deployment.md
git commit -m "test: add storefront verification"
```

---

## Self-Review

- Spec coverage: The plan covers Next.js scaffold, migrated product content, storefront routes, cart, Stripe Checkout, Stripe webhook order persistence, forms, admin pages, redirects, testing, and deployment.
- Scope management: The plan uses a single executable launch path and fixes Supabase, Resend, and simple admin auth as the first-version backend choices.
- Placeholder scan: The plan avoids undefined placeholder sections and gives concrete file paths, commands, and code for core units.
- Type consistency: Product IDs are slugs, prices are cents, stock statuses use `instock` and `outofstock`, and checkout cart metadata uses `productId`, `variantId`, and `quantity` consistently.
