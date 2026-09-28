-- V2.1 · Auditoría de cambios del catálogo (base para "restaurar versión" en V2.10).
-- Reversión: supabase/rollback/20260928000004_auditoria.down.sql

create function private.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fila jsonb := to_jsonb(coalesce(new, old));
begin
  -- El seed se carga con app.omitir_auditoria = 'on' para no llenar el historial de ruido.
  if current_setting('app.omitir_auditoria', true) = 'on' then
    return coalesce(new, old);
  end if;

  insert into public.audit_log (tabla, registro_id, accion, antes, despues, actor)
  values (
    tg_table_name,
    coalesce(fila ->> 'id', fila ->> 'product_id', 'sin-id'),
    tg_op,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end,
    (select auth.uid())
  );
  return coalesce(new, old);
end;
$$;

revoke all on function private.registrar_auditoria() from public;

create trigger auditoria after insert or update or delete on public.categories
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.colors
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.products
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.product_colors
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.product_sizes
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.product_variants
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.product_images
  for each row execute function private.registrar_auditoria();
create trigger auditoria after insert or update or delete on public.store_settings
  for each row execute function private.registrar_auditoria();
