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
  if (product.requiresLandingPage || product.serviceMode === "hosted_landing_page") {
    const badges = new Set<string>();
    if (product.requiresAccount) {
      badges.add("Account required");
    }
    badges.add("Hosted landing page required");
    if (product.requiresSubscription) {
      badges.add("Subscription required");
    }
    return Array.from(badges);
  }

  const badges = new Set<string>();
  badges.add("No monthly fee required");
  if (product.requiresAccount) {
    badges.add("Account required");
  }

  if (product.serviceMode === "managed_redirect") {
    badges.add("Managed setup included");
  } else {
    badges.add("Free basic activation");
  }

  return Array.from(badges);
}

export function getProductActivationCopy(product: MigratedProduct): ProductActivationCopy {
  if (product.requiresLandingPage || product.serviceMode === "hosted_landing_page") {
    return {
      title: "Hosted platform experience",
      body:
        "This product uses a hosted Tap Rater landing page for forms, multiple buttons, or platform-powered customer flows. Account setup is required. Subscription is required only where listed, while basic direct-link products remain available without a monthly fee."
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
      "This one-time product redirects directly to your review, booking, social, menu, feedback, or business link after basic activation. No monthly fee is required, and premium features are optional later."
  };
}

export function getProductPageHighlights(product: MigratedProduct): ProductPageContentItem[] {
  const destination = getReviewDestination(product);
  const format = product.format;

  return [
    {
      title: "Tap or scan ready",
      body: `Customers tap or scan and open your ${destination} destination without searching.`
    },
    {
      title: product.requiresLandingPage ? "Hosted landing page" : "Connects to one destination URL",
      body: product.requiresLandingPage
        ? "Use a hosted Tap Rater page for feedback forms, multiple buttons, or future analytics."
        : "Use your business review page, recommendation page, booking page, menu, feedback form, or custom URL."
    },
    {
      title: format === "plate" ? "Low-profile physical product" : "Countertop physical product",
      body:
        format === "plate"
          ? "Built for desks, tables, reception areas, checkout counters, and compact customer touchpoints."
          : "Built for checkout counters, reception desks, host stands, pickup areas, and service desks."
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
      active: product.format === "stand"
    },
    {
      label: "Plate",
      bestFor: "Tables, desks, compact counters",
      fit: "Low-profile review prompt",
      active: product.format === "plate"
    },
    {
      label: "Bundle",
      bestFor: "Multiple rooms, counters, or teams",
      fit: "Best value for several touchpoints",
      active: product.format === "bundle" || product.productType === "bundle" || title.includes("bundle") || title.includes("kit")
    },
    {
      label: "Social/Booking",
      bestFor: "Social media, booking pages, menu links",
      fit: "Best for direct non-Google destinations",
      active: product.categorySlug === "social-media" || product.categorySlug === "appointments" || product.categorySlug === "menu"
    },
    {
      label: "Feedback/Referral",
      bestFor: "Hosted forms and platform-powered flows",
      fit: "Best when a landing page is needed",
      active: product.categorySlug === "feedback"
    },
    {
      label: "Custom",
      bestFor: "Custom UV printing and direct custom URLs",
      fit: "Best for branded prompts",
      active: product.supportedDestinations.includes("custom") && ["social-media", "appointments", "menu"].includes(product.categorySlug)
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

  if (title.includes("tripadvisor")) {
    return "TripAdvisor review";
  }

  if (title.includes("experience")) {
    return "feedback";
  }

  if (title.includes("social")) {
    return "social media";
  }

  if (title.includes("book")) {
    return "booking";
  }

  if (title.includes("menu")) {
    return "menu";
  }

  return "Google review";
}
