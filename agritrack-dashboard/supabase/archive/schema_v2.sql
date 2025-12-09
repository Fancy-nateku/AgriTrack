-- ============================================
-- AGRITRACK DATABASE SCHEMA - FIXED VERSION
-- This version fixes the RLS blocking issue
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: DROP EVERYTHING (NUCLEAR OPTION)
-- ============================================

-- Safely drop policies only if their tables exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.profiles;
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'farms'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
    DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'expenses'
  ) THEN
    DROP POLICY IF EXISTS "Users can view expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can insert expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can update expenses for their farms" ON public.expenses;
    DROP POLICY IF EXISTS "Users can delete expenses for their farms" ON public.expenses;
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'income'
  ) THEN
    DROP POLICY IF EXISTS "Users can view income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can insert income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can update income for their farms" ON public.income;
    DROP POLICY IF EXISTS "Users can delete income for their farms" ON public.income;
  END IF;
END;
$$;

-- Drop trigger and function (auth schema triggers)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
-- Drop helper functions in public if they exist
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- Drop all tables (CASCADE will drop foreign key constraints)
DROP TABLE IF EXISTS public.income CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.farms CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- STEP 2: CREATE ALL TABLES
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
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
-- STEP 3: CREATE TRIGGERS FIRST (BEFORE RLS)
-- This ensures triggers work before RLS is enabled
-- ============================================

-- Auto-profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-confirm email trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW(),
      confirmed_at = NOW()
  WHERE id = NEW.id
  AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_auto_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- ============================================
-- STEP 4: ENABLE RLS (AFTER TRIGGERS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE POLICIES
-- ============================================

-- Profiles - PERMISSIVE POLICIES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- CRITICAL: Allow inserts without auth check (for triggers)
CREATE POLICY "Allow profile creation"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

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
