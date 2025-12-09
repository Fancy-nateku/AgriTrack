-- ============================================
-- AGRITRACK EXTENDED SCHEMA
-- Complete database schema with all tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLEANUP: Drop existing objects
-- ============================================

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- Drop policies (existing tables)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
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

  -- New tables policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activities') THEN
    DROP POLICY IF EXISTS "Users can manage activities for their farms" ON public.activities;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'crops') THEN
    DROP POLICY IF EXISTS "Users can manage crops for their farms" ON public.crops;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventory') THEN
    DROP POLICY IF EXISTS "Users can manage inventory for their farms" ON public.inventory;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workers') THEN
    DROP POLICY IF EXISTS "Users can manage workers for their farms" ON public.workers;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labor_records') THEN
    DROP POLICY IF EXISTS "Users can manage labor records for their farms" ON public.labor_records;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'farm_notes') THEN
    DROP POLICY IF EXISTS "Users can manage notes for their farms" ON public.farm_notes;
  END IF;
END $$;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS public.labor_records CASCADE;
DROP TABLE IF EXISTS public.workers CASCADE;
DROP TABLE IF EXISTS public.farm_notes CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.crops CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.income CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.farms CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- CREATE CORE TABLES
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE FINANCIAL TABLES
-- ============================================

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE ACTIVITY PLANNING TABLE
-- ============================================

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  time_frame TEXT NOT NULL CHECK (time_frame IN ('today', 'this-week', 'this-month', 'custom')),
  custom_date DATE,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE CROP MANAGEMENT TABLES
-- ============================================

CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  quantity_planted NUMERIC,
  quantity_harvested NUMERIC,
  unit TEXT, -- 'kg', 'tons', 'bags', etc.
  status TEXT CHECK (status IN ('planted', 'growing', 'harvested', 'sold')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE INVENTORY TABLE
-- ============================================

CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('seeds', 'fertilizer', 'pesticide', 'equipment', 'other')),
  quantity NUMERIC NOT NULL,
  unit TEXT,
  purchase_date DATE,
  expiry_date DATE,
  supplier TEXT,
  cost_per_unit NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE LABOR/WORKER TABLES
-- ============================================

CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  daily_wage NUMERIC,
  hired_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.labor_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  hours_worked NUMERIC,
  task_description TEXT,
  amount_paid NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE FARM NOTES TABLE
-- ============================================

CREATE TABLE public.farm_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  weather_condition TEXT,
  temperature NUMERIC,
  rainfall NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES - PROFILES
-- ============================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CREATE RLS POLICIES - FARMS
-- ============================================

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

-- ============================================
-- CREATE RLS POLICIES - EXPENSES
-- ============================================

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

-- ============================================
-- CREATE RLS POLICIES - INCOME
-- ============================================

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
-- CREATE RLS POLICIES - ACTIVITIES
-- ============================================

CREATE POLICY "Users can manage activities for their farms"
  ON public.activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.activities.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.activities.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES - CROPS
-- ============================================

CREATE POLICY "Users can manage crops for their farms"
  ON public.crops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.crops.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.crops.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES - INVENTORY
-- ============================================

CREATE POLICY "Users can manage inventory for their farms"
  ON public.inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.inventory.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.inventory.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES - WORKERS
-- ============================================

CREATE POLICY "Users can manage workers for their farms"
  ON public.workers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.workers.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.workers.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES - LABOR RECORDS
-- ============================================

CREATE POLICY "Users can manage labor records for their farms"
  ON public.labor_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.labor_records.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.labor_records.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES - FARM NOTES
-- ============================================

CREATE POLICY "Users can manage notes for their farms"
  ON public.farm_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.farm_notes.farm_id
      AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = public.farm_notes.farm_id
      AND f.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_farms_owner_id ON public.farms(owner_id);
CREATE INDEX idx_expenses_farm_id ON public.expenses(farm_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_income_farm_id ON public.income(farm_id);
CREATE INDEX idx_income_date ON public.income(date);
CREATE INDEX idx_activities_farm_id ON public.activities(farm_id);
CREATE INDEX idx_activities_completed ON public.activities(completed);
CREATE INDEX idx_crops_farm_id ON public.crops(farm_id);
CREATE INDEX idx_crops_status ON public.crops(status);
CREATE INDEX idx_inventory_farm_id ON public.inventory(farm_id);
CREATE INDEX idx_workers_farm_id ON public.workers(farm_id);
CREATE INDEX idx_labor_records_farm_id ON public.labor_records(farm_id);
CREATE INDEX idx_labor_records_worker_id ON public.labor_records(worker_id);
CREATE INDEX idx_farm_notes_farm_id ON public.farm_notes(farm_id);

-- ============================================
-- NOTES
-- ============================================
-- 1. Email confirmation is disabled in Supabase Dashboard settings
-- 2. Profile creation is handled by frontend (AuthContext.tsx)
-- 3. No database triggers are used to avoid permission issues
-- 4. Users authenticate with username@agritrack.local format internally
-- 5. All tables have RLS enabled for data security
-- 6. Indexes added for common query patterns
