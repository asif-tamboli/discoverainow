# Discover AI Now — Version 1

A polished, responsive starter site for **DiscoverAINow.com**.

## What works now

- Modern responsive homepage
- Global search
- Category filters
- Trending content cards
- Original ready-to-copy AI prompts
- AI tools category section
- AI agent patterns
- Workflow section
- AI news layout
- Dark mode
- Newsletter signup UI
- Mobile layout
- No build system required for this starter

## Preview locally

Open `index.html` in a browser.

For a simple local web server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Important: turning this into the real live product

This first version intentionally does **not** scrape or republish "all content on the internet." That would create copyright, terms-of-service, quality, spam and duplicate-content problems.

The production architecture should use approved sources and store normalized metadata:

1. **News ingestion**
   - Official company RSS/blog feeds
   - Publisher RSS feeds where reuse is allowed
   - News APIs with appropriate licenses
   - Store title, source, URL, published date, short summary and tags
   - Prefer linking to the original article instead of copying full text

2. **Prompt ingestion / discovery**
   - User-submitted prompts
   - Original prompts created for Discover AI Now
   - Public sources where reuse terms allow it
   - For third-party prompt inspiration, store source attribution and avoid copying protected collections wholesale
   - Deduplicate semantically similar prompts

3. **Tools / agents directory**
   - Product name, category, official URL, pricing model, description, supported use cases, last verified date
   - Allow vendors to submit/update listings later

4. **Trend scoring**
   Suggested score inputs:
   - freshness
   - page views
   - saves/copies
   - source velocity
   - social/search interest
   - editorial quality

5. **Recommended production stack**
   - Next.js App Router
   - TypeScript + Tailwind CSS
   - Supabase/PostgreSQL for data and auth
   - Vercel for deployment
   - Cloudflare for your domain/DNS
   - Scheduled jobs for feed refresh

## Suggested database tables

- `content_items`
  - id
  - type (`prompt`, `tool`, `agent`, `workflow`, `tutorial`, `news`)
  - title
  - slug
  - summary
  - body
  - source_name
  - source_url
  - published_at
  - verified_at
  - status
  - trend_score

- `tags`
- `content_tags`
- `sources`
- `users`
- `favorites`
- `prompt_copies`
- `newsletter_subscribers`
- `submissions`

## Next milestone

Convert this static prototype into the production Next.js/Supabase application and connect DiscoverAINow.com after deployment.
