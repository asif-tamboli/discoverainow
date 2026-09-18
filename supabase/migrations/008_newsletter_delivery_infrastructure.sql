create extension if not exists pgcrypto;

alter table newsletter_subscribers
  add column if not exists unsubscribe_token uuid default gen_random_uuid(),
  add column if not exists welcome_sent_at timestamptz,
  add column if not exists last_email_sent_at timestamptz;

create unique index if not exists newsletter_subscribers_unsubscribe_token_idx
  on newsletter_subscribers(unsubscribe_token);

create table if not exists newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preheader text,
  html_body text not null,
  text_body text,
  status text not null default 'draft' check (status in ('draft','ready','sending','sent','failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid references newsletter_subscribers(id) on delete cascade,
  provider_message_id text,
  status text not null default 'queued' check (status in ('queued','sent','failed','skipped')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(campaign_id, subscriber_id)
);

alter table newsletter_campaigns enable row level security;
alter table newsletter_sends enable row level security;

revoke all on newsletter_campaigns from anon, authenticated;
revoke all on newsletter_sends from anon, authenticated;
