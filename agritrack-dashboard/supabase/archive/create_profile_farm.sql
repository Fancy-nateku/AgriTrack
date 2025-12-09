-- CRITICAL FIX: Create your profile and farm manually
-- This will fix the "no data" issue

-- Step 1: Check if you're logged in (run this first)
SELECT 
  'Current User' as info,
  auth.uid() as user_id,
  auth.email() as email;

-- Step 2: If user_id is NOT NULL, create your profile
-- IMPORTANT: Only run this if Step 1 shows a user_id
INSERT INTO public.profiles (id, username, full_name)
SELECT 
  auth.uid(),
  split_part(auth.email(), '@', 1) as username,
  'User' as full_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid()
);

-- Step 3: Create a farm for your profile
INSERT INTO public.farms (owner_id, name, location, size_acres)
SELECT 
  auth.uid(),
  'My Farm',
  '',
  0
WHERE NOT EXISTS (
  SELECT 1 FROM public.farms WHERE owner_id = auth.uid()
);

-- Step 4: Verify everything was created
SELECT 'Verification' as step, 
  (SELECT COUNT(*) FROM public.profiles WHERE id = auth.uid()) as profiles_count,
  (SELECT COUNT(*) FROM public.farms WHERE owner_id = auth.uid()) as farms_count;
