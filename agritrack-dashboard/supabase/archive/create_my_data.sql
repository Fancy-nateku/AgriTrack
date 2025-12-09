-- Create profile for user 91bcaf68-7c3e-49b7-a4e7-6939e26f850a
INSERT INTO public.profiles (id, username, full_name)
VALUES (
  '91bcaf68-7c3e-49b7-a4e7-6939e26f850a',
  'testuser',
  'Test User'
);

-- Create farm for user 91bcaf68-7c3e-49b7-a4e7-6939e26f850a
INSERT INTO public.farms (owner_id, name, location, size_acres)
VALUES (
  '91bcaf68-7c3e-49b7-a4e7-6939e26f850a',
  'My Farm',
  '',
  0
);

-- Verify it worked
SELECT 'Profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Farms' as table_name, COUNT(*) as count FROM public.farms;
