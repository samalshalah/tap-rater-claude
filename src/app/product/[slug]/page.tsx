import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { migratedProducts } from "@/data/migrated-products";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatPrice, getCategoryBySlug, getProductBySlug, getProductPriceCents, getRelatedProducts } from "@/lib/products";
import { absoluteUrl, faqJsonLd, JsonLd, productJsonLd } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedProducts = getRelatedProducts(product);
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
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
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
          <p className="mt-6 text-sm font-semibold uppercase text-brand">{product.stockStatus === "instock" ? "In stock" : "Out of stock"}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-ink">{product.seoTitle?.replace(" | Tap Rater", "") ?? product.title}</h1>
          <p className="mt-4 text-3xl font-black text-brand">{formatPrice(getProductPriceCents(product))}</p>
          <p className="mt-5 text-lg leading-8 text-muted">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Tap-ready NFC display", "Works with your review link", "Built for front desks and counters"].map((benefit) => (
              <div key={benefit} className="rounded-md border border-line bg-gray-50 p-4 text-sm font-bold text-ink">
                {benefit}
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-md border border-line p-5 text-sm text-muted">
            <p><strong className="text-ink">SKU:</strong> {product.sku}</p>
            {category ? <p><strong className="text-ink">Category:</strong> {category.title}</p> : null}
            <p><strong className="text-ink">Best for:</strong> local businesses, restaurants, salons, clinics, retail stores, service counters, and customer-facing teams.</p>
            <p><strong className="text-ink">Review destinations:</strong> Google reviews, Facebook reviews, Yelp reviews, surveys, and custom feedback links.</p>
          </div>
          {product.variants.length > 0 ? (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink">Available colors</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <span key={variant.id} className="rounded-md border border-line px-3 py-2 text-sm text-muted">
                    {variant.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <AddToCartButton productId={product.slug} disabled={product.stockStatus !== "instock"} />
          <p className="mt-4 text-sm leading-6 text-muted">
            Payment is not connected in this preview. Stripe checkout will be added in the final launch stage.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-brand">Why businesses use it</p>
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
