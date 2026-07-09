"use client";

import { type FormEvent, useState } from "react";
import type { CatalogCategory, MigratedProduct } from "@/data/migrated-products";

const supportedDestinationOptions = [
  "google",
  "facebook",
  "yelp",
  "tripadvisor",
  "instagram",
  "tiktok",
  "booking",
  "website",
  "menu",
  "wifi",
  "feedback",
  "referral",
  "custom"
];

type ProductEditorProps = {
  product: MigratedProduct;
  categories: CatalogCategory[];
  mode: "create" | "edit";
};

type SaveStatus = {
  tone: "success" | "error";
  message: string;
} | null;

export function ProductEditor({ product, categories, mode }: ProductEditorProps) {
  const [status, setStatus] = useState<SaveStatus>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const salePrice = String(form.get("salePriceCents") ?? "");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.get("slug"),
          title: form.get("title"),
          sku: form.get("sku"),
          categorySlug: form.get("categorySlug"),
          basePriceCents: Number(form.get("basePriceCents")),
          salePriceCents: salePrice ? Number(salePrice) : undefined,
          stockStatus: form.get("stockStatus"),
          shortDescription: form.get("shortDescription"),
          description: form.get("description"),
          productType: form.get("productType"),
          serviceMode: form.get("serviceMode"),
          checkoutMode: form.get("checkoutMode"),
          requiresAccount: form.get("requiresAccount") === "true",
          requiresSubscription: form.get("requiresSubscription") === "true",
          requiresLandingPage: form.get("requiresLandingPage") === "true",
          supportedDestinations: form.getAll("supportedDestinations"),
          activationType: form.get("activationType"),
          includedServiceLabel: form.get("includedServiceLabel"),
          seoTitle: form.get("seoTitle"),
          seoDescription: form.get("seoDescription"),
          isActive: form.get("isActive") === "true"
        })
      });
      const body = await response.json().catch(() => ({}));
      setStatus({
        tone: response.ok ? "success" : "error",
        message: response.ok
          ? mode === "create"
            ? "Product created."
            : "Product saved."
          : body.error ?? "Product save failed."
      });
    } catch {
      setStatus({ tone: "error", message: "Product save failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-md border border-line bg-gray-50 p-4">
          <div>
            <h2 className="text-lg font-black text-ink">Product identity</h2>
            <p className="mt-1 text-sm text-muted">Core catalog data used by product cards, product pages, and admin lists.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="title" label="Title" defaultValue={product.title} placeholder="White Stand - Google Review" />
            <Input name="slug" label="Slug" defaultValue={product.slug} placeholder="google-review-white-stand" />
            <Input name="sku" label="SKU" defaultValue={product.sku} placeholder="TRATER01" />
            <label className="grid gap-2 text-sm font-bold text-ink">
              Category
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="categorySlug" defaultValue={product.categorySlug}>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-md border border-line bg-gray-50 p-4">
          <div>
            <h2 className="text-lg font-black text-ink">Pricing and availability</h2>
            <p className="mt-1 text-sm text-muted">Prices are stored in cents so $49.00 is entered as 4900.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="basePriceCents" label="Base price cents" defaultValue={String(product.basePriceCents)} inputMode="numeric" placeholder="4900" />
            <Input
              name="salePriceCents"
              label="Sale price cents"
              defaultValue={product.salePriceCents === undefined ? "" : String(product.salePriceCents)}
              inputMode="numeric"
              placeholder="Optional"
              required={false}
            />
            <label className="grid gap-2 text-sm font-bold text-ink">
              Stock status
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="stockStatus" defaultValue={product.stockStatus}>
                <option value="instock">In stock</option>
                <option value="outofstock">Out of stock</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Visibility
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="isActive" defaultValue={product.isActive ? "true" : "false"}>
                <option value="true">Active on storefront</option>
                <option value="false">Inactive draft</option>
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-md border border-line bg-gray-50 p-4">
          <div>
            <h2 className="text-lg font-black text-ink">Product copy</h2>
            <p className="mt-1 text-sm text-muted">Short copy appears on cards; full copy appears on product pages.</p>
          </div>
          <Textarea name="shortDescription" label="Short description" defaultValue={product.shortDescription} />
          <Textarea name="description" label="Full description" defaultValue={product.description} tall />
        </section>

        <section className="grid gap-4 rounded-md border border-line bg-gray-50 p-4">
          <div>
            <h2 className="text-lg font-black text-ink">Service strategy</h2>
            <p className="mt-1 text-sm text-muted">Controls storefront badges and the activation expectations shown to customers.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Product type
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="productType" defaultValue={product.productType}>
                <option value="physical_redirect">Physical direct redirect</option>
                <option value="physical_managed">Physical managed setup</option>
                <option value="platform_landing_page">Platform landing page</option>
                <option value="bundle">Bundle</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Service mode
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="serviceMode" defaultValue={product.serviceMode}>
                <option value="basic_redirect">Basic redirect</option>
                <option value="managed_redirect">Managed redirect</option>
                <option value="hosted_landing_page">Hosted landing page</option>
                <option value="multi_location_platform">Multi-location platform</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Checkout mode
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="checkoutMode" defaultValue={product.checkoutMode}>
                <option value="buy_now">Buy now</option>
                <option value="request_quote">Request quote</option>
                <option value="subscription">Subscription</option>
                <option value="contact_sales">Contact sales</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Activation type
              <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="activationType" defaultValue={product.activationType}>
                <option value="free_basic_activation">Free basic activation</option>
                <option value="managed_setup">Managed setup</option>
                <option value="premium_hosted_activation">Premium hosted activation</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Account requirement
              <select
                className="rounded-md border border-line bg-white px-4 py-3 font-normal"
                name="requiresAccount"
                defaultValue={product.requiresAccount ? "true" : "false"}
              >
                <option value="false">No customer account required</option>
                <option value="true">Customer account required</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Subscription requirement
              <select
                className="rounded-md border border-line bg-white px-4 py-3 font-normal"
                name="requiresSubscription"
                defaultValue={product.requiresSubscription ? "true" : "false"}
              >
                <option value="false">No subscription required</option>
                <option value="true">Subscription required for hosted features</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Landing page requirement
              <select
                className="rounded-md border border-line bg-white px-4 py-3 font-normal"
                name="requiresLandingPage"
                defaultValue={product.requiresLandingPage ? "true" : "false"}
              >
                <option value="false">Direct link redirect</option>
                <option value="true">Hosted landing page required</option>
              </select>
            </label>
            <Input
              name="includedServiceLabel"
              label="Included service label"
              defaultValue={product.includedServiceLabel}
              placeholder="Free basic activation"
            />
          </div>
          <fieldset className="grid gap-3">
            <legend className="text-sm font-bold text-ink">Supported destinations</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {supportedDestinationOptions.map((destination) => (
                <label key={destination} className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    name="supportedDestinations"
                    value={destination}
                    defaultChecked={product.supportedDestinations.includes(destination as MigratedProduct["supportedDestinations"][number])}
                  />
                  {destination}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="grid gap-4 rounded-md border border-line bg-gray-50 p-4">
          <div>
            <h2 className="text-lg font-black text-ink">SEO</h2>
            <p className="mt-1 text-sm text-muted">Used by public product metadata when this product is published.</p>
          </div>
          <Input name="seoTitle" label="SEO title" defaultValue={product.seoTitle ?? ""} required={false} placeholder="Google Review NFC Stand for Businesses" />
          <Textarea name="seoDescription" label="SEO description" defaultValue={product.seoDescription ?? ""} required={false} />
        </section>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300" disabled={isSaving}>
          {isSaving ? "Saving..." : mode === "create" ? "Create product" : "Save product"}
        </button>
        {status ? (
          <p className={status.tone === "success" ? "text-sm font-bold text-brand" : "text-sm font-bold text-red-600"}>
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Input({
  name,
  label,
  defaultValue,
  inputMode,
  placeholder,
  required = true
}: {
  name: string;
  label: string;
  defaultValue: string;
  inputMode?: "numeric";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <input
        className="rounded-md border border-line bg-white px-4 py-3 font-normal text-ink"
        name={name}
        defaultValue={defaultValue}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function Textarea({ name, label, defaultValue, tall = false, required = true }: { name: string; label: string; defaultValue: string; tall?: boolean; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <textarea className={`${tall ? "min-h-44" : "min-h-24"} rounded-md border border-line bg-white px-4 py-3 font-normal text-ink`} name={name} defaultValue={defaultValue} required={required} />
    </label>
  );
}
