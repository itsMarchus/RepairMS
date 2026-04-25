-- =========================================================================
-- AI chat RPCs - read/write helpers for ai_chat_threads & ai_chat_messages.
--
-- All functions are SECURITY DEFINER with a locked search_path, and EXECUTE
-- is granted only to `authenticated`. Each function performs its own
-- auth.uid() guard so the anon key cannot reach them even if granted by
-- mistake. RLS stays enabled on the underlying tables with NO permissive
-- policies, so direct PostgREST `.from()` access is blocked and every read
-- and write must go through these functions.
--
-- Run this once against your Supabase project (SQL editor).
-- =========================================================================

-- 1. List recent threads for a ticket -------------------------------------
create or replace function public.get_chat_threads_by_ticket(p_ticket_id uuid)
returns table (
    id uuid,
    title text,
    summary text,
    updated_at timestamptz,
    created_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    return query
    select t.id, t.title, t.summary, t.updated_at, t.created_at
    from public.ai_chat_threads t
    where t.ticket_id = p_ticket_id
    order by t.updated_at desc;
end;
$$;

-- 2. Get one thread by id (used to validate ?thread=<uuid> URLs) ---------
create or replace function public.get_chat_thread_by_id(p_thread_id uuid)
returns table (
    id uuid,
    ticket_id uuid,
    title text,
    summary text,
    created_at timestamptz,
    updated_at timestamptz,
    created_by text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    return query
    select t.id, t.ticket_id, t.title, t.summary,
           t.created_at, t.updated_at, t.created_by
    from public.ai_chat_threads t
    where t.id = p_thread_id;
end;
$$;

-- 3. Get all messages of a thread, oldest first ---------------------------
create or replace function public.get_chat_messages_by_thread(p_thread_id uuid)
returns table (
    id uuid,
    thread_id uuid,
    role text,
    content text,
    created_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    return query
    select m.id, m.thread_id, m.role, m.content, m.created_at
    from public.ai_chat_messages m
    where m.thread_id = p_thread_id
    order by m.created_at asc;
end;
$$;

-- 4. Create a new thread (created_by resolved by the app) ----------------
create or replace function public.create_chat_thread(
    p_ticket_id uuid,
    p_created_by text
)
returns table (
    id uuid,
    ticket_id uuid,
    title text,
    summary text,
    created_at timestamptz,
    updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    return query
    insert into public.ai_chat_threads (ticket_id, created_by)
    values (p_ticket_id, p_created_by)
    returning ai_chat_threads.id,
             ai_chat_threads.ticket_id,
             ai_chat_threads.title,
             ai_chat_threads.summary,
             ai_chat_threads.created_at,
             ai_chat_threads.updated_at;
end;
$$;

-- 5. Append a message + bump thread.updated_at atomically ----------------
create or replace function public.append_chat_message(
    p_thread_id uuid,
    p_role text,
    p_content text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    insert into public.ai_chat_messages (thread_id, role, content)
    values (p_thread_id, p_role, p_content);

    update public.ai_chat_threads
    set updated_at = now()
    where id = p_thread_id;
end;
$$;

-- 6. Update a thread's title ---------------------------------------------
create or replace function public.update_chat_thread_title(
    p_thread_id uuid,
    p_title text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    update public.ai_chat_threads
    set title = left(p_title, 120)
    where id = p_thread_id;
end;
$$;

-- 7. Delete a thread (cascades to messages) ------------------------------
create or replace function public.delete_chat_thread(p_thread_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if auth.uid() is null then
        raise exception 'UNAUTHENTICATED';
    end if;

    delete from public.ai_chat_threads
    where id = p_thread_id;
end;
$$;

-- =========================================================================
-- Permissions: only `authenticated` may execute these functions.
-- =========================================================================
revoke execute on function public.get_chat_threads_by_ticket(uuid)        from public, anon;
revoke execute on function public.get_chat_thread_by_id(uuid)             from public, anon;
revoke execute on function public.get_chat_messages_by_thread(uuid)       from public, anon;
revoke execute on function public.create_chat_thread(uuid, text)          from public, anon;
revoke execute on function public.append_chat_message(uuid, text, text)   from public, anon;
revoke execute on function public.update_chat_thread_title(uuid, text)    from public, anon;
revoke execute on function public.delete_chat_thread(uuid)                from public, anon;

grant execute on function public.get_chat_threads_by_ticket(uuid)        to authenticated;
grant execute on function public.get_chat_thread_by_id(uuid)             to authenticated;
grant execute on function public.get_chat_messages_by_thread(uuid)       to authenticated;
grant execute on function public.create_chat_thread(uuid, text)          to authenticated;
grant execute on function public.append_chat_message(uuid, text, text)   to authenticated;
grant execute on function public.update_chat_thread_title(uuid, text)    to authenticated;
grant execute on function public.delete_chat_thread(uuid)                to authenticated;
