-- STEP 1: Get your user ID
-- Run this first to see your user ID
SELECT 
  id,
  email,
  raw_user_meta_data->>'username' as username,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- STEP 2: Copy your user ID from the result above
-- Then replace 'PASTE_YOUR_USER_ID_HERE' below with your actual ID
-- and run the INSERT statements

-- Create profile (replace the ID!)
INSERT INTO public.profiles (id, username, full_name)
VALUES (
  'PASTE_YOUR_USER_ID_HERE',  -- Replace this!
  'testuser',                   -- Your username
  'Test User'                   -- Your full name
);

-- Create farm (replace the ID!)
INSERT INTO public.farms (owner_id, name, location, size_acres)
VALUES (
  'PASTE_YOUR_USER_ID_HERE',  -- Replace this with same ID!
  'My Farm',
  '',
  0
);

-- STEP 3: Verify it worked
SELECT 'Profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Farms' as table_name, COUNT(*) as count FROM public.farms;
