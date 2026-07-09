import { describe, expect, it, vi } from "vitest";
import {
  saveChangeLinkRequest,
  saveContactRequest,
  saveSetupRequest,
  type RequestDbClient
} from "@/lib/request-repository";

function createDbClient() {
  const insert = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn(() => ({ insert }));
  return { client: { from } as unknown as RequestDbClient, from, insert };
}

describe("request repository", () => {
  it("stores contact requests in contact_requests", async () => {
    const db = createDbClient();

    await saveContactRequest(db.client, {
      name: "Customer",
      email: "customer@example.com",
      message: "Please help with my Tap Rater setup."
    });

    expect(db.from).toHaveBeenCalledWith("contact_requests");
    expect(db.insert).toHaveBeenCalledWith({
      name: "Customer",
      email: "customer@example.com",
      message: "Please help with my Tap Rater setup."
    });
  });

  it("maps setup requests to database column names", async () => {
    const db = createDbClient();

    await saveSetupRequest(db.client, {
      name: "Customer",
      email: "customer@example.com",
      businessName: "Local Shop",
      reviewUrl: "https://example.com/review",
      notes: ""
    });

    expect(db.from).toHaveBeenCalledWith("setup_requests");
    expect(db.insert).toHaveBeenCalledWith({
      name: "Customer",
      email: "customer@example.com",
      business_name: "Local Shop",
      review_url: "https://example.com/review",
      notes: ""
    });
  });

  it("maps change-link requests to database column names", async () => {
    const db = createDbClient();

    await saveChangeLinkRequest(db.client, {
      name: "Customer",
      email: "customer@example.com",
      tapraterId: "TRATER01-W",
      newReviewUrl: "https://example.com/new-review",
      notes: "Use this new link."
    });

    expect(db.from).toHaveBeenCalledWith("change_link_requests");
    expect(db.insert).toHaveBeenCalledWith({
      name: "Customer",
      email: "customer@example.com",
      taprater_id: "TRATER01-W",
      new_review_url: "https://example.com/new-review",
      notes: "Use this new link."
    });
  });
});
