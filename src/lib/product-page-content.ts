import type { MigratedProduct } from "@/data/migrated-products";

export type ProductPageContentItem = {
  title: string;
  body: string;
};

export type ProductComparisonRow = {
  label: "Stand" | "Plate" | "Bundle" | "Social/Booking" | "Feedback/Referral" | "Custom";
  bestFor: string;
  fit: string;
  active: boolean;
};

export type ProductActivationCopy = {
  title: string;
  body: string;
};

export function getProductServiceBadges(product: MigratedProduct): string[] {
  if (product.serviceMode === "premium_landing_page") {
    return ["Premium landing page", "Subscription required for hosted features"];
  }

  const badges = new Set<string>();
  badges.add("No monthly fee required");

  if (product.serviceMode === "managed_redirect") {
    badges.add("Managed setup included");
  } else {
    badges.add("Free basic activation");
  }

  return Array.from(badges);
}

export function getProductActivationCopy(product: MigratedProduct): ProductActivationCopy {
  if (product.requiresLandingPage || product.serviceMode === "premium_landing_page") {
    return {
      title: "Hosted platform experience",
      body:
        "This product uses a hosted Tap Rater landing page for forms, multiple buttons, or platform-powered customer flows. Subscription is required for hosted features, while basic direct-link products remain available without a monthly fee."
    };
  }

  if (product.serviceMode === "managed_redirect") {
    return {
      title: "Managed direct redirect",
      body:
        "This one-time product redirects directly to the destination you choose after Tap Rater setup. No monthly fee is required for the basic redirect, and premium dashboard features are optional later."
    };
  }

  return {
    title: "Free basic activation",
    body:
      "This one-time product redirects directly to your review, booking, social, or business link after basic activation. No monthly fee is required, and premium features are optional later."
  };
}

export function getProductPageHighlights(product: MigratedProduct): ProductPageContentItem[] {
  const destination = getReviewDestination(product);

  return [
    {
      title: "Tap-to-review flow",
      body: `Customers tap or scan and open your ${destination} destination without searching.`
    },
    {
      title: product.requiresLandingPage ? "Hosted landing page" : "Configured for your link",
      body: product.requiresLandingPage
        ? "Use a hosted Tap Rater page for feedback forms, multiple buttons, or future analytics."
        : "Use your business review page, recommendation page, booking page, survey, or custom feedback URL."
    },
    {
      title: "Counter-ready display",
      body: "Built for checkout counters, reception desks, tables, pickup areas, and service desks."
    },
    {
      title: "Simple customer prompt",
      body: "A clear physical prompt helps staff invite customers to share their experience at the right moment."
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
      body: "Offer the tap or scan prompt after a completed appointment while the visit is still fresh."
    },
    {
      title: "Retail stores",
      body: "Use it beside checkout or customer service where buyers already pause."
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
      label: "Social/Booking",
      bestFor: "Facebook, Yelp, booking pages, social profiles",
      fit: "Best for direct non-Google destinations",
      active: product.categorySlug === "social-booking-stands"
    },
    {
      label: "Feedback/Referral",
      bestFor: "Hosted forms and platform-powered flows",
      fit: "Best when a landing page is needed",
      active: product.categorySlug === "feedback-referral-stands"
    },
    {
      label: "Custom",
      bestFor: "Custom UV printing and direct custom URLs",
      fit: "Best for branded prompts",
      active: product.categorySlug === "custom-uv-printed-stands"
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
