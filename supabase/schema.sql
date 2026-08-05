-- =============================================================
-- FinanceAI - Supabase Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================

-- Profiles (one row per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  currency text not null default 'USD',
  monthly_income numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Categories (default + user-specific)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  icon text not null default 'Circle',
  color text not null default '#8884d8',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount >= 0),
  category text not null,
  description text not null,
  date timestamptz not null default now(),
  payment_method text not null default 'Cash',
  receipt text,
  created_at timestamptz not null default now()
);

-- Budgets
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  category text not null,
  budget_limit numeric not null check (budget_limit > 0),
  spent numeric not null default 0,
  month integer not null,
  year integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on public.transactions (user_id);
create index if not exists idx_transactions_user_date on public.transactions (user_id, date desc);
create index if not exists idx_budgets_user on public.budgets (user_id, month, year);
create index if not exists idx_categories_user on public.categories (user_id);

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- Profiles: owner only
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Categories: owner or default
create policy "categories_select" on public.categories
  for select using (auth.uid() = user_id or is_default = true);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

-- Transactions: owner only
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- Budgets: owner only
create policy "budgets_select_own" on public.budgets
  for select using (auth.uid() = user_id);
create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id);
create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);

-- =============================================================
-- Auto-create profile + default categories on signup
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));

  insert into public.categories (user_id, name, type, icon, color, is_default) values
    (new.id, 'Food & Dining', 'expense', 'Utensils', '#FF6384', true),
    (new.id, 'Transportation', 'expense', 'Car', '#36A2EB', true),
    (new.id, 'Shopping', 'expense', 'ShoppingBag', '#FFCE56', true),
    (new.id, 'Entertainment', 'expense', 'Ticket', '#4BC0C0', true),
    (new.id, 'Bills & Utilities', 'expense', 'FileText', '#9966FF', true),
    (new.id, 'Healthcare', 'expense', 'HeartPulse', '#FF9F40', true),
    (new.id, 'Salary', 'income', 'Landmark', '#2ECC71', true),
    (new.id, 'Freelance', 'income', 'Briefcase', '#3498DB', true);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
