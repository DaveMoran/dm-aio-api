-- Tasks: the fixed list of AM/PM recurring daily tasks
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  period      text not null check (period in ('AM', 'PM')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Task completions: one row per task per calendar date when completed
create table if not exists task_completions (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid not null references tasks(id) on delete cascade,
  date         date not null,
  completed_at timestamptz not null default now(),
  unique (task_id, date)
);

-- Indexes for common queries
create index if not exists task_completions_date_idx on task_completions (date);

-- Enable Row Level Security (configure policies to match your auth strategy)
alter table tasks enable row level security;
alter table task_completions enable row level security;

-- Permissive policies for personal use (single user, no auth required)
-- Replace with user-scoped policies when you add authentication
create policy "allow_all_tasks" on tasks for all using (true) with check (true);
create policy "allow_all_completions" on task_completions for all using (true) with check (true);

-- Seed default task list
insert into tasks (name, period, sort_order) values
  ('Litter 1',                  'AM', 1),
  ('Litter 2',                  'AM', 2),
  ('Morning Routine',           'AM', 3),
  ('Swiffer',                   'AM', 4),
  ('Clean Bedroom / Kitchen',   'AM', 5),
  ('Vitamins / Creatine',       'AM', 6),
  ('Prep Stations',             'PM', 1),
  ('Nighttime Routine',         'PM', 2),
  ('Screen-free wind down',     'PM', 3),
  ('Refill Waters',             'PM', 4),
  ('Clean Living Room / Bathroom', 'PM', 5)
on conflict do nothing;
