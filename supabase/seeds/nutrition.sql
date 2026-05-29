-- Default active meal plan (id matches ACTIVE_PLAN_ID in nutrition service)
insert into meal_plans (id, name, active)
values ('bbbbbbbb-0000-0000-0000-000000000001', 'Default Plan', true)
on conflict (id) do nothing;

-- Default day targets (Mon=0 ... Sun=6), matching tracker DEFAULT_TARGETS
insert into meal_plan_targets (
  plan_id, day_of_week,
  calories_min, calories_max,
  protein_min, protein_max,
  carbs_min, carbs_max,
  fat_min, fat_max
)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 0, 2100, 2200, 160, 170, 190, 210, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 1, 2300, 2400, 165, 175, 220, 240, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 2, 2200, 2300, 160, 170, 200, 220, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 3, 2300, 2400, 165, 175, 220, 240, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 4, 2100, 2200, 160, 170, 190, 210, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 5, 2400, 2500, 165, 175, 230, 250, 65, 75),
  ('bbbbbbbb-0000-0000-0000-000000000001', 6, 2000, 2100, 155, 165, 175, 195, 65, 75)
on conflict (plan_id, day_of_week) do nothing;
