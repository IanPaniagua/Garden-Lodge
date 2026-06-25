-- Garden Lodge admin access model.
--
-- App admins are allowlisted in public.admin_users. Keep user-specific inserts
-- out of version control; add admins manually from InsForge/MCP after creating
-- their auth.users account.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to public;

drop policy if exists epics_select_policy on public.epics;
drop policy if exists epics_insert_policy on public.epics;
drop policy if exists epics_update_policy on public.epics;
drop policy if exists epics_delete_policy on public.epics;

create policy epics_select_policy on public.epics
for select using (status = 'published' or public.is_admin());
create policy epics_insert_policy on public.epics
for insert with check (public.is_admin());
create policy epics_update_policy on public.epics
for update using (public.is_admin()) with check (public.is_admin());
create policy epics_delete_policy on public.epics
for delete using (public.is_admin());

drop policy if exists backlog_select_policy on public.backlog_items;
drop policy if exists backlog_insert_policy on public.backlog_items;
drop policy if exists backlog_update_policy on public.backlog_items;
drop policy if exists backlog_delete_policy on public.backlog_items;

create policy backlog_select_policy on public.backlog_items
for select using (status <> 'archived' or public.is_admin());
create policy backlog_insert_policy on public.backlog_items
for insert with check (public.is_admin());
create policy backlog_update_policy on public.backlog_items
for update using (public.is_admin()) with check (public.is_admin());
create policy backlog_delete_policy on public.backlog_items
for delete using (public.is_admin());

drop policy if exists media_select_policy on public.media_assets;
drop policy if exists media_insert_policy on public.media_assets;
drop policy if exists media_update_policy on public.media_assets;
drop policy if exists media_delete_policy on public.media_assets;

create policy media_select_policy on public.media_assets
for select using (true);
create policy media_insert_policy on public.media_assets
for insert with check (public.is_admin());
create policy media_update_policy on public.media_assets
for update using (public.is_admin()) with check (public.is_admin());
create policy media_delete_policy on public.media_assets
for delete using (public.is_admin());
