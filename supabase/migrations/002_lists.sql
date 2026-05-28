-- Shopping items
create table if not exists shopping_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null default 'Groceries'
              check (category in ('Groceries', 'Productivity', 'Gifts')),
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Todo items
create table if not exists todo_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  priority    text check (priority in ('high', 'medium', 'low')),
  due_date    date,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- RLS
alter table shopping_items enable row level security;
alter table todo_items enable row level security;

create policy "allow_all_shopping" on shopping_items for all using (true) with check (true);
create policy "allow_all_todos" on todo_items for all using (true) with check (true);
