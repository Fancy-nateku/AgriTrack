-- STEP 1: Check what's wrong
-- Run each section separately to diagnose

-- Check if activities table exists
SELECT 'Activities table' as item, 
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'activities'
  ) THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Check if you have a farm
SELECT 'Your farms' as item, COUNT(*)::text as status
FROM public.farms WHERE owner_id = auth.uid();

-- Check your user ID
SELECT 'Your user ID' as item, auth.uid()::text as status;

-- If farms count is 0, run this to create a farm:
-- INSERT INTO public.farms (owner_id, name, location, size_acres)
-- VALUES (auth.uid(), 'My Farm', '', 0);

-- STEP 2: If activities table is MISSING, run fix_activities.sql
-- STEP 3: If farms count is 0, uncomment and run the INSERT above
