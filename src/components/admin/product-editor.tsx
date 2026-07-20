"use client";

import { type FormEvent, useState } from "react";
import type { CatalogCategory, MigratedProduct, ProductCustomizationOption } from "@/data/migrated-products";

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

const customizationOptionLabels: { value: ProductCustomizationOption; label: string; description: string }[] = [
  {
    value: "standard_design",
    label: "Standard Design",
    description: "Uses the Tap Rater template."
  },
  {
    value: "add_logo",
    label: "Add Your Logo",
    description: "Logo details are collected after request."
  },
  {
    value: "custom_design",
    label: "Custom Design",
    description: "Custom layout requires design approval."
  }
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
          customizationOptions: form.getAll("customizationOptions"),
          allowsLogoUpload: form.get("allowsLogoUpload") === "true",
          allowsCustomDesign: form.get("allowsCustomDesign") === "true",
          designMode: form.get("designMode"),
          seoTitle: form.get("seoTitle"),
          seoDescription: form.get("seoDescription"),
          isActive: form.get("isActive") === "true",
          standCategorySlug: form.get("standCategorySlug") || undefined,
          destinationType: form.get("destinationType") || undefined,
          platformSlug: form.get("platformSlug") || undefined,
          tags: String(form.get("tags") ?? "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          supportsLogo: form.get("supportsLogo") === "true",
          supportsBusinessName: form.get("supportsBusinessName") === "true",
          supportsCustomHeadline: form.get("supportsCustomHeadline") === "true",
          supportsMultipleLinks: form.get("supportsMultipleLinks") === "true"
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
        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Product identity</h2>
            <p className="mt-1 text-sm text-muted">Core catalog data used by product cards, product pages, and admin lists.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="title" label="Title" defaultValue={product.title} placeholder="White Stand - Google Review" />
            <Input name="slug" label="Slug" defaultValue={product.slug} placeholder="google-review-white-stand" />
            <Input name="sku" label="SKU" defaultValue={product.sku} placeholder="TRATER01" />
            <label className="grid gap-2 text-sm font-bold text-ink">
              Category
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="categorySlug" defaultValue={product.categorySlug}>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Pricing and availability</h2>
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
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="stockStatus" defaultValue={product.stockStatus}>
                <option value="instock">In stock</option>
                <option value="outofstock">Out of stock</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Visibility
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="isActive" defaultValue={product.isActive ? "true" : "false"}>
                <option value="true">Active on storefront</option>
                <option value="false">Inactive draft</option>
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Product copy</h2>
            <p className="mt-1 text-sm text-muted">Short copy appears on cards; full copy appears on product pages.</p>
          </div>
          <Textarea name="shortDescription" label="Short description" defaultValue={product.shortDescription} />
          <Textarea name="description" label="Full description" defaultValue={product.description} tall />
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Service strategy</h2>
            <p className="mt-1 text-sm text-muted">Controls storefront badges and the activation expectations shown to customers.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Product type
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="productType" defaultValue={product.productType}>
                <option value="physical_redirect">Physical direct redirect</option>
                <option value="physical_managed">Physical managed setup</option>
                <option value="platform_landing_page">Platform landing page</option>
                <option value="bundle">Bundle</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Service mode
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="serviceMode" defaultValue={product.serviceMode}>
                <option value="basic_redirect">Basic redirect</option>
                <option value="managed_redirect">Managed redirect</option>
                <option value="hosted_landing_page">Hosted landing page</option>
                <option value="multi_location_platform">Multi-location platform</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Checkout mode
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="checkoutMode" defaultValue={product.checkoutMode}>
                <option value="buy_now">Buy now</option>
                <option value="request_quote">Request quote</option>
                <option value="subscription">Subscription</option>
                <option value="contact_sales">Contact sales</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Activation type
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="activationType" defaultValue={product.activationType}>
                <option value="free_basic_activation">Free basic activation</option>
                <option value="managed_setup">Managed setup</option>
                <option value="premium_hosted_activation">Premium hosted activation</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Account requirement
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
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
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
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
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
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
                <label key={destination} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
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
          <fieldset className="grid gap-3">
            <legend className="text-sm font-bold text-ink">Customization options</legend>
            <p className="text-sm text-muted">Logo and custom design details are collected after request. This does not enable automated uploads.</p>
            <div className="grid gap-2 md:grid-cols-3">
              {customizationOptionLabels.map((option) => (
                <label key={option.value} className="grid gap-1 rounded-2xl border border-line bg-white px-3 py-3 text-sm text-ink">
                  <span className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      name="customizationOptions"
                      value={option.value}
                      defaultChecked={product.customizationOptions.includes(option.value)}
                    />
                    {option.label}
                  </span>
                  <span className="text-xs leading-5 text-muted">{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Logo option
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="allowsLogoUpload"
                defaultValue={product.allowsLogoUpload ? "true" : "false"}
              >
                <option value="true">Logo setup available</option>
                <option value="false">No logo setup</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Custom design option
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="allowsCustomDesign"
                defaultValue={product.allowsCustomDesign ? "true" : "false"}
              >
                <option value="true">Custom design available</option>
                <option value="false">No custom design</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Default design mode
              <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="designMode" defaultValue={product.designMode}>
                <option value="standard">Standard</option>
                <option value="logo">Logo</option>
                <option value="custom">Custom</option>
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Catalog v2 -- stand category and use cases</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Stand category is what kind of stand this is (Shop by Stand). Tags are which business/use case this product
              belongs to (Shop by Use) -- a product can carry many tags without ever being duplicated as a separate SKU.
              Never used as a URL. Comma-separated, e.g. <code>restaurants-cafes, retail-grocery</code>.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Stand category
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="standCategorySlug"
                defaultValue={product.standCategorySlug ?? ""}
              >
                <option value="">Not set</option>
                <option value="review-stands">Review Stands</option>
                <option value="social-media-stands">Social Media Stands</option>
                <option value="appointment-stands">Appointment Stands</option>
                <option value="feedback-stands">Feedback Stands</option>
                <option value="menu-info-stands">Menu & Info Stands</option>
                <option value="website-link-stands">Website & Link Stands</option>
                <option value="payment-tip-donation-stands">Payment, Tip & Donation Stands</option>
                <option value="loyalty-rewards-stands">Loyalty & Rewards Stands</option>
                <option value="custom-stands">Custom Stands</option>
                <option value="hosted-tap-page-stands">Hosted Tap Page Stands</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Destination type
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="destinationType"
                defaultValue={product.destinationType ?? ""}
              >
                <option value="">Not set</option>
                <option value="review">Review</option>
                <option value="social">Social</option>
                <option value="appointment">Appointment</option>
                <option value="feedback">Feedback</option>
                <option value="menu_info">Menu & Info</option>
                <option value="website">Website</option>
                <option value="payment">Payment</option>
                <option value="custom">Custom</option>
                <option value="hosted_page">Hosted Page</option>
              </select>
            </label>
            <Input
              name="platformSlug"
              label="Platform (optional)"
              defaultValue={product.platformSlug ?? ""}
              required={false}
              placeholder="google, yelp, trustpilot..."
            />
          </div>
          <Input
            name="tags"
            label="Tags / use cases (comma-separated)"
            defaultValue={(product.tags ?? []).join(", ")}
            required={false}
            placeholder="restaurants-cafes, retail-grocery, review, universal"
          />
          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Logo
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="supportsLogo"
                defaultValue={product.supportsLogo === false ? "false" : "true"}
              >
                <option value="true">Supported</option>
                <option value="false">Not supported</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Business name
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="supportsBusinessName"
                defaultValue={product.supportsBusinessName === false ? "false" : "true"}
              >
                <option value="true">Supported</option>
                <option value="false">Not supported</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Custom headline
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="supportsCustomHeadline"
                defaultValue={product.supportsCustomHeadline ? "true" : "false"}
              >
                <option value="false">Not supported</option>
                <option value="true">Supported</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Multiple links
              <select
                className="rounded-xl border border-line bg-white px-4 py-3 font-normal"
                name="supportsMultipleLinks"
                defaultValue={product.supportsMultipleLinks ? "true" : "false"}
              >
                <option value="false">Not supported</option>
                <option value="true">Supported</option>
              </select>
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">SEO</h2>
            <p className="mt-1 text-sm text-muted">Used by public product metadata when this product is published.</p>
          </div>
          <Input name="seoTitle" label="SEO title" defaultValue={product.seoTitle ?? ""} required={false} placeholder="Google Review Stand for Businesses" />
          <Textarea name="seoDescription" label="SEO description" defaultValue={product.seoDescription ?? ""} required={false} />
        </section>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
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
        className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink"
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
      <textarea className={`${tall ? "min-h-44" : "min-h-24"} rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink`} name={name} defaultValue={defaultValue} required={required} />
    </label>
  );
}
