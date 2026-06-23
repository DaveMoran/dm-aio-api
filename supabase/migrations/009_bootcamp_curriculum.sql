create table if not exists bootcamp_curriculum (
  id            uuid primary key default gen_random_uuid(),
  week_number   integer not null unique,
  title         text not null,
  focus         text not null,
  total_hours   integer not null,
  dates         text not null,
  start_date    date not null,
  end_date      date not null,
  deliverable   text not null,
  curriculum    jsonb not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table bootcamp_curriculum enable row level security;

create policy "read_all_curriculum" on bootcamp_curriculum
  for select using (true);
