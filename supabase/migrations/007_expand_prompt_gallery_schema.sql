alter table prompts add column if not exists prompt_type text default 'text';
alter table prompts add column if not exists best_for text;
alter table prompts add column if not exists model_notes text;
alter table prompts add column if not exists aspect_ratio text;
alter table prompts add column if not exists example_input text;
alter table prompts add column if not exists example_output_notes text;
alter table prompts add column if not exists failure_modes text;
alter table prompts add column if not exists tags text[] default '{}';

create index if not exists idx_prompts_category_status on prompts(category,status);
create index if not exists idx_prompts_tags on prompts using gin(tags);
