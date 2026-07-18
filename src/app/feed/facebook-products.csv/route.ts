import { buildMetaProductFeedCsv } from "@/lib/meta-feed";

// Meta Commerce Manager pulls this URL on a schedule (Data Sources -> Add
// Items -> Data Feed -> Scheduled Fetch). No manual re-upload needed once
// it's pointed here -- every deploy and every product/price/stock change is
// reflected automatically.
export async function GET() {
  const csv = buildMetaProductFeedCsv();

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
