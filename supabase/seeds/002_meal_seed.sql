-- Queens Marathon Nutrition Plan seed — idempotent
do $$
declare
  pid uuid := 'bbbbbbbb-0000-0000-0000-000000000001';
begin
  delete from meal_plan_targets where plan_id = pid;
  delete from meal_plans where id = pid;

  insert into meal_plans (id, name, active)
  values (pid, 'Queens Marathon Nutrition', true);

  insert into meal_plan_targets
    (plan_id, day_of_week, calories_min, calories_max, protein_min, protein_max, carbs_min, carbs_max, fat_min, fat_max)
  values
    (pid, 0, 2100, 2200, 160, 170, 190, 210, 65, 75),  -- Mon
    (pid, 1, 2300, 2400, 165, 175, 220, 240, 65, 75),  -- Tue
    (pid, 2, 2200, 2300, 160, 170, 200, 220, 65, 75),  -- Wed
    (pid, 3, 2300, 2400, 165, 175, 220, 240, 65, 75),  -- Thu
    (pid, 4, 2100, 2200, 160, 170, 190, 210, 65, 75),  -- Fri
    (pid, 5, 2400, 2500, 165, 175, 230, 250, 65, 75),  -- Sat
    (pid, 6, 2000, 2100, 155, 165, 175, 195, 65, 75);  -- Sun
end;
$$;
