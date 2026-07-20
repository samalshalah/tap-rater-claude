import { SetPasswordForm } from "@/components/account/set-password-form";

export const metadata = {
  title: "Set Your Password | Tap Rater",
  description: "Set a password for your Tap Rater customer account."
};

type PageProps = {
  searchParams?: Promise<{ token?: string }>;
};

export default async function SetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";

  return (
    <main className="min-h-screen bg-soft">
      <section className="mx-auto grid max-w-lg gap-6 px-4 py-16">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">Customer account</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Set your password</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Choose a password for faster login next time. You can still use an email link instead whenever you'd rather.
          </p>
        </div>
        <SetPasswordForm token={token} />
      </section>
    </main>
  );
}
