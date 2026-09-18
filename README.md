# Discover AI Now

DiscoverAINow.com is being built as an evidence-first AI decision product, not a generic AI directory.

## Product promise

**Find AI that actually works.**

The site separates external discovery feeds from original evaluation. Public APIs can surface tools, repositories, tutorials and news, but they do not determine editorial recommendations.

## Revenue/product priorities

1. Sustainable revenue.
2. Original, useful and trustworthy content.
3. Continuous analysis of traffic, retention, conversions and AI market trends.

## What is deployable now

- Evidence-first homepage positioning
- AI Testing Benchmark methodology
- ChatGPT vs Claude vs Gemini QA comparison framework
- AI for QA practical guide
- Software tester prompt pack
- Jira-story-to-test-cases workflow
- Editorial methodology page
- Affiliate/sponsorship disclosure page
- Live discovery feeds (Hacker News, Hugging Face, GitHub, DEV) with fallbacks
- Client-side event queue ready to forward to a production analytics backend
- SEO sitemap and canonical URLs

## Important editorial rule

Do not publish benchmark scores or claims that a tool/model was tested until the experiment was actually run. Methodology and planned experiments are clearly labeled.

## Production backend

The `supabase/schema.sql` file defines the production data model for:

- tools and pricing
- tool tests
- benchmarks and benchmark runs
- prompts
- workflows
- articles/comparisons
- sources and external signals
- affiliate links
- sponsorships
- newsletter subscribers
- analytics events and content metrics

The current newsletter waitlist is intentionally local-only until Supabase (or an equivalent subscriber backend) is connected. The UI says this explicitly so it does not pretend to subscribe users when no backend exists.

## Next infrastructure steps

1. Connect Supabase and run `supabase/schema.sql`.
2. Move public API ingestion from visitor browsers into scheduled server-side jobs.
3. Forward analytics events from `analytics.js` to the database/analytics service.
4. Configure Google Search Console and analytics.
5. Connect GitHub to Cloudflare for automatic deploys.
6. Add real affiliate IDs only after programs are approved.
7. Run the first benchmark and publish raw methodology/results.

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.


## Deployment

Cloudflare Workers is connected to the `main` branch. Every new push to `main` should trigger an automatic production deployment.
