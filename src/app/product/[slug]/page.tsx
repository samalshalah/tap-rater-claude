import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Link2, MessageSquareText, Smartphone, Store } from "lucide-react";
import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
  getStorefrontRelatedProducts
} from "@/lib/product-repository";
import { formatPrice, getCategoryBySlug } from "@/lib/products";
import {
  getProductActivationCopy,
  getProductComparisonRows,
  getProductPageHighlights,
  getProductPageUseCases,
  getProductServiceBadges,
  getReviewDestination
} from "@/lib/product-page-content";
import { absoluteUrl, faqJsonLd, JsonLd, productJsonLd } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found"
    };
  }

  const title = product.seoTitle?.replace(" | Tap Rater", "") ?? product.title;
  const description = product.seoDescription ?? product.description;

  return {
    title,
    description,
    keywords: product.searchKeywords,
    alternates: {
      canonical: `/product/${product.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/product/${product.slug}`,
      images: product.images.map((image) => ({
        url: absoluteUrl(image.src),
        alt: image.alt
      }))
    }
  };
}

export function generateStaticParams() {
  return migratedProducts.filter((product) => product.isActive).map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getStorefrontProducts();
  const product = products.find((item) => item.slug === slug && item.isActive);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedProducts = getStorefrontRelatedProducts(product, products);
  const highlights = getProductPageHighlights(product);
  const useCases = getProductPageUseCases(product);
  const comparisonRows = getProductComparisonRows(product);
  const destination = getReviewDestination(product);
  const serviceBadges = getProductServiceBadges(product);
  const activationCopy = getProductActivationCopy(product);
  const checkoutAction = getCheckoutAction(product);
  const designOptions = getDesignOptions(product);
  const productFaqs = [
    {
      question: `How does ${product.title} work?`,
      answer:
        "Customers tap their NFC-enabled phone or scan the QR code on the Tap Rater product. The phone opens the review, feedback, booking, social, or survey destination configured for your business."
    },
    {
      question: "Does this product require a monthly fee?",
      answer: product.requiresSubscription
        ? "Hosted landing pages and platform-powered forms require a subscription for hosted features. Basic direct-link products remain available without a monthly fee."
        : "No monthly fee is required for basic activation. Optional premium dashboard and hosted landing page features can be added later when needed."
    },
    {
      question: "Where should I place this Tap Rater product?",
      answer:
        "Place stands where customers naturally pause, such as checkout counters, front desks, reception areas, pickup counters, or service desks. Place plates on desks, tables, counters, or compact reception areas."
    }
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={faqJsonLd(productFaqs)} />

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
          <ProductGallery product={product} />
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <Link href="/shop" className="text-brand hover:text-brand-dark">Shop</Link>
              {category ? (
                <>
                  <span>/</span>
                  <Link href={`/category/${category.slug}`} className="text-brand hover:text-brand-dark">{category.title}</Link>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={product.stockStatus === "instock" ? "rounded-full bg-brand/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brand" : "rounded-full bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted"}>
                {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
              </span>
              <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted">{destination}</span>
            </div>

            <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tightest text-ink sm:text-[40px]">
              {product.seoTitle?.replace(" | Tap Rater", "") ?? product.title}
            </h1>
            <p className="mt-4 text-[16px] leading-7 text-muted">{product.description}</p>

            {product.displayText ? (
              <div className="mt-5 rounded-2xl bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Main display text</p>
                <p className="mt-1 text-[17px] font-medium text-ink">{product.displayText}</p>
              </div>
            ) : null}

            <div className="mt-6 flex items-end justify-between border-y border-line py-5">
              <div>
                <p className="text-[12px] text-muted">Price</p>
                <p className="mt-1 text-[30px] font-semibold text-ink">{getProductPriceLabel(product)}</p>
              </div>
            </div>

            {product.variants.length > 0 ? (
              <div className="mt-6">
                <p className="text-[13px] font-medium text-ink">Available colors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <span key={variant.id} className="rounded-full bg-surface px-4 py-2 text-[13px] font-medium text-ink">
                      {variant.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <Link
              href={checkoutAction.href}
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-brand"
            >
              {checkoutAction.label}
            </Link>
            <p className="mt-2 text-[12px] text-muted">{checkoutAction.supportingCopy}</p>

            <div className="mt-5 grid gap-2.5 text-[13px] text-muted sm:grid-cols-2">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" strokeWidth={1.5} /> No monthly fee for basic activation</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" strokeWidth={1.5} /> Connects to one destination URL</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" strokeWidth={1.5} /> Tap or scan ready</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" strokeWidth={1.5} /> Stripe stays in test mode</p>
            </div>

            {designOptions.length > 0 ? (
              <div className="mt-8">
                <p className="text-[13px] font-medium text-ink">Choose a design option</p>
                <div className="mt-4 grid gap-3">
                  {designOptions.map((option) => (
                    <div key={option.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[14px] font-medium text-ink">{option.title}</p>
                        <p className="mt-1 text-[13px] leading-5 text-muted">{option.body}</p>
                      </div>
                      <Link
                        href={option.href}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink transition hover:border-ink"
                      >
                        {option.cta}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => {
              const Icon = [Smartphone, Link2, Store, MessageSquareText][index] ?? CheckCircle2;
              return (
                <div key={highlight.title} className="rounded-2xl bg-white p-6">
                  <Icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
                  <p className="mt-4 text-[15px] font-medium text-ink">{highlight.title}</p>
                  <p className="mt-2 text-[13px] leading-5 text-muted">{highlight.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">What you get</p>
            <h2 className="mt-3 text-[26px] font-semibold tracking-tightest text-ink">A prompt customers understand instantly.</h2>
          </div>
          <div className="grid gap-3">
            {[
              "NFC-enabled display for your counter, desk, table, or service point.",
              "Support for Google, Facebook, Yelp, TripAdvisor, social, booking, menu, and feedback links.",
              "Clear tap or scan wording — no app, no searching.",
              "Available as a tabletop stand or a low-profile plate."
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-surface p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} />
                <p className="text-[14px] leading-6 text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">Activation and service</p>
            <h2 className="mt-3 text-[26px] font-semibold tracking-tightest text-ink">{activationCopy.title}</h2>
            <p className="mt-4 text-[14px] leading-6 text-muted">{activationCopy.body}</p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-[14px] font-medium text-ink">One-time product clarity</p>
              <p className="mt-2 text-[13px] leading-5 text-muted">
                No monthly fee for basic activation. Connects to one destination URL. Tap or scan ready.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-[14px] font-medium text-ink">Platform products</p>
              <p className="mt-2 text-[13px] leading-5 text-muted">
                Premium landing pages, forms, and dashboard features for products that need more than one destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">Business use cases</p>
          <h2 className="mt-3 text-[26px] font-semibold tracking-tightest text-ink">Built for high-intent moments.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="rounded-2xl bg-surface p-5">
                <p className="text-[14px] font-medium text-ink">{useCase.title}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{useCase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-16">
        <div className="mx-auto grid max-w-[1100px] gap-8 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">Compare product type</p>
            <h2 className="mt-3 text-[26px] font-semibold tracking-tightest text-ink">Make sure this is the right format.</h2>
            <p className="mt-4 text-[14px] leading-6 text-muted">
              This page highlights the format you're viewing and where another Tap Rater option may fit better.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white">
            {comparisonRows.map((row) => (
              <div key={row.label} className={row.active ? "grid gap-2 bg-brand/[0.06] p-4 md:grid-cols-3" : "grid gap-2 border-t border-line p-4 md:grid-cols-3"}>
                <p className="text-[14px] font-medium text-ink">{row.label}{row.active ? " — this product" : ""}</p>
                <p className="text-[13px] leading-5 text-muted">{row.bestFor}</p>
                <p className="text-[13px] font-medium text-ink">{row.fit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">How to use it</p>
          <h2 className="mt-3 max-w-2xl text-[26px] font-semibold tracking-tightest text-ink">
            Make review and feedback requests easier at the point of service.
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Choose your review link",
                body: "Google, Facebook, Yelp, a survey, or a custom feedback URL."
              },
              {
                title: "Place it where customers finish",
                body: "Checkout, pickup, reception, tables, or treatment rooms."
              },
              {
                title: "Ask at the right moment",
                body: "Invite a tap or scan while the experience is still fresh."
              }
            ].map((step) => (
              <div key={step.title} className="rounded-2xl bg-surface p-5">
                <p className="text-[14px] font-medium text-ink">{step.title}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">Product questions</p>
          <h2 className="mt-3 text-[26px] font-semibold tracking-tightest text-ink">Answers before you buy.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {productFaqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-surface p-5">
                <p className="text-[14px] font-medium text-ink">{faq.question}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-[26px] font-semibold tracking-tightest text-ink">Related products</h2>
              {category ? (
                <Link href={`/category/${category.slug}`} className="text-[13px] font-medium text-brand hover:text-brand-dark">
                  View {category.title} &rsaquo;
                </Link>
              ) : null}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function getCheckoutAction(product: { checkoutMode: string }) {
  if (product.checkoutMode === "request_quote") {
    return {
      href: "/contact-us",
      label: "Request a quote",
      supportingCopy: "Quote required before checkout"
    };
  }

  if (product.checkoutMode === "subscription") {
    return {
      href: "/contact-us",
      label: "Contact us for subscription setup",
      supportingCopy: "Subscription setup required"
    };
  }

  if (product.checkoutMode === "contact_sales") {
    return {
      href: "/contact-us",
      label: "Contact sales",
      supportingCopy: "Sales consultation required"
    };
  }

  return {
    href: "/setup-new-taprater",
    label: "Request setup",
    supportingCopy: "Checkout is not live yet. Setup details are collected by request."
  };
}

function getDesignOptions(product: Pick<MigratedProduct, "slug" | "customizationOptions" | "allowsLogoUpload" | "allowsCustomDesign">) {
  const allOptions = [
    {
      id: "standard_design" as const,
      title: "Standard design",
      body: "Uses the Tap Rater template and is the fastest setup.",
      bestFor: "Best for fast setup",
      href: `/setup-new-taprater?product=${product.slug}&design=standard`,
      cta: "Request setup"
    },
    {
      id: "add_logo" as const,
      title: "Add your logo",
      body: "Add your business logo to the Tap Rater design.",
      bestFor: "Logo setup required after request",
      href: `/setup-new-taprater?product=${product.slug}&design=logo`,
      cta: "Request logo setup"
    },
    {
      id: "custom_design" as const,
      title: "Custom design",
      body: "Custom colors, layout, wording, and logo placement.",
      bestFor: "Requires design approval before production",
      href: `/contact-us?product=${product.slug}&design=custom`,
      cta: "Request custom design"
    }
  ];

  return allOptions.filter((option) => {
    if (!product.customizationOptions.includes(option.id)) return false;
    if (option.id === "add_logo") return product.allowsLogoUpload;
    if (option.id === "custom_design") return product.allowsCustomDesign;
    return true;
  });
}

function getProductPriceLabel(product: { checkoutMode: string; salePriceCents?: number; basePriceCents: number }) {
  if (product.checkoutMode === "request_quote") {
    return "Request quote";
  }

  if (product.checkoutMode === "contact_sales") {
    return "Contact sales";
  }

  if (product.checkoutMode === "subscription") {
    return "Subscription setup";
  }

  return formatPrice(product.salePriceCents ?? product.basePriceCents);
}
