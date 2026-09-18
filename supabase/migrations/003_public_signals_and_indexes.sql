create or replace view public_signals
with (security_invoker = true)
as
select
  e.id,
  s.name as source_name,
  e.external_id,
  e.title,
  e.url,
  e.summary,
  e.published_at,
  e.relevance_score,
  e.raw,
  e.status
from external_signals e
join sources s on s.id=e.source_id
where s.enabled=true and e.status in ('new','reviewed','published');

grant select on public_signals to anon, authenticated;

create index if not exists idx_tool_tests_tool_id on tool_tests(tool_id);
create index if not exists idx_benchmark_runs_benchmark_id on benchmark_runs(benchmark_id);
create index if not exists idx_benchmark_runs_tool_id on benchmark_runs(tool_id);
create index if not exists idx_affiliate_links_tool_id on affiliate_links(tool_id);
create index if not exists idx_external_signals_source_published on external_signals(source_id, published_at desc);
create index if not exists idx_events_created_at on events(created_at desc);
create unique index if not exists idx_sources_name_unique on sources(name);
