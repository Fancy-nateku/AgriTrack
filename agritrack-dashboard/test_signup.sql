-- Test query to check if triggers and tables exist
-- Run this in Supabase SQL Editor to debug

-- Check if profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as profiles_exists;

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND event_object_table = 'users';

-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('handle_new_user', 'auto_confirm_user');

-- Try to manually test the profile creation
-- (This will show if there's an RLS policy blocking inserts)
SELECT auth.uid();
