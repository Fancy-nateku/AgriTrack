-- Quick diagnostic script to check current state
-- Run this in Supabase SQL Editor to see what's wrong

-- 1. Check if activities table exists
SELECT 'Activities table exists' as check_name, 
       EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = 'activities'
       ) as result;

-- 2. Check if you have any farms
SELECT 'Your farms' as check_name, 
       COUNT(*) as farm_count,
       array_agg(id) as farm_ids
FROM public.farms
WHERE owner_id = auth.uid();

-- 3. Check RLS policies on activities table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'activities';

-- 4. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('activities', 'farms', 'profiles');
