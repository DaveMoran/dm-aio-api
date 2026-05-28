-- Workout plan
create table if not exists workout_plans (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  start_date   date not null,
  total_weeks  int not null,
  active       boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Scheduled items (one row per workout entry per day in the plan)
create table if not exists workout_schedule_items (
  id           uuid primary key default gen_random_uuid(),
  plan_id      uuid not null references workout_plans(id) on delete cascade,
  week_number  int not null,
  day_of_week  int not null check (day_of_week between 0 and 6),
  sort_order   int not null default 0,
  label        text not null,
  type         text not null default 'single' check (type in ('single', 'program')),
  category     text not null default 'run' check (category in ('run', 'strength', 'race', 'cross')),
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists workout_schedule_items_week_day
  on workout_schedule_items (plan_id, week_number, day_of_week);

-- Sub-exercises for program-type items
create table if not exists workout_program_exercises (
  id                 uuid primary key default gen_random_uuid(),
  schedule_item_id   uuid not null references workout_schedule_items(id) on delete cascade,
  sort_order         int not null default 0,
  label              text not null,
  created_at         timestamptz not null default now()
);

-- Completion log (keyed by actual calendar date, not week/day)
create table if not exists workout_completions (
  id                 uuid primary key default gen_random_uuid(),
  schedule_item_id   uuid not null references workout_schedule_items(id) on delete cascade,
  date               date not null,
  completed_at       timestamptz not null default now(),
  unique (schedule_item_id, date)
);

create table if not exists workout_exercise_completions (
  id           uuid primary key default gen_random_uuid(),
  exercise_id  uuid not null references workout_program_exercises(id) on delete cascade,
  date         date not null,
  completed_at timestamptz not null default now(),
  unique (exercise_id, date)
);

-- RLS (open policy — single-user personal app)
alter table workout_plans enable row level security;
alter table workout_schedule_items enable row level security;
alter table workout_program_exercises enable row level security;
alter table workout_completions enable row level security;
alter table workout_exercise_completions enable row level security;

create policy "allow_all_workout_plans" on workout_plans for all using (true) with check (true);
create policy "allow_all_schedule_items" on workout_schedule_items for all using (true) with check (true);
create policy "allow_all_program_exercises" on workout_program_exercises for all using (true) with check (true);
create policy "allow_all_completions" on workout_completions for all using (true) with check (true);
create policy "allow_all_exercise_completions" on workout_exercise_completions for all using (true) with check (true);
