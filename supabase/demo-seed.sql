-- Tap Rater platform demo seed.
-- Run only in local development or a non-production Supabase project.
-- Plain demo activation codes are listed here for development convenience only.
-- Do not print real activation codes in public photos, docs, or packaging.

insert into devices (
  device_code,
  activation_code_hash,
  product_type,
  service_mode,
  status,
  destination_type,
  destination_url,
  label
) values
  (
    'TR-DEMO-GOOGLE',
    '8311df97fab0c7455598743e4e8e4addffebb63bbeb630ef828ff663b335cd92',
    'google_review',
    'basic_redirect',
    'unactivated',
    'google_review',
    null,
    'Demo Google Review Device'
  ),
  (
    'TR-DEMO-SOCIAL',
    '8add24dd021249922838d30570fcf9caf49ccc0e768a83d36cd09b775d08643e',
    'social_follow',
    'managed_redirect',
    'unactivated',
    'social',
    null,
    'Demo Social Follow Device'
  ),
  (
    'TR-DEMO-FEEDBACK',
    'eed55fc7b1982bac00d518f8d240a6ec8b331571669109b38ccc8065dfbc19d8',
    'feedback_form',
    'premium_landing_page',
    'unactivated',
    'landing_page',
    null,
    'Demo Feedback Form Device'
  )
on conflict (device_code) do nothing;

-- Development-only plain activation codes:
-- TR-DEMO-GOOGLE: GOOGLE-DEMO-2026
-- TR-DEMO-SOCIAL: SOCIAL-DEMO-2026
-- TR-DEMO-FEEDBACK: FEEDBACK-DEMO-2026
