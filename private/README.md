# Private funnel dashboard

This folder is excluded from Cloudflare static assets. Never upload reports or event exports to the public website or commit them. No extra paid dependency or public analytics endpoint is introduced.

Export the `events` table as a JSON array from the Supabase dashboard, then run:

```sh
python3 private/funnel.py --input /absolute/path/events.json --days 30
```

Alternatively set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your local environment and run `python3 private/funnel.py --live`. Never put the key in a client script, command argument, committed file or shared report. Open the generated `private/funnel.html` locally. It contains aggregates only.

Before your own site checks, visit `https://discoverainow.com/?traffic=internal` once per browser. The setting persists locally. Use `?traffic=public` to undo. Suspected automated browsers are tagged heuristically. The report removes every event in sessions marked internal or suspected bot within the reporting period; unclassified historical traffic remains visible and is not asserted to be human.

Counts show independent stage reach, not an ordered funnel. Feedback is counted per submission, not unique people. Outbound clicks, affiliate clicks and newsletter events are not purchases or revenue. No approved affiliate partner exists in the current configuration.

## Affiliate activation

Only after actual partner approval, add an entry to `/affiliate-links.json` with `approved: true`, `tool` (stable key), `destination` (exact existing HTTPS vendor URL), `affiliate_url` (approved HTTPS tracking URL), and `disclosure` (visible plain-language commission disclosure). Document the approval in project records. Never invent partner links. Matching vendor links gain a nearby disclosure and sponsored relationship. Empty configuration leaves all links unchanged.
