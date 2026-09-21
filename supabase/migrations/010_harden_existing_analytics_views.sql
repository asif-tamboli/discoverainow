alter view if exists public.internal_audience_intelligence
set (security_invoker = true);

alter view if exists public.internal_intent_funnel
set (security_invoker = true);

revoke all on public.internal_audience_intelligence from public, anon, authenticated;
revoke all on public.internal_intent_funnel from public, anon, authenticated;

create index if not exists idx_newsletter_sends_subscriber_id
on public.newsletter_sends(subscriber_id);
