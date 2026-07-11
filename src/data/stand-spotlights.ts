export type StandSpotlight = {
  eyebrow: string;
  headline: string;
  subhead: string;
};

export const standSpotlights: Record<string, StandSpotlight> = {
  "google-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Google reviews.",
    subhead: "Make reviewing your business fast and contactless."
  },
  "yelp-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Yelp reviews.",
    subhead: "Help customers leave a quick review before they go."
  },
  "facebook-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Facebook reviews.",
    subhead: "Invite customers to leave a review with one quick tap."
  },
  "tripadvisor-review-stand": {
    eyebrow: "Review stand",
    headline: "Collect more TripAdvisor reviews.",
    subhead: "Encourage travelers to share their experience instantly."
  },
  "follow-us-social-media-stand": {
    eyebrow: "Social media stand",
    headline: "Grow your social following.",
    subhead: "Help guests connect with your brand instantly."
  },
  "book-your-next-visit-stand": {
    eyebrow: "Appointment stand",
    headline: "Book your appointment.",
    subhead: "A clean, contactless way to schedule your next visit."
  },
  "view-our-menu-stand": {
    eyebrow: "Menu stand",
    headline: "Tap to view our menu.",
    subhead: "Share your menu instantly with a quick tap."
  },
  "rate-your-experience-stand": {
    eyebrow: "Feedback stand",
    headline: "Rate your experience.",
    subhead: "Collect quick feedback in a simple contactless format."
  }
};

export const standSpotlightOrder = [
  "google-review-stand",
  "yelp-review-stand",
  "facebook-review-stand",
  "tripadvisor-review-stand",
  "follow-us-social-media-stand",
  "book-your-next-visit-stand",
  "view-our-menu-stand",
  "rate-your-experience-stand"
];
