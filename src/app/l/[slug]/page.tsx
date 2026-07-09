import Link from "next/link";
import { LandingPageRenderer } from "@/components/landing-pages/landing-page-renderer";
import { getLandingPageBySlug, isLandingPageRepositoryConfigured } from "@/lib/landing-pages";

type LandingPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicLandingPage({ params }: LandingPageRouteProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return <LandingPageNotFound slug={slug} isConfigured={isLandingPageRepositoryConfigured()} />;
  }

  return <LandingPageRenderer page={page} />;
}

function LandingPageNotFound({ slug, isConfigured }: { slug: string; isConfigured: boolean }) {
  return (
    <main className="min-h-[70vh] bg-soft px-4 py-16">
      <section className="mx-auto max-w-2xl rounded-md border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase text-brand">Hosted page</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Landing page not found</h1>
        <p className="mt-4 leading-7 text-muted">
          {isConfigured
            ? `We could not find a published Tap Rater landing page for ${slug}.`
            : "Landing page storage is not connected in this environment. Try the local demo page at /l/demo."}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/l/demo" className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
            Open demo page
          </Link>
          <Link href="/contact-us" className="rounded-md border border-line px-5 py-3 text-sm font-bold text-ink">
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
