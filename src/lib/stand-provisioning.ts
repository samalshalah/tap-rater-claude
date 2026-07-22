import type { MigratedProduct } from "@/data/migrated-products";
import { createCustomerStandWithClient, type CustomerStandsDbClient } from "@/lib/customer-stands";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import type { OrderLineItem } from "@/lib/orders";
import { getStorefrontProductBySlug } from "@/lib/product-repository";
import { getProductStandConfiguration, type CustomerStand } from "@/lib/stand-domain";

export type StandProvisioningResult =
  | { ok: true; stands: CustomerStand[]; skipped: false }
  | { ok: true; stands: []; skipped: true; reason: "product_does_not_require_setup" }
  | { ok: false; error: string };

export async function createCustomerStandForOrderItem(
  orderItem: OrderLineItem,
  userId: string,
  businessId: string,
  options: { orderId?: string } = {}
): Promise<StandProvisioningResult> {
  if (!hasSupabaseAdminConfig()) return { ok: false, error: "Database persistence is not configured." };

  const product = await getStorefrontProductBySlug(orderItem.productId);
  if (!product) return { ok: false, error: `Product ${orderItem.productId} was not found.` };

  try {
    return await createCustomerStandForOrderItemWithClient(
      getSupabaseAdmin() as CustomerStandsDbClient,
      orderItem,
      userId,
      businessId,
      product,
      options
    );
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Customer Stand provisioning failed." };
  }
}

export async function createCustomerStandForOrderItemWithClient(
  client: CustomerStandsDbClient,
  orderItem: OrderLineItem,
  userId: string,
  businessId: string,
  product: MigratedProduct,
  options: { orderId?: string } = {}
): Promise<StandProvisioningResult> {
  const configuration = getProductStandConfiguration(product);
  if (!configuration.requiresCustomerSetup) {
    return { ok: true, stands: [], skipped: true, reason: "product_does_not_require_setup" };
  }

  const quantity = Math.max(1, Math.min(orderItem.quantity, 99));
  const stands: CustomerStand[] = [];
  for (let unit = 0; unit < quantity; unit += 1) {
    stands.push(
      await createCustomerStandWithClient(client, {
        ownerUserId: userId,
        businessId,
        product,
        initialDestinationUrl: orderItem.destinationUrl,
        orderItemKey: options.orderId ? `${options.orderId}:${orderItem.productId}:${unit + 1}` : undefined
      })
    );
  }

  return { ok: true, stands, skipped: false };
}
