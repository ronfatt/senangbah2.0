begin;

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  role text not null default 'student',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  display_name text not null,
  full_name text,
  form integer,
  estimated_band numeric(4,2),
  target_band numeric(4,2),
  class_name text,
  teacher_name text,
  onboarding_completed boolean not null default false,
  weaknesses jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  billing_interval text,
  currency text,
  price_cents integer,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  provider text not null,
  provider_subscription_id text,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_premium boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  code text not null unique,
  name text not null,
  description text,
  module_type text not null,
  access_level text not null default 'free',
  status text not null default 'active',
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid references public.plans(id),
  subject_id uuid references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  entitlement_type text not null,
  source text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.trial_windows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  code text not null unique,
  title text not null,
  summary text,
  content jsonb not null default '{}'::jsonb,
  difficulty text,
  estimated_minutes integer,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  code text not null unique,
  title text not null,
  activity_type text not null,
  instructions text,
  access_level text not null default 'free',
  config jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_items (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  item_order integer not null,
  item_type text not null,
  prompt text,
  content jsonb not null default '{}'::jsonb,
  answer_key jsonb,
  skill_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (activity_id, item_order)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  legacy_source text,
  legacy_id text,
  status text not null,
  score numeric(6,2),
  accuracy_percent numeric(6,2),
  stars integer not null default 0,
  elapsed_ms integer,
  started_at timestamptz,
  completed_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attempt_item_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  activity_item_id uuid references public.activity_items(id) on delete set null,
  item_order integer,
  status text,
  student_answer text,
  is_correct boolean,
  score numeric(6,2),
  elapsed_ms integer,
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  attempt_id uuid references public.attempts(id) on delete cascade,
  event_type text not null,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  snapshot_type text not null,
  snapshot_date date not null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, subject_id, module_id, snapshot_type, snapshot_date)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null,
  provider_payment_id text,
  status text not null,
  currency text not null,
  amount_cents integer not null,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  display_style text not null default 'study-core',
  mood text not null default 'focused',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.avatar_item_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  slot text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.avatar_item_categories(id) on delete cascade,
  code text not null unique,
  name text not null,
  rarity text not null default 'common',
  price_points integer not null default 0,
  unlock_type text not null default 'shop',
  required_badge_code text,
  required_subject_code text,
  collection_name text,
  preview jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null references public.avatar_items(id) on delete cascade,
  unlock_source text not null default 'shop',
  points_spent integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  acquired_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create table if not exists public.avatar_equipped_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category_id uuid not null references public.avatar_item_categories(id) on delete cascade,
  item_id uuid not null references public.avatar_items(id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create table if not exists public.point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_type text not null,
  source_id text,
  delta_points integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.legacy_import_runs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  status text not null,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.legacy_user_mappings (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid references public.legacy_import_runs(id) on delete set null,
  legacy_user_id text not null,
  new_user_id uuid not null references public.users(id) on delete cascade,
  source_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_name, legacy_user_id)
);

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_entitlements_user_id on public.entitlements(user_id);
create index if not exists idx_entitlements_subject_id on public.entitlements(subject_id);
create index if not exists idx_trial_windows_user_id on public.trial_windows(user_id);
create index if not exists idx_modules_subject_id on public.modules(subject_id);
create index if not exists idx_lessons_subject_id on public.lessons(subject_id);
create index if not exists idx_activities_subject_id on public.activities(subject_id);
create index if not exists idx_attempts_user_id on public.attempts(user_id);
create index if not exists idx_attempts_subject_id on public.attempts(subject_id);
create index if not exists idx_attempts_module_id on public.attempts(module_id);
create index if not exists idx_attempt_item_results_attempt_id on public.attempt_item_results(attempt_id);
create index if not exists idx_feedback_events_user_id on public.feedback_events(user_id);
create index if not exists idx_progress_snapshots_user_id on public.progress_snapshots(user_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_avatar_inventory_user_id on public.avatar_inventory(user_id);
create index if not exists idx_avatar_equipped_items_user_id on public.avatar_equipped_items(user_id);
create index if not exists idx_point_ledger_user_id on public.point_ledger(user_id);

insert into public.subjects (code, name, description, sort_order, is_premium, status)
values
  ('english', 'English', 'Writing, grammar, reading, and vocabulary for exam improvement.', 1, false, 'active'),
  ('bahasa_melayu', 'Bahasa Melayu', 'Tatabahasa, pemahaman, and karangan support.', 2, false, 'active'),
  ('sejarah', 'Sejarah', 'Fact recall, timelines, and source-based exam practice.', 3, true, 'active'),
  ('geografi', 'Geografi', 'Concept review, map interpretation, and structured revision.', 4, true, 'active'),
  ('math', 'Math', 'Topic-based practice with worked-solution support.', 5, true, 'active'),
  ('add_math', 'Add Math', 'Higher-difficulty step checks and advanced problem practice.', 6, true, 'active')
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_premium = excluded.is_premium,
  status = excluded.status;

insert into public.plans (code, name, billing_interval, currency, price_cents, is_active, metadata)
values
  ('free', 'Free', null, 'MYR', 0, true, jsonb_build_object('description', 'Post-trial free tier with dashboard access and limited daily starter practice.', 'bundle_type', 'free')),
  ('trial_full_access', '7-Day Full Trial', 'trial', 'MYR', 0, true, jsonb_build_object('description', 'Automatic 7-day full-access trial for all newly registered users.', 'duration_days', 7, 'bundle_type', 'trial')),
  ('language_pack', 'Language Pack', 'monthly', 'MYR', 2900, true, jsonb_build_object('description', 'English and Bahasa Melayu bundle.', 'subject_codes', jsonb_build_array('english', 'bahasa_melayu'), 'bundle_type', 'language')),
  ('humanities_pack', 'Humanities Pack', 'monthly', 'MYR', 1900, true, jsonb_build_object('description', 'Sejarah and Geografi bundle.', 'subject_codes', jsonb_build_array('sejarah', 'geografi'), 'bundle_type', 'humanities')),
  ('math_pack', 'Math Pack', 'monthly', 'MYR', 1900, true, jsonb_build_object('description', 'Math and Add Math bundle.', 'subject_codes', jsonb_build_array('math', 'add_math'), 'bundle_type', 'math')),
  ('all_access', 'All Access', 'monthly', 'MYR', 5900, true, jsonb_build_object('description', 'All current subjects and premium access.', 'subject_codes', jsonb_build_array('english', 'bahasa_melayu', 'sejarah', 'geografi', 'math', 'add_math'), 'bundle_type', 'all_access'))
on conflict (code) do update set
  name = excluded.name,
  billing_interval = excluded.billing_interval,
  currency = excluded.currency,
  price_cents = excluded.price_cents,
  is_active = excluded.is_active,
  metadata = excluded.metadata;

insert into public.avatar_item_categories (code, name, slot, sort_order)
values
  ('hair', 'Hair', 'hair', 1),
  ('top', 'Top', 'top', 2),
  ('bottom', 'Bottom', 'bottom', 3),
  ('shoes', 'Shoes', 'shoes', 4),
  ('accessory', 'Accessory', 'accessory', 5)
on conflict (code) do update set
  name = excluded.name,
  slot = excluded.slot,
  sort_order = excluded.sort_order;

insert into public.avatar_items (category_id, code, name, rarity, price_points, unlock_type, required_badge_code, required_subject_code, collection_name, preview, is_active, sort_order)
values
  ((select id from public.avatar_item_categories where code = 'hair'), 'hair-study-bob', 'Study Bob', 'common', 0, 'starter', null, null, 'Study Core', jsonb_build_object('color', 'ink', 'accent', 'soft'), true, 1),
  ((select id from public.avatar_item_categories where code = 'hair'), 'hair-comet-wave', 'Comet Wave', 'rare', 650, 'shop', null, null, 'Galaxy Explorer', jsonb_build_object('color', 'teal', 'accent', 'gold'), true, 2),
  ((select id from public.avatar_item_categories where code = 'top'), 'top-campus-tee', 'Campus Tee', 'common', 0, 'starter', null, null, 'Study Core', jsonb_build_object('color', 'cream', 'accent', 'teal'), true, 1),
  ((select id from public.avatar_item_categories where code = 'top'), 'top-neon-hoodie', 'Neon Hoodie', 'rare', 700, 'shop', null, 'math', 'Neo Math', jsonb_build_object('color', 'charcoal', 'accent', 'lime'), true, 2),
  ((select id from public.avatar_item_categories where code = 'bottom'), 'bottom-classic-pants', 'Classic Pants', 'common', 0, 'starter', null, null, 'Study Core', jsonb_build_object('color', 'navy'), true, 1),
  ((select id from public.avatar_item_categories where code = 'bottom'), 'bottom-explorer-cargo', 'Explorer Cargo', 'rare', 720, 'shop', null, 'geografi', 'Galaxy Explorer', jsonb_build_object('color', 'sand'), true, 2),
  ((select id from public.avatar_item_categories where code = 'shoes'), 'shoes-daily-runner', 'Daily Runner', 'common', 280, 'shop', null, null, 'Sporty Pop', jsonb_build_object('color', 'white', 'accent', 'orange'), true, 1),
  ((select id from public.avatar_item_categories where code = 'shoes'), 'shoes-cosmic-high', 'Cosmic High Tops', 'epic', 1450, 'shop', 'star_collector', null, 'Galaxy Explorer', jsonb_build_object('color', 'midnight', 'accent', 'cyan'), true, 2),
  ((select id from public.avatar_item_categories where code = 'accessory'), 'accessory-first-star-pin', 'First Star Pin', 'common', 0, 'achievement', 'first_win', null, 'Exam Ace', jsonb_build_object('color', 'gold'), true, 1),
  ((select id from public.avatar_item_categories where code = 'accessory'), 'accessory-streak-headset', 'Streak Headset', 'epic', 980, 'shop', 'streak_starter', null, 'Sporty Pop', jsonb_build_object('color', 'teal', 'accent', 'warm'), true, 2)
on conflict (code) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  rarity = excluded.rarity,
  price_points = excluded.price_points,
  unlock_type = excluded.unlock_type,
  required_badge_code = excluded.required_badge_code,
  required_subject_code = excluded.required_subject_code,
  collection_name = excluded.collection_name,
  preview = excluded.preview,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

commit;
