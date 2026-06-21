-- Add user_id to all user-specific tables
alter table tasks
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table shopping_items
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table todo_items
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table workout_completions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table workout_exercise_completions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table macro_logs
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table bootcamp_completions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- bootcamp_content: change item_key primary key → composite (item_key, user_id)
alter table bootcamp_content add column if not exists id uuid default gen_random_uuid() not null;
alter table bootcamp_content add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table bootcamp_content drop constraint if exists bootcamp_content_pkey;
alter table bootcamp_content add primary key (id);
alter table bootcamp_content add unique (item_key, user_id);

-- Fix unique constraints that assumed a single global user
alter table macro_logs drop constraint if exists macro_logs_date_key;
alter table macro_logs add constraint macro_logs_date_user_key unique (date, user_id);

alter table bootcamp_completions drop constraint if exists bootcamp_completions_item_key_key;
alter table bootcamp_completions add constraint bootcamp_completions_item_key_user_key unique (item_key, user_id);

alter table workout_completions drop constraint if exists workout_completions_schedule_item_id_date_key;
alter table workout_completions add constraint workout_completions_schedule_item_user_key unique (schedule_item_id, date, user_id);

alter table workout_exercise_completions drop constraint if exists workout_exercise_completions_exercise_id_date_key;
alter table workout_exercise_completions add constraint workout_exercise_completions_exercise_date_user_key unique (exercise_id, date, user_id);

-- Drop old permissive policies on user-scoped tables
drop policy if exists "allow_all_tasks" on tasks;
drop policy if exists "allow_all_completions" on task_completions;
drop policy if exists "allow_all_shopping" on shopping_items;
drop policy if exists "allow_all_todos" on todo_items;
drop policy if exists "allow_all_completions" on workout_completions;
drop policy if exists "allow_all_exercise_completions" on workout_exercise_completions;
drop policy if exists "allow_all_macro_logs" on macro_logs;
drop policy if exists "allow_all_bootcamp_completions" on bootcamp_completions;
drop policy if exists "allow_all_bootcamp_content" on bootcamp_content;

-- User-scoped RLS policies
create policy "user_tasks" on tasks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- task_completions scoped through task ownership (no user_id column needed on the child)
create policy "user_task_completions" on task_completions for all
  using (exists (
    select 1 from tasks t where t.id = task_completions.task_id and t.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from tasks t where t.id = task_completions.task_id and t.user_id = auth.uid()
  ));

create policy "user_shopping" on shopping_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_todos" on todo_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_workout_completions" on workout_completions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_exercise_completions" on workout_exercise_completions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_macro_logs" on macro_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_bootcamp_completions" on bootcamp_completions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_bootcamp_content" on bootcamp_content for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
