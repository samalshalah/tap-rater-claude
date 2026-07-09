"use client";

import { type FormEvent, useState } from "react";
import type { MigratedProduct } from "@/data/migrated-products";

export function ProductEditor({ product }: { product: MigratedProduct }) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const salePrice = String(form.get("salePriceCents") ?? "");
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
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        isActive: form.get("isActive") === "true"
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Product saved." : body.error ?? "Product save failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="slug" label="Slug" defaultValue={product.slug} />
        <Input name="sku" label="SKU" defaultValue={product.sku} />
        <Input name="title" label="Title" defaultValue={product.title} />
        <Input name="categorySlug" label="Category slug" defaultValue={product.categorySlug} />
        <Input name="basePriceCents" label="Base price cents" defaultValue={String(product.basePriceCents)} />
        <Input name="salePriceCents" label="Sale price cents" defaultValue={product.salePriceCents ? String(product.salePriceCents) : ""} required={false} />
      </div>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Stock
        <select className="rounded-md border border-line px-4 py-3 font-normal" name="stockStatus" defaultValue={product.stockStatus}>
          <option value="instock">In stock</option>
          <option value="outofstock">Out of stock</option>
        </select>
      </label>
      <Textarea name="shortDescription" label="Short description" defaultValue={product.shortDescription} />
      <Textarea name="description" label="Description" defaultValue={product.description} tall />
      <Input name="seoTitle" label="SEO title" defaultValue={product.seoTitle ?? ""} required={false} />
      <Textarea name="seoDescription" label="SEO description" defaultValue={product.seoDescription ?? ""} required={false} />
      <label className="grid gap-2 text-sm font-bold text-ink">
        Visibility
        <select className="rounded-md border border-line px-4 py-3 font-normal" name="isActive" defaultValue={product.isActive ? "true" : "false"}>
          <option value="true">Active</option>
          <option value="false">Draft</option>
        </select>
      </label>
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">Save product</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}

function Input({ name, label, defaultValue, required = true }: { name: string; label: string; defaultValue: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <input className="rounded-md border border-line px-4 py-3 font-normal text-ink" name={name} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function Textarea({ name, label, defaultValue, tall = false, required = true }: { name: string; label: string; defaultValue: string; tall?: boolean; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <textarea className={`${tall ? "min-h-44" : "min-h-24"} rounded-md border border-line px-4 py-3 font-normal text-ink`} name={name} defaultValue={defaultValue} required={required} />
    </label>
  );
}
