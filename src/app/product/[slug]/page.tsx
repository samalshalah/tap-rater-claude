import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Link2, MessageSquareText, Smartphone, Store } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { migratedProducts } from "@/data/migrated-products";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
  getStorefrontRelatedProducts
} from "@/lib/product-repository";
import { formatPrice, getCategoryBySlug, getProductPriceCents } from "@/lib/products";
import { getProductComparisonRows, getProductPageHighlights, getProductPageUseCases, getReviewDestination } from "@/lib/product-page-content";
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
  const productFaqs = [
    {
      question: `How does ${product.title} work?`,
      answer:
        "Customers tap their NFC-enabled phone on the Tap Rater product. The phone opens the review, feedback, or survey link configured for your business."
    },
    {
      question: "Can this product open a Google review link?",
      answer:
        "Yes. Tap Rater products can be configured for Google review links, Facebook review links, Yelp links, or a custom customer feedback page."
    },
    {
      question: "Where should I place an NFC review stand?",
      answer:
        "Place it where customers finish a positive interaction: checkout counters, front desks, reception areas, pickup counters, service desks, tables, or point-of-sale areas."
    }
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={faqJsonLd(productFaqs)} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <ProductGallery product={product} />
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <Link href="/shop" className="text-brand">Shop</Link>
              {category ? (
                <>
                  <span className="text-muted">/</span>
                  <Link href={`/category/${category.slug}`} className="text-brand">{category.title}</Link>
                </>
              ) : null}
            </div>

            <div className="mt-6 rounded-md border border-line bg-white p-5 shadow-sm md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className={product.stockStatus === "instock" ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase text-brand" : "rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-muted"}>
                  {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-muted">{destination}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-muted">SKU {product.sku}</span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight text-ink md:text-5xl">{product.seoTitle?.replace(" | Tap Rater", "") ?? product.title}</h1>
              <p className="mt-5 text-lg leading-8 text-muted">{product.description}</p>

              <div className="mt-6 flex flex-col gap-3 border-y border-line py-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-muted">Price</p>
                  <p className="mt-1 text-4xl font-black text-brand">{formatPrice(getProductPriceCents(product))}</p>
                </div>
                {product.salePriceCents ? (
                  <p className="rounded-md bg-amber-50 px-4 py-3 text-sm font-bold text-ink">
                    Bundle savings applied
                  </p>
                ) : null}
              </div>

              {product.variants.length > 0 ? (
                <div className="mt-6">
                  <p className="text-sm font-bold text-ink">Available colors</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span key={variant.id} className="rounded-md border border-line bg-gray-50 px-4 py-3 text-sm font-bold text-ink">
                        {variant.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <AddToCartButton productId={product.slug} disabled={product.stockStatus !== "instock"} />
              <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" /> Preview cart only</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" /> Stripe added at launch stage</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-md border border-line bg-gray-50 p-5 text-sm text-muted md:grid-cols-2">
              <p><strong className="text-ink">Best for:</strong> restaurants, salons, clinics, retail stores, service counters, and customer-facing teams.</p>
              <p><strong className="text-ink">Review destinations:</strong> Google reviews, Facebook reviews, Yelp reviews, surveys, and custom feedback links.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => {
              const Icon = [Smartphone, Link2, Store, MessageSquareText][index] ?? CheckCircle2;

              return (
                <article key={highlight.title} className="rounded-md border border-line bg-white p-5">
                  <Icon className="h-6 w-6 text-brand" />
                  <h2 className="mt-4 text-lg font-black text-ink">{highlight.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{highlight.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-brand">What you get</p>
              <h2 className="mt-3 text-3xl font-black text-ink">A physical review prompt customers understand quickly.</h2>
              <p className="mt-4 leading-7 text-muted">
                The product gives your staff a consistent way to ask for reviews in person. Customers see the prompt, tap their phone, and land on the review or feedback destination you choose.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "NFC-enabled Tap Rater display for your counter, desk, table, or service point.",
                "Support for Google, Facebook, Yelp, survey pages, and custom feedback URLs.",
                "Clear tap-to-review wording that works without asking customers to search online.",
                "A product type that fits your business setup: stand, plate, bundle, or feedback display."
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-md border border-line bg-gray-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <p className="text-sm leading-6 text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-brand">Business use cases</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Built for high-intent customer moments.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-md border border-line bg-white p-5">
                <h3 className="font-bold text-ink">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{useCase.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-brand">Compare product type</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Make sure this is the right Tap Rater format.</h2>
              <p className="mt-4 leading-7 text-muted">
                Different businesses need different review prompts. This page highlights the format you are viewing and shows when another Tap Rater option may fit better.
              </p>
            </div>
            <div className="overflow-hidden rounded-md border border-line">
              {comparisonRows.map((row) => (
                <div key={row.label} className={row.active ? "grid gap-3 bg-teal-50 p-4 md:grid-cols-3" : "grid gap-3 border-t border-line bg-white p-4 md:grid-cols-3"}>
                  <p className="font-black text-ink">{row.label}{row.active ? " - this product" : ""}</p>
                  <p className="text-sm leading-6 text-muted">{row.bestFor}</p>
                  <p className="text-sm font-semibold text-ink">{row.fit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-brand">How to use it</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Make review requests easier at the point of service.</h2>
            <p className="mt-4 leading-7 text-muted">
              Customers are most likely to leave a helpful review when the experience is still fresh. A Tap Rater NFC review stand or plate gives them a simple physical reminder and removes the friction of searching for your business profile.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Choose your review link",
                body: "Use your Google review link, Facebook recommendation page, Yelp listing, survey, or custom feedback URL."
              },
              {
                title: "Place it where customers finish",
                body: "Put the stand or plate near checkout, pickup, reception, tables, treatment rooms, or service desks."
              },
              {
                title: "Ask at the right moment",
                body: "Invite satisfied customers to tap before they leave, when the service experience is still fresh."
              }
            ].map((step) => (
              <article key={step.title} className="rounded-md border border-line bg-white p-5">
                <h3 className="font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-brand">Product questions</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Answers before you buy.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {productFaqs.map((faq) => (
              <article key={faq.question} className="rounded-md border border-line bg-white p-5">
                <h3 className="font-bold text-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-line bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-brand">Compare options</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Related Tap Rater products</h2>
              </div>
              {category ? (
                <Link href={`/category/${category.slug}`} className="text-sm font-bold text-brand">
                  View {category.title}
                </Link>
              ) : null}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
