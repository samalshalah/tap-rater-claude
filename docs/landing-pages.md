# Tap Rater Landing Pages

Hosted landing pages are for premium and future platform products only. Standard one-time products can continue using direct redirect destinations.

Public pages render at:

```text
/l/{slug}
```

The local fallback demo renders at:

```text
/l/demo
```

## Supported Templates

- `multi_platform_review`
- `feedback_form`
- `referral_form`
- `appointment_booking`
- `social_links`
- `digital_business_card`

The older schema value `business_card` is treated as `digital_business_card` by the app for backward compatibility.

## Required Table Data

Rows are read from `landing_pages`:

- `template_type`
- `slug`
- `title`
- `headline`
- `description`
- `logo_url`
- `buttons_json`
- `form_config_json`
- `status`

Use `status = published` for live pages.

## `buttons_json`

```json
[
  {
    "label": "Review us on Google",
    "url": "https://search.google.com/local/writereview?placeid=PLACE_ID",
    "platform": "Google",
    "destinationType": "google_review"
  },
  {
    "label": "Book an appointment",
    "url": "https://example.com/book",
    "platform": "Booking",
    "destinationType": "booking"
  }
]
```

Allowed `destinationType` values should match the platform destination types:

- `google_review`
- `facebook_review`
- `yelp_profile`
- `booking`
- `social`
- `menu`
- `wifi`
- `custom`
- `landing_page`

## `form_config_json`

```json
{
  "fields": ["name", "email", "phone", "message"],
  "submitLabel": "Send feedback",
  "successMessage": "Thanks. Your feedback was sent."
}
```

Common fields:

- `name`
- `email`
- `phone`
- `message`
- `referralName`
- `referralEmail`

## Submission And Event Storage

Form submissions post to:

```text
POST /api/landing-pages/{slug}/submit
```

Submissions are stored in `form_submissions`.

Button clicks post to:

```text
POST /api/landing-pages/{slug}/click
```

Clicks are stored as `button_click` rows in `tap_events`. Missing Supabase configuration does not block the demo page, but submissions cannot be stored until Supabase is configured.
