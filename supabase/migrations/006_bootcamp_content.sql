create table if not exists bootcamp_content (
  item_key   text primary key,
  content    text not null,
  updated_at timestamptz not null default now()
);

alter table bootcamp_content enable row level security;

create policy "allow_all_bootcamp_content"
  on bootcamp_content for all using (true) with check (true);
