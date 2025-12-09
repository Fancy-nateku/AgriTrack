-- Check what's in your database right now
-- Run this to see the current state

-- 1. Check your profile
SELECT 'Your Profile' as check_name, id, username, full_name 
FROM public.profiles 
LIMIT 5;

-- 2. Check your farms
SELECT 'Your Farms' as check_name, id, owner_id, name 
FROM public.farms 
LIMIT 5;

-- 3. Check if there are any activities
SELECT 'Activities' as check_name, COUNT(*) as count
FROM public.activities;

-- 4. Check if activities table structure is correct
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'activities'
ORDER BY ordinal_position;
