import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAssignedCustomerStand, getAdminCustomerStands, isCustomerStandStoreConfigured } from "@/lib/customer-stands";
import { getStorefrontProductBySlug } from "@/lib/product-repository";
import { getProductStandConfiguration } from "@/lib/stand-domain";
import { adminCustomerStandCreateSchema } from "@/lib/validators";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ configured: isCustomerStandStoreConfigured(), stands: await getAdminCustomerStands() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = adminCustomerStandCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the customer, business, product, and destination." }, { status: 400 });
  if (!isCustomerStandStoreConfigured()) return NextResponse.json({ error: "Database persistence is not configured." }, { status: 503 });

  const product = await getStorefrontProductBySlug(parsed.data.productSlug);
  if (!product || !getProductStandConfiguration(product).requiresCustomerSetup) {
    return NextResponse.json({ error: "That product cannot create a Customer Stand." }, { status: 422 });
  }

  try {
    const stand = await createAssignedCustomerStand({
      customerEmail: parsed.data.customerEmail,
      businessName: parsed.data.businessName,
      product,
      initialDestinationUrl: parsed.data.initialDestinationUrl || undefined
    });
    return NextResponse.json({ stand }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Customer Stand could not be created." }, { status: 422 });
  }
}
