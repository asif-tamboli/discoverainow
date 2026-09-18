-- DiscoverAINow production schema (Supabase/Postgres)
create extension if not exists pgcrypto;

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  website_url text,
  summary text,
  category text,
  pricing_model text,
  pricing_notes text,
  affiliate_url text,
  featured boolean default false,
  sponsored boolean default false,
  sponsor_name text,
  verified_at timestamptz,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tool_tests (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade,
  title text not null,
  test_date date,
  methodology_version text,
  task_definition text,
  prompt_used text,
  result_summary text,
  raw_output_url text,
  correctness_score numeric,
  coverage_score numeric,
  risk_priority_score numeric,
  hallucination_score numeric,
  cleanup_score numeric,
  overall_score numeric,
  notes text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists benchmarks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  methodology_version text not null,
  description text,
  scoring_rubric jsonb not null default '{}'::jsonb,
  status text default 'methodology',
  published_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists benchmark_runs (
  id uuid primary key default gen_random_uuid(),
  benchmark_id uuid references benchmarks(id) on delete cascade,
  tool_id uuid references tools(id) on delete set null,
  model_name text,
  model_version text,
  run_date timestamptz default now(),
  input_payload jsonb,
  output_payload jsonb,
  score_breakdown jsonb,
  overall_score numeric,
  reviewer_notes text,
  published boolean default false
);

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  prompt_text text not null,
  use_case text,
  variables jsonb default '[]'::jsonb,
  verification_notes text,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  summary text,
  steps jsonb not null default '[]'::jsonb,
  human_checkpoints jsonb default '[]'::jsonb,
  monetization_notes text,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content_type text not null,
  title text not null,
  dek text,
  body_md text,
  primary_keyword text,
  commercial_intent text,
  status text default 'draft',
  published_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  base_url text,
  api_url text,
  attribution_required boolean default false,
  commercial_use_notes text,
  enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists external_signals (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete cascade,
  external_id text,
  title text not null,
  url text,
  summary text,
  published_at timestamptz,
  raw jsonb,
  relevance_score numeric,
  status text default 'new',
  unique(source_id, external_id)
);

create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade,
  provider text,
  destination_url text not null,
  affiliate_url text not null,
  disclosure_text text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists sponsorships (
  id uuid primary key default gen_random_uuid(),
  sponsor_name text not null,
  placement text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  amount numeric,
  disclosure_text text not null,
  active boolean default false,
  created_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  status text default 'active',
  consent_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table if not exists events (
  id bigint generated always as identity primary key,
  event_name text not null,
  path text,
  session_id text,
  anonymous_id text,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists content_metrics (
  id bigint generated always as identity primary key,
  content_type text not null,
  content_slug text not null,
  metric_date date not null default current_date,
  views integer default 0,
  outbound_clicks integer default 0,
  affiliate_clicks integer default 0,
  prompt_copies integer default 0,
  newsletter_signups integer default 0,
  unique(content_type, content_slug, metric_date)
);

insert into benchmarks (slug,title,methodology_version,description,scoring_rubric,status)
values (
  'ai-testing',
  'DiscoverAINow AI Testing Benchmark',
  'v1',
  'A reproducible benchmark for evaluating AI on real software-testing tasks.',
  '{"correctness":25,"coverage":20,"risk_prioritization":15,"automation_quality":15,"hallucination_control":15,"manual_cleanup":10}'::jsonb,
  'methodology'
)
on conflict (slug) do nothing;

-- RLS: public reads only for explicitly published content should be added when Supabase is connected.
-- Writes should occur through trusted server-side functions/service roles, not directly from anonymous browsers.
