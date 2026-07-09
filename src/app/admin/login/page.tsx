import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-3xl font-black text-ink">Tap Rater admin login</h1>
      <div className="mt-8 rounded-md border border-line bg-white p-5 shadow-sm">
        <LoginForm />
      </div>
    </section>
  );
}
