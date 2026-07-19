import { describe, expect, it } from "vitest";
import { allProducts } from "@/data/catalog";
import { buildFacebookCatalogCsv, csvEscape, formatPriceUsd, hasRealPhoto } from "@/lib/product-feeds";

describe("Facebook/Instagram catalog feed", () => {
  it("formats prices as decimal USD strings", () => {
    expect(formatPriceUsd(4900)).toBe("49.00 USD");
    expect(formatPriceUsd(7995)).toBe("79.95 USD");
  });

  it("escapes commas, quotes, and newlines per CSV rules", () => {
    expect(csvEscape("Simple text")).toBe("Simple text");
    expect(csvEscape("Has, a comma")).toBe('"Has, a comma"');
    expect(csvEscape('Has "quotes"')).toBe('"Has ""quotes"""');
    expect(csvEscape("Has\na newline")).toBe('"Has\na newline"');
  });

  it("identifies products still on the generic no-photo placeholder", () => {
    const withPhoto = allProducts.find((p) => p.slug === "trustpilot-review-stand")!;
    const withoutPhoto = allProducts.find((p) => p.standCategorySlug === "payment-tip-donation-stands")!;

    expect(hasRealPhoto(withPhoto)).toBe(true);
    expect(hasRealPhoto(withoutPhoto)).toBe(false);
  });

  it("excludes products without real photography and inactive products from the feed", () => {
    const csv = buildFacebookCatalogCsv(allProducts);
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      "id,title,description,availability,condition,price,sale_price,link,image_link,brand,product_type,google_product_category"
    );

    // Discontinued Payment/Tip/Donation products (inactive) must never appear.
    expect(csv).not.toContain("venmo-stand");
    expect(csv).not.toContain("paypal-stand");

    // A real product with real photography must appear, with expected fields.
    const trustpilotLine = lines.find((line) => line.startsWith("trustpilot-review-stand,"));
    expect(trustpilotLine).toBeDefined();
    expect(trustpilotLine).toContain("in stock");
    expect(trustpilotLine).toContain("new");
    expect(trustpilotLine).toContain("49.00 USD");
    expect(trustpilotLine).toContain("Tap Rater");
    expect(trustpilotLine).toContain("https://taprater.com/product/trustpilot-review-stand");
  });

  it("only includes products that pass isActive AND hasRealPhoto -- both conditions, not either", () => {
    const csv = buildFacebookCatalogCsv(allProducts);
    const rowCount = csv.split("\n").length - 1; // minus header

    const expectedCount = allProducts.filter((p) => p.isActive && hasRealPhoto(p)).length;
    expect(rowCount).toBe(expectedCount);
    expect(rowCount).toBeGreaterThan(100);
    expect(rowCount).toBeLessThan(150);
  });
});
