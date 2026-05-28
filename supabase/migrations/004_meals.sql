create table if not exists meal_plans (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  active      boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists meal_plan_targets (
  id           uuid primary key default gen_random_uuid(),
  plan_id      uuid not null references meal_plans(id) on delete cascade,
  day_of_week  int not null check (day_of_week between 0 and 6),
  calories_min int not null,
  calories_max int not null,
  protein_min  int not null,
  protein_max  int not null,
  carbs_min    int not null,
  carbs_max    int not null,
  fat_min      int not null,
  fat_max      int not null,
  unique (plan_id, day_of_week)
);

create table if not exists macro_logs (
  id          uuid primary key default gen_random_uuid(),
  date        date not null unique,
  calories    int,
  protein     int,
  carbs       int,
  fat         int,
  logged_at   timestamptz not null default now()
);

alter table meal_plans enable row level security;
alter table meal_plan_targets enable row level security;
alter table macro_logs enable row level security;

create policy "allow_all_meal_plans" on meal_plans for all using (true) with check (true);
create policy "allow_all_meal_targets" on meal_plan_targets for all using (true) with check (true);
create policy "allow_all_macro_logs" on macro_logs for all using (true) with check (true);
