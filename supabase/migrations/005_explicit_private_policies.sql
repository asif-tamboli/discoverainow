create policy "deny public affiliate access" on affiliate_links
  for all to anon, authenticated using (false) with check (false);
create policy "deny public sponsorship access" on sponsorships
  for all to anon, authenticated using (false) with check (false);
create policy "deny public subscriber access" on newsletter_subscribers
  for all to anon, authenticated using (false) with check (false);
create policy "deny public event access" on events
  for all to anon, authenticated using (false) with check (false);
create policy "deny public metrics access" on content_metrics
  for all to anon, authenticated using (false) with check (false);

revoke all on schema net from public, anon, authenticated;
revoke execute on all functions in schema net from public, anon, authenticated;
