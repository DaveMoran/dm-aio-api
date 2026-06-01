-- Add soft-delete support to tasks for historical lifecycle tracking
alter table tasks add column if not exists deleted_at timestamptz default null;

create index if not exists tasks_deleted_at_idx on tasks (deleted_at);
create index if not exists task_completions_date_task_idx on task_completions (date, task_id);

-- Migrate existing completion state: tasks currently marked completed
-- get a task_completion row for today so no data is lost
insert into task_completions (task_id, date)
select id, current_date
from tasks
where completed = true
on conflict (task_id, date) do nothing;
