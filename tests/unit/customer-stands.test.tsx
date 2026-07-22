import { describe, expect, it } from "vitest";
import { allProducts } from "@/data/catalog";
import {
  getOwnedCustomerStandFromClient,
  saveOwnedStandSetupWithClient,
  type CustomerStandsDbClient
} from "@/lib/customer-stands";
import {
  generateStandShortCode,
  getProductStandConfiguration,
  resolvePublicStand,
  type CustomerStand
} from "@/lib/stand-domain";

describe("Customer Stands", () => {
  it("generates short, readable, collision-resistant public codes", () => {
    const codes = new Set(Array.from({ length: 1_000 }, () => generateStandShortCode()));

    expect(codes.size).toBe(1_000);
    for (const code of codes) expect(code).toMatch(/^[a-z2-9]{10}$/);
  });

  it("maps catalog products to customer setup requirements without duplicating products", () => {
    const google = allProducts.find((product) => product.slug === "google-review-stand")!;
    const hosted = allProducts.find((product) => product.slug === "hosted-landing-page-subscription")!;
    const menu = allProducts.find((product) => product.slug === "view-our-menu-stand")!;

    expect(getProductStandConfiguration(google)).toMatchObject({
      requiresCustomerSetup: true,
      defaultStandMode: "redirect",
      standCategory: "review-stands",
      requiredLinkTypes: ["review"]
    });
    expect(getProductStandConfiguration(hosted)).toMatchObject({
      requiresCustomerSetup: true,
      defaultStandMode: "hosted_page",
      standCategory: "hosted-tap-page-stands"
    });
    expect(getProductStandConfiguration(menu)).toMatchObject({ standCategory: "menu-info-stands", requiredLinkTypes: ["menu"] });
  });

  it("does not let one customer load another customer's stand", async () => {
    const db = createStandDb({
      customers: [
        { id: "customer-1", email: "owner@example.com" },
        { id: "customer-2", email: "other@example.com" }
      ],
      businesses: [{ id: "business-2", customer_id: "customer-2", business_name: "Other Business" }],
      devices: [standRow({ customer_id: "customer-2", business_id: "business-2" })]
    });

    expect(await getOwnedCustomerStandFromClient(db.client, "owner@example.com", "abc234xyz5")).toBeNull();
    expect(await getOwnedCustomerStandFromClient(db.client, "other@example.com", "abc234xyz5")).toMatchObject({ publicSlug: "abc234xyz5" });
  });

  it("redirects to the first active safe destination by sort order", () => {
    const stand = customerStand({
      mode: "redirect",
      destinationLinks: [
        { label: "Second", type: "website", url: "https://example.com/second", sortOrder: 2, isActive: true },
        { label: "Unsafe", type: "website", url: "javascript:alert(1)", sortOrder: 0, isActive: true },
        { label: "First", type: "website", url: "https://example.com/first", sortOrder: 1, isActive: true }
      ]
    });

    expect(resolvePublicStand(stand)).toEqual({ type: "redirect", destinationUrl: "https://example.com/first" });
  });

  it("prepares hosted-page rendering with active safe links only", () => {
    const stand = customerStand({
      mode: "hosted_page",
      destinationLinks: [
        { label: "Google", type: "review", provider: "google", url: "https://example.com/review", sortOrder: 0, isActive: true },
        { label: "Hidden", type: "custom", url: "https://example.com/hidden", sortOrder: 1, isActive: false }
      ],
      hostedPageConfig: { pageTitle: "Local Shop", pageSubtitle: "Choose a destination", primaryColor: "#0a6c64" }
    });
    const action = resolvePublicStand(stand);
    expect(action.type).toBe("hosted_page");
    if (action.type !== "hosted_page") return;

    expect(action.links).toEqual([
      expect.objectContaining({ label: "Google", url: "https://example.com/review", isActive: true })
    ]);
    expect(stand.hostedPageConfig).toMatchObject({ pageTitle: "Local Shop", pageSubtitle: "Choose a destination" });
  });

  it("moves setup_required to ready_for_print only when required links are valid", async () => {
    const db = createStandDb({
      customers: [{ id: "customer-1", email: "owner@example.com" }],
      businesses: [{ id: "business-1", customer_id: "customer-1", business_name: "Local Shop" }],
      devices: [standRow()]
    });

    const invalid = await saveOwnedStandSetupWithClient(db.client, "owner@example.com", "abc234xyz5", {
      links: [],
      completeSetup: true
    });
    expect(invalid).toMatchObject({ ok: false });

    const valid = await saveOwnedStandSetupWithClient(db.client, "owner@example.com", "abc234xyz5", {
      links: [{ label: "Review us", type: "review", provider: "google", url: "https://example.com/review", isActive: true }],
      completeSetup: true
    });
    expect(valid).toEqual({ ok: true, status: "ready_for_print", printStatus: "ready" });
    expect(db.rows.devices[0]).toMatchObject({
      public_slug: "abc234xyz5",
      permanent_url_path: "/t/abc234xyz5",
      stand_status: "ready_for_print",
      print_status: "ready"
    });
  });
});

type TableName = "customers" | "businesses" | "devices" | "stand_destination_links" | "hosted_tap_page_configs" | "tap_events";

function createStandDb(seed: Partial<Record<TableName, Array<Record<string, unknown>>>>) {
  const rows: Record<TableName, Array<Record<string, unknown>>> = {
    customers: [...(seed.customers ?? [])],
    businesses: [...(seed.businesses ?? [])],
    devices: [...(seed.devices ?? [])],
    stand_destination_links: [...(seed.stand_destination_links ?? [])],
    hosted_tap_page_configs: [...(seed.hosted_tap_page_configs ?? [])],
    tap_events: [...(seed.tap_events ?? [])]
  };
  let generatedId = 1;

  const client = {
    from(table: TableName) {
      let filters: Array<{ column: string; value: unknown }> = [];
      let action: "select" | "insert" | "update" = "select";
      let values: Record<string, unknown> | Array<Record<string, unknown>> | undefined;

      const matches = () => rows[table].filter((row) => filters.every((filter) => row[filter.column] === filter.value));
      const execute = async () => {
        if (action === "insert") {
          const inserted = (Array.isArray(values) ? values : [values ?? {}]).map((value) => ({ id: `generated-${generatedId++}`, ...value }));
          rows[table].push(...inserted);
          return { data: inserted, error: null };
        }
        if (action === "update") {
          const updated = matches();
          for (const row of updated) Object.assign(row, values);
          return { data: updated, error: null };
        }
        return { data: matches(), error: null };
      };

      const builder = {
        select: () => builder,
        insert: (input: Record<string, unknown> | Array<Record<string, unknown>>) => {
          action = "insert";
          values = input;
          return builder;
        },
        update: (input: Record<string, unknown>) => {
          action = "update";
          values = input;
          return builder;
        },
        upsert: (input: Record<string, unknown>) => {
          const existing = rows[table].find((row) => row.customer_stand_id === input.customer_stand_id);
          action = existing ? "update" : "insert";
          values = input;
          if (existing) filters = [{ column: "customer_stand_id", value: input.customer_stand_id }];
          return builder;
        },
        eq: (column: string, value: unknown) => {
          filters.push({ column, value });
          return builder;
        },
        order: () => builder,
        maybeSingle: async () => {
          const result = await execute();
          return { data: result.data[0] ?? null, error: result.error };
        },
        then(resolve: (value: { data: Array<Record<string, unknown>>; error: null }) => void) {
          execute().then(resolve);
        }
      };
      return builder;
    }
  };

  return { client: client as unknown as CustomerStandsDbClient, rows };
}

function standRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "device-internal-id",
    device_code: "TR-ABC234XYZ5",
    customer_id: "customer-1",
    business_id: "business-1",
    product_slug: "google-review-stand",
    product_name: "Google Review Stand",
    stand_category: "review-stands",
    public_slug: "abc234xyz5",
    permanent_url_path: "/t/abc234xyz5",
    stand_mode: "redirect",
    stand_status: "setup_required",
    print_status: "not_ready",
    required_link_types: ["review"],
    supported_providers: ["google"],
    ...overrides
  };
}

function customerStand(overrides: Partial<CustomerStand> = {}): CustomerStand {
  return {
    id: "device-internal-id",
    businessId: "business-1",
    ownerUserId: "customer-1",
    productSlug: "google-review-stand",
    productName: "Google Review Stand",
    standCategory: "review-stands",
    publicSlug: "abc234xyz5",
    permanentUrlPath: "/t/abc234xyz5",
    mode: "redirect",
    status: "active",
    printStatus: "ready",
    nfcProgrammed: false,
    qrGenerated: true,
    requiredLinkTypes: ["review"],
    supportedProviders: ["google"],
    destinationLinks: [],
    business: { id: "business-1", businessName: "Local Shop" },
    tapCount: 0,
    ...overrides
  };
}
