-- Auto-create a `profiles` row whenever someone signs up via Supabase Auth.
-- The client passes { data: { role, full_name } } to supabase.auth.signUp(),
-- which lands in auth.users.raw_user_meta_data — this trigger reads it back
-- out and creates the matching profiles row. Run this after 0001_init.sql.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer'),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Suppliers who sign up also need a row in `suppliers` linked to their
-- profile, so they can immediately start the verification flow instead
-- of hitting a dead end. Company details get filled in afterward.
create or replace function public.handle_new_supplier()
returns trigger as $$
begin
  if new.role = 'supplier' then
    insert into public.suppliers (owner_id, company_name, verification_status)
    values (new.id, coalesce(new.full_name, 'Unnamed supplier'), 'pending');
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_profile_created_supplier
  after insert on public.profiles
  for each row execute function public.handle_new_supplier();
