-- ============================================
-- AGRITRACK FINAL WORKING SCHEMA
-- Username/Password Authentication
-- No triggers - Profile creation handled by frontend
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLEANUP: Drop existing objects
-- ============================================

-- Drop triggers (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- Drop policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.profiles;
    DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'farms') THEN
    DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expenses') THEN
    DROP POLICY IF EXISTS "Users can view expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can insert expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can update expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can delete expenses for their farms" ON public.expenses;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'income') THEN
    DROP POLICY IF EXISTS "Users can view income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can insert income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can update income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can delete income for their farms" ON public.income;
  END IF;
END $$;

-- Drop tables
DROP TABLE IF EXISTS public.income CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.farms CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  size_acres NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Farms
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

-- Expenses
CREATE POLICY "Users can view expenses for their farms"
  ON public.expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.expenses.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert expenses for their farms"
  ON public.expenses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.expenses.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update expenses for their farms"
  ON public.expenses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.expenses.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete expenses for their farms"
  ON public.expenses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.expenses.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- Income
CREATE POLICY "Users can view income for their farms"
  ON public.income FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.income.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert income for their farms"
  ON public.income FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.income.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update income for their farms"
  ON public.income FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.income.farm_id
      AND f.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete income for their farms"
  ON public.income FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.income.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- NOTES
-- ============================================
-- 1. Email confirmation is disabled in Supabase Dashboard settings
-- 2. Profile creation is handled by frontend (AuthContext.tsx)
-- 3. No database triggers are used to avoid permission issues
-- 4. Users authenticate with username@agritrack.local format internally
