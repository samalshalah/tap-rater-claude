import type { ChangeLinkFormInput, ContactFormInput, SetupFormInput } from "@/lib/validators";

type InsertResult = PromiseLike<{ error: null | { message: string } }>;

export type RequestDbClient = {
  from: (table: string) => {
    insert: (values: Record<string, string>) => InsertResult;
  };
};

async function insertRequest(client: RequestDbClient, table: string, values: Record<string, string>) {
  const { error } = await client.from(table).insert(values);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveContactRequest(client: RequestDbClient, input: ContactFormInput) {
  await insertRequest(client, "contact_requests", {
    name: input.name,
    email: input.email,
    message: input.message
  });
}

export async function saveSetupRequest(client: RequestDbClient, input: SetupFormInput) {
  await insertRequest(client, "setup_requests", {
    name: input.name,
    email: input.email,
    business_name: input.businessName,
    review_url: input.reviewUrl,
    notes: input.notes
  });
}

export async function saveChangeLinkRequest(client: RequestDbClient, input: ChangeLinkFormInput) {
  await insertRequest(client, "change_link_requests", {
    name: input.name,
    email: input.email,
    taprater_id: input.tapraterId,
    new_review_url: input.newReviewUrl,
    notes: input.notes
  });
}
