import { describe, expect, it, vi } from "vitest";
import {
  getLandingPageBySlugFromClient,
  getLandingPageByIdFromClient,
  getDemoLandingPage,
  logLandingPageClickWithClient,
  saveLandingPageSubmissionWithClient,
  type LandingPageDbClient
} from "@/lib/landing-pages";

describe("landing pages", () => {
  it("returns demo landing page fallback", () => {
    const page = getDemoLandingPage();

    expect(page.slug).toBe("demo");
    expect(page.templateType).toBe("multi_platform_review");
    expect(page.buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("normalizes Supabase landing page rows", async () => {
    const db = createLandingPageDb({
      landing_pages: [
        {
          id: "page-1",
          business_id: "business-1",
          slug: "local-shop",
          template_type: "feedback_form",
          title: "Local Shop Feedback",
          headline: "How was your visit?",
          description: "Tell us about your experience.",
          logo_url: "https://example.com/logo.png",
          buttons_json: [{ label: "Google", url: "https://example.com/google", platform: "google" }],
          form_config_json: { fields: ["name", "email", "message"] },
          status: "published"
        }
      ]
    });

    const page = await getLandingPageBySlugFromClient(db.client, "local-shop");

    expect(page).toMatchObject({
      id: "page-1",
      businessId: "business-1",
      slug: "local-shop",
      templateType: "feedback_form",
      title: "Local Shop Feedback"
    });
    expect(page?.buttons[0]).toMatchObject({ label: "Google", url: "https://example.com/google", platform: "google" });
    expect(page?.formConfig.fields).toEqual(["name", "email", "message"]);
  });

  it("resolves a landing page by id, so a device's landingPageId can redirect to /l/{slug}", async () => {
    const db = createLandingPageDb({
      landing_pages: [
        {
          id: "page-42",
          slug: "acme-reviews",
          template_type: "multi_platform_review",
          title: "Acme Reviews",
          headline: "Leave us a review",
          description: "Choose a platform.",
          buttons_json: [{ label: "Google", url: "https://example.com/google" }],
          form_config_json: {},
          status: "published"
        }
      ]
    });

    const page = await getLandingPageByIdFromClient(db.client, "page-42");

    expect(page?.slug).toBe("acme-reviews");
    expect(page?.id).toBe("page-42");
  });

  it("saves landing page form submissions", async () => {
    const db = createLandingPageDb();

    await saveLandingPageSubmissionWithClient(db.client, {
      landingPageId: "page-1",
      businessId: "business-1",
      name: "Customer",
      email: "customer@example.com",
      phone: "555-0100",
      message: "Great service",
      payload: { referralName: "Friend" }
    });

    expect(db.inserted.form_submissions[0]).toMatchObject({
      landing_page_id: "page-1",
      business_id: "business-1",
      name: "Customer",
      email: "customer@example.com",
      phone: "555-0100",
      message: "Great service",
      payload_json: { referralName: "Friend" }
    });
  });

  it("logs landing page button clicks", async () => {
    const db = createLandingPageDb();

    await logLandingPageClickWithClient(db.client, {
      landingPageId: "page-1",
      businessId: "business-1",
      destinationType: "google_review",
      referrer: "https://taprater.com/l/demo"
    });

    expect(db.inserted.tap_events[0]).toMatchObject({
      business_id: "business-1",
      event_type: "button_click",
      destination_type: "google_review",
      referrer: "https://taprater.com/l/demo"
    });
  });
});

type TableName = "landing_pages" | "form_submissions" | "tap_events";

function createLandingPageDb(seed?: { landing_pages?: Array<Record<string, unknown>> }) {
  const rows: Record<TableName, Array<Record<string, unknown>>> = {
    landing_pages: seed?.landing_pages ? [...seed.landing_pages] : [],
    form_submissions: [],
    tap_events: []
  };
  const inserted: Record<TableName, Array<Record<string, unknown>>> = {
    landing_pages: [],
    form_submissions: [],
    tap_events: []
  };

  const client = {
    from(table: TableName) {
      let filters: Array<{ column: string; value: unknown }> = [];
      const matchRows = () => rows[table].filter((row) => filters.every((filter) => row[filter.column] === filter.value));

      const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn((column: string, value: unknown) => {
          filters.push({ column, value });
          return builder;
        }),
        maybeSingle: vi.fn(async () => ({ data: matchRows()[0] ?? null, error: null })),
        insert: vi.fn((value: Record<string, unknown>) => {
          inserted[table].push(value);
          rows[table].push(value);
          return Promise.resolve({ error: null });
        })
      };

      return builder;
    }
  };

  return { client: client as unknown as LandingPageDbClient, inserted };
}
