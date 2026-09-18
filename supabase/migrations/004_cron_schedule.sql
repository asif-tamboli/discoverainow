create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;

-- Required Vault secrets (create outside source control):
-- project_url = https://<project-ref>.supabase.co
-- anon_jwt    = legacy anon JWT used only to authorize scheduled Edge Function calls

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname in (
    'discoverainow-hackernews',
    'discoverainow-github',
    'discoverainow-huggingface',
    'discoverainow-dev'
  ) loop
    perform cron.unschedule(r.jobid);
  end loop;
end $$;

select cron.schedule(
  'discoverainow-hackernews',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/ingest-ai-signals',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='anon_jwt')
    ),
    body := '{"source":"hackernews"}'::jsonb
  );
  $$
);

select cron.schedule(
  'discoverainow-github',
  '7 */6 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/ingest-ai-signals',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='anon_jwt')
    ),
    body := '{"source":"github"}'::jsonb
  );
  $$
);

select cron.schedule(
  'discoverainow-huggingface',
  '17 */6 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/ingest-ai-signals',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='anon_jwt')
    ),
    body := '{"source":"huggingface"}'::jsonb
  );
  $$
);

select cron.schedule(
  'discoverainow-dev',
  '27 */6 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/ingest-ai-signals',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='anon_jwt')
    ),
    body := '{"source":"dev"}'::jsonb
  );
  $$
);
