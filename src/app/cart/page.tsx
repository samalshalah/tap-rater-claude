import { CartTable } from "@/components/cart/cart-table";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 sm:py-20">
      <h1 className="text-[28px] font-semibold tracking-tightest text-ink">Cart</h1>
      <div className="mt-8">
        <CartTable />
      </div>
    </section>
  );
}
