create or replace view public.internal_funnel_daily
with (security_invoker = true) as
with staged as (
  select
    created_at,
    session_id,
    anonymous_id,
    coalesce(
      properties->>'funnel_stage',
      case
        when event_name = 'session_start' then '01_entry'
        when event_name = 'search' then '02_intent'
        when event_name in ('tool_finder_result','prompt_builder_generate','workflow_generator_generate','prompt_lab_compare','prompt_evaluator_run','prompt_compare_run','stack_builder_result','replacement_finder_result') then '03_recommendation'
        when event_name in ('recommendation_click','prompt_copy','prompt_builder_copy','workflow_open','workflow_generator_copy','prompt_lab_copy','prompt_evaluator_copy','prompt_compare_copy') then '04_action'
        when event_name in ('output_verifier_run','output_verifier_copy','output_verifier_correction_copy') then '05_verification'
        when event_name in ('newsletter_signup','workspace_save','outbound_click','affiliate_click','content_request_submit') then '06_conversion'
      end
    ) as funnel_stage
  from public.events
)
select
  created_at::date as day,
  funnel_stage,
  case funnel_stage
    when '01_entry' then 'Entry'
    when '02_intent' then 'Intent'
    when '03_recommendation' then 'Recommendation'
    when '04_action' then 'Action'
    when '05_verification' then 'Verification'
    when '06_conversion' then 'Conversion'
  end as funnel_label,
  count(*)::bigint as events,
  count(distinct session_id)::bigint as sessions,
  count(distinct anonymous_id)::bigint as users
from staged
where funnel_stage is not null
group by 1, 2, 3;

create or replace view public.internal_funnel_overview_30d
with (security_invoker = true) as
with stages(stage_order, funnel_stage, funnel_label) as (
  values
    (1, '01_entry', 'Entry'),
    (2, '02_intent', 'Intent'),
    (3, '03_recommendation', 'Recommendation'),
    (4, '04_action', 'Action'),
    (5, '05_verification', 'Verification'),
    (6, '06_conversion', 'Conversion')
), staged as (
  select
    session_id,
    anonymous_id,
    coalesce(
      properties->>'funnel_stage',
      case
        when event_name = 'session_start' then '01_entry'
        when event_name = 'search' then '02_intent'
        when event_name in ('tool_finder_result','prompt_builder_generate','workflow_generator_generate','prompt_lab_compare','prompt_evaluator_run','prompt_compare_run','stack_builder_result','replacement_finder_result') then '03_recommendation'
        when event_name in ('recommendation_click','prompt_copy','prompt_builder_copy','workflow_open','workflow_generator_copy','prompt_lab_copy','prompt_evaluator_copy','prompt_compare_copy') then '04_action'
        when event_name in ('output_verifier_run','output_verifier_copy','output_verifier_correction_copy') then '05_verification'
        when event_name in ('newsletter_signup','workspace_save','outbound_click','affiliate_click','content_request_submit') then '06_conversion'
      end
    ) as funnel_stage
  from public.events
  where created_at >= now() - interval '30 days'
), counts as (
  select
    funnel_stage,
    count(distinct session_id)::bigint as sessions,
    count(distinct anonymous_id)::bigint as users
  from staged
  where funnel_stage is not null
  group by 1
), ordered as (
  select
    s.stage_order,
    s.funnel_stage,
    s.funnel_label,
    coalesce(c.sessions, 0)::bigint as sessions,
    coalesce(c.users, 0)::bigint as users
  from stages s
  left join counts c using (funnel_stage)
), measured as (
  select
    *,
    max(sessions) filter (where stage_order = 1) over () as entry_sessions,
    lag(sessions) over (order by stage_order) as previous_sessions
  from ordered
)
select
  stage_order,
  funnel_stage,
  funnel_label,
  sessions,
  users,
  round(100.0 * sessions / nullif(entry_sessions, 0), 1) as conversion_from_entry_pct,
  case
    when stage_order = 1 then 100.0
    else round(100.0 * sessions / nullif(previous_sessions, 0), 1)
  end as conversion_from_previous_pct
from measured
order by stage_order;

create or replace view public.internal_top_paths_30d
with (security_invoker = true) as
select
  path,
  count(*) filter (where event_name = 'page_view')::bigint as page_views,
  count(distinct session_id) filter (where event_name = 'page_view')::bigint as sessions,
  count(*) filter (where event_name = 'engaged_session')::bigint as engaged_sessions,
  count(*) filter (where event_name in ('recommendation_click','prompt_copy','prompt_builder_copy','workflow_open','workflow_generator_copy','prompt_lab_copy','prompt_evaluator_copy','prompt_compare_copy') or properties->>'funnel_stage' = '04_action')::bigint as actions,
  count(*) filter (where event_name in ('output_verifier_run','output_verifier_copy','output_verifier_correction_copy') or properties->>'funnel_stage' = '05_verification')::bigint as verifications,
  count(*) filter (where event_name in ('newsletter_signup','workspace_save','outbound_click','affiliate_click','content_request_submit') or properties->>'funnel_stage' = '06_conversion')::bigint as conversions
from public.events
where created_at >= now() - interval '30 days'
group by path
order by page_views desc, actions desc;

revoke all on public.internal_funnel_daily from public, anon, authenticated;
revoke all on public.internal_funnel_overview_30d from public, anon, authenticated;
revoke all on public.internal_top_paths_30d from public, anon, authenticated;
