-- 00029_foods_catalog.sql — catálogo global de alimentos + cálculo de macros

-- 1) Catálogo (TACO seed + OFF cache). Global, não por-tenant.
create table if not exists public.foods (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  brand             text,
  category          text,
  source            text not null check (source in ('taco','off')),
  source_ref        text,
  image_url         text,
  kcal_100g         numeric not null default 0,
  protein_g_100g    numeric not null default 0,
  carbs_g_100g      numeric not null default 0,
  fat_g_100g        numeric not null default 0,
  fiber_g_100g      numeric,
  sodium_mg_100g    numeric,
  default_portion_g numeric,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

create unique index if not exists foods_source_ref_uniq
  on public.foods (source, source_ref) where source_ref is not null;

create extension if not exists pg_trgm;
create index if not exists foods_name_trgm
  on public.foods using gin (name gin_trgm_ops);

alter table public.meal_items
  add column if not exists food_id uuid references public.foods(id);

alter table public.recipe_ingredients
  add column if not exists food_id   uuid references public.foods(id),
  add column if not exists calories  numeric,
  add column if not exists protein_g numeric,
  add column if not exists carbs_g   numeric,
  add column if not exists fat_g     numeric;

alter table public.foods enable row level security;

drop policy if exists "foods readable by authenticated" on public.foods;
create policy "foods readable by authenticated"
  on public.foods for select to authenticated using (true);

create or replace function public.recipe_macros(p_recipe_id uuid)
returns table (kcal numeric, protein_g numeric, carbs_g numeric, fat_g numeric)
language sql stable as $$
  select coalesce(sum(ri.calories),0),
         coalesce(sum(ri.protein_g),0),
         coalesce(sum(ri.carbs_g),0),
         coalesce(sum(ri.fat_g),0)
  from public.recipe_ingredients ri
  where ri.recipe_id = p_recipe_id;
$$;
