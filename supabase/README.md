# Supabase backend

This folder is the database contract for the next production phase.

## Setup

1. Create/connect the DiscoverAINow Supabase project.
2. Run `schema.sql` in the SQL editor.
3. Add RLS policies before exposing any tables to anonymous clients.
4. Keep API ingestion and affiliate/sponsor writes server-side.
5. Replace local-only newsletter storage with an Edge Function that validates and inserts into `newsletter_subscribers`.
6. Replace direct browser GitHub/Hugging Face/DEV fetches with scheduled functions that populate `external_signals`.

## Security rule

Do not expose a Supabase service-role key in browser JavaScript.

## Planned scheduled ingestion

- Hacker News: 30–60 min
- Official AI RSS/product feeds: 1–3 hours
- GitHub/Hugging Face discovery: 6–12 hours
- Pricing/tool verification: daily/weekly depending on source

External signals are discovery candidates. They are not automatically editorial recommendations.
