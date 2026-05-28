create table if not exists bootcamp_completions (
  id           uuid primary key default gen_random_uuid(),
  item_key     text not null unique,
  completed_at timestamptz not null default now()
);

alter table bootcamp_completions enable row level security;

create policy "allow_all_bootcamp_completions"
  on bootcamp_completions for all using (true) with check (true);
