alter table tools enable row level security;
alter table tool_tests enable row level security;
alter table benchmarks enable row level security;
alter table benchmark_runs enable row level security;
alter table prompts enable row level security;
alter table workflows enable row level security;
alter table articles enable row level security;
alter table sources enable row level security;
alter table external_signals enable row level security;
alter table affiliate_links enable row level security;
alter table sponsorships enable row level security;
alter table newsletter_subscribers enable row level security;
alter table events enable row level security;
alter table content_metrics enable row level security;

create policy "public read published tools" on tools for select using (status='published');
create policy "public read published tool tests" on tool_tests for select using (published=true);
create policy "public read benchmarks" on benchmarks for select using (status in ('methodology','published'));
create policy "public read published benchmark runs" on benchmark_runs for select using (published=true);
create policy "public read published prompts" on prompts for select using (status='published');
create policy "public read published workflows" on workflows for select using (status='published');
create policy "public read published articles" on articles for select using (status='published');
create policy "public read enabled sources" on sources for select using (enabled=true);
create policy "public read external signals" on external_signals for select using (status in ('new','reviewed','published'));

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
