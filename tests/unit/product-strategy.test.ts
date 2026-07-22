import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Tap Rater product strategy", () => {
  it("documents Tap Rater as both a product store and reputation platform", () => {
    const doc = readFileSync("docs/product-strategy.md", "utf8");

    expect(doc).toContain("Tap Rater is both a product store and a reputation platform");
    expect(doc).toContain("standalone NFC products");
    expect(doc).toContain("managed setup");
    expect(doc).toContain("hosted landing pages");
    expect(doc).toContain("customer account");
    expect(doc).toContain("bundles");
    expect(doc).toContain("Do not block unhappy customers");
    expect(doc).toContain("Phase 1");
    expect(doc).toContain("Phase 2");
    expect(doc).toContain("Phase 3");
  });

  it("positions the temporary homepage around the coming-soon launch", () => {
    const homepage = readFileSync("src/app/page.tsx", "utf8");

    expect(homepage).toContain("New storefront launching soon");
    expect(homepage).toContain("Tap Rater is getting ready.");
    expect(homepage).toContain("NFC review stands, smart tap links, and local business reputation tools");
  });

  it("documents the platform domain split, redirect engine, and database entities", () => {
    const doc = readFileSync("docs/platform-architecture.md", "utf8");

    expect(doc).toContain("Marketing site: `taprater.com`");
    expect(doc).toContain("Customer portal: `app.taprater.com`");
    expect(doc).toContain("Redirect engine: `/r/{deviceCode}`");
    expect(doc).toContain("`r.taprater.com/{token}`");
    for (const entity of [
      "customer",
      "business",
      "location",
      "device",
      "landing_page",
      "tap_event",
      "feedback_submission",
      "product",
      "quote_request",
      "order",
      "subscription"
    ]) {
      expect(doc).toContain(`\`${entity}\``);
    }
    expect(doc).toContain("Products connect to activation, accounts, landing pages, and dashboards");
  });

  it("documents the MVP phases without enabling live Stripe", () => {
    const doc = readFileSync("docs/mvp-scope.md", "utf8");

    expect(doc).toContain("Phase 1");
    expect(doc).toContain("marketing pages");
    expect(doc).toContain("expanded product catalog");
    expect(doc).toContain("device activation");
    expect(doc).toContain("basic tap analytics");
    expect(doc).toContain("Phase 2");
    expect(doc).toContain("hosted landing pages");
    expect(doc).toContain("feedback forms");
    expect(doc).toContain("Phase 3");
    expect(doc).toContain("Stripe live checkout only after approval");
  });
});
