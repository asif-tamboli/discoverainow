create or replace view public.internal_funnel_overview_30d
with (security_invoker = true) as
with session_steps as (
  select
    session_id,
    max(anonymous_id) as anonymous_id,
    bool_or(event_name = 'session_start') as reached_entry,
    bool_or(event_name in ('search','tool_finder_result','prompt_builder_generate','workflow_generator_generate','prompt_lab_compare','prompt_evaluator_run','prompt_compare_run','stack_builder_result','replacement_finder_result')) as reached_intent,
    bool_or(event_name in ('tool_finder_result','prompt_builder_generate','workflow_generator_generate','prompt_lab_compare','prompt_evaluator_run','prompt_compare_run','stack_builder_result','replacement_finder_result')) as reached_recommendation,
    bool_or(event_name in ('recommendation_click','prompt_copy','prompt_builder_copy','workflow_open','workflow_generator_copy','prompt_lab_copy','prompt_evaluator_copy','prompt_compare_copy')) as reached_action,
    bool_or(event_name in ('output_verifier_run','output_verifier_copy','output_verifier_correction_copy')) as reached_verification,
    bool_or(event_name in ('newsletter_signup','workspace_save','outbound_click','affiliate_click','content_request_submit')) as reached_conversion
  from public.events
  where created_at >= now() - interval '30 days'
    and session_id is not null
  group by session_id
), strict_steps as (
  select
    session_id,
    anonymous_id,
    reached_entry as s1,
    reached_entry and reached_intent as s2,
    reached_entry and reached_intent and reached_recommendation as s3,
    reached_entry and reached_intent and reached_recommendation and reached_action as s4,
    reached_entry and reached_intent and reached_recommendation and reached_action and reached_verification as s5,
    reached_entry and reached_intent and reached_recommendation and reached_action and reached_verification and reached_conversion as s6
  from session_steps
), counts as (
  select * from (values
    (1, '01_entry', 'Entry', (select count(*) from strict_steps where s1), (select count(distinct anonymous_id) from strict_steps where s1)),
    (2, '02_intent', 'Intent', (select count(*) from strict_steps where s2), (select count(distinct anonymous_id) from strict_steps where s2)),
    (3, '03_recommendation', 'Recommendation', (select count(*) from strict_steps where s3), (select count(distinct anonymous_id) from strict_steps where s3)),
    (4, '04_action', 'Action', (select count(*) from strict_steps where s4), (select count(distinct anonymous_id) from strict_steps where s4)),
    (5, '05_verification', 'Verification', (select count(*) from strict_steps where s5), (select count(distinct anonymous_id) from strict_steps where s5)),
    (6, '06_conversion', 'Conversion', (select count(*) from strict_steps where s6), (select count(distinct anonymous_id) from strict_steps where s6))
  ) as v(stage_order, funnel_stage, funnel_label, sessions, users)
), measured as (
  select
    *,
    max(sessions) filter (where stage_order = 1) over () as entry_sessions,
    lag(sessions) over (order by stage_order) as previous_sessions
  from counts
)
select
  stage_order,
  funnel_stage,
  funnel_label,
  sessions::bigint,
  users::bigint,
  round(100.0 * sessions / nullif(entry_sessions, 0), 1) as conversion_from_entry_pct,
  case
    when stage_order = 1 then 100.0
    else round(100.0 * sessions / nullif(previous_sessions, 0), 1)
  end as conversion_from_previous_pct
from measured
order by stage_order;

revoke all on public.internal_funnel_overview_30d from public, anon, authenticated;
