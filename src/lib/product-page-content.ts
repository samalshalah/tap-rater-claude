import type { MigratedProduct } from "@/data/migrated-products";

export type ProductPageContentItem = {
  title: string;
  body: string;
};

export type ProductComparisonRow = {
  label: "Stand" | "Plate" | "Bundle" | "Feedback";
  bestFor: string;
  fit: string;
  active: boolean;
};

export function getProductPageHighlights(product: MigratedProduct): ProductPageContentItem[] {
  const destination = getReviewDestination(product);

  return [
    {
      title: "Tap-to-review flow",
      body: `Customers tap their phone and open your ${destination} destination without searching.`
    },
    {
      title: "Configured for your link",
      body: "Use your business review page, recommendation page, survey, or custom feedback URL."
    },
    {
      title: "Counter-ready display",
      body: "Built for checkout counters, reception desks, tables, pickup areas, and service desks."
    },
    {
      title: "Simple customer prompt",
      body: "A clear physical reminder helps staff ask for reviews at the right customer moment."
    }
  ];
}

export function getProductPageUseCases(_product: MigratedProduct): ProductPageContentItem[] {
  return [
    {
      title: "Restaurants and cafes",
      body: "Place it near the register, host stand, pickup counter, or table service station."
    },
    {
      title: "Salons and clinics",
      body: "Ask after a completed appointment while the customer experience is still fresh."
    },
    {
      title: "Retail stores",
      body: "Use it beside checkout or customer service where satisfied buyers already pause."
    },
    {
      title: "Local services",
      body: "Give technicians, reception teams, and service counters a consistent review prompt."
    }
  ];
}

export function getProductComparisonRows(product: MigratedProduct): ProductComparisonRow[] {
  const title = product.title.toLowerCase();

  return [
    {
      label: "Stand",
      bestFor: "Counters, reception, checkout, pickup",
      fit: "Most visible review prompt",
      active: title.includes("stand") && !title.includes("bundle")
    },
    {
      label: "Plate",
      bestFor: "Tables, desks, compact counters",
      fit: "Low-profile review prompt",
      active: title.includes("plate")
    },
    {
      label: "Bundle",
      bestFor: "Multiple rooms, counters, or teams",
      fit: "Best value for several touchpoints",
      active: title.includes("bundle")
    },
    {
      label: "Feedback",
      bestFor: "Surveys and custom feedback flows",
      fit: "Most flexible destination",
      active: title.includes("experience") || product.categorySlug === "feedback-stands"
    }
  ];
}

export function getReviewDestination(product: MigratedProduct): string {
  const title = product.title.toLowerCase();

  if (title.includes("facebook")) {
    return "Facebook review";
  }

  if (title.includes("yelp")) {
    return "Yelp review";
  }

  if (title.includes("experience")) {
    return "feedback";
  }

  return "Google review";
}
