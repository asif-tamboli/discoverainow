alter table tools add column if not exists editorial_status text default 'discovered';
alter table tools add column if not exists last_reviewed_at timestamptz;

update tools
set editorial_status='editorially_reviewed', last_reviewed_at=now()
where slug in ('cursor','github-copilot','claude-code');

create or replace view internal_daily_events as
select
  date_trunc('day', created_at)::date as event_date,
  event_name,
  path,
  count(*)::bigint as events,
  count(distinct anonymous_id)::bigint as unique_users,
  count(distinct session_id)::bigint as sessions
from events
group by 1,2,3;

create or replace view internal_search_terms as
select
  lower(nullif(properties->>'query','')) as query,
  coalesce(properties->>'category','all') as category,
  count(*)::bigint as searches,
  sum(case when event_name='search_no_result' then 1 else 0 end)::bigint as no_result_searches,
  max(created_at) as last_seen_at
from events
where event_name in ('search','search_no_result')
group by 1,2;

create or replace view internal_content_actions as
select
  path,
  event_name,
  count(*)::bigint as events,
  count(distinct anonymous_id)::bigint as unique_users,
  max(created_at) as last_seen_at
from events
where event_name in ('tool_click','outbound_click','affiliate_click','prompt_copy','workflow_open','newsletter_signup','benchmark_view','comparison_open')
group by 1,2;

revoke all on internal_daily_events from public, anon, authenticated;
revoke all on internal_search_terms from public, anon, authenticated;
revoke all on internal_content_actions from public, anon, authenticated;
