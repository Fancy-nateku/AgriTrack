-- COMPLETE FIX: Run this to ensure everything is set up correctly

-- 1. Make sure farms table exists
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  size_acres NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on farms
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- 3. Drop and recreate farms policies
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;

CREATE POLICY "Users can view their own farms"
  ON public.farms FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own farms"
  ON public.farms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own farms"
  ON public.farms FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own farms"
  ON public.farms FOR DELETE
  USING (auth.uid() = owner_id);

-- 4. Check your current state
SELECT 'Profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Farms' as table_name, COUNT(*) as count FROM public.farms
UNION ALL
SELECT 'Activities' as table_name, COUNT(*) as count FROM public.activities;
