-- Persistent AI Chat: drop the accidental UNIQUE(thread_id) on ai_chat_messages
-- so that each thread can hold many messages.
--
-- Run this once against your Supabase project (SQL editor).

alter table public.ai_chat_messages
    drop constraint if exists ai_chat_messages_thread_id_key;
