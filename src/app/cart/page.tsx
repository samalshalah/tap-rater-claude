import { CartTable } from "@/components/cart/cart-table";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Cart</h1>
      <div className="mt-8">
        <CartTable />
      </div>
    </section>
  );
}
