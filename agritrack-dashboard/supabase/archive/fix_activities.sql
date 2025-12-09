-- EMERGENCY FIX: Run this if activities table doesn't exist
-- This creates JUST the activities table with a simpler RLS policy

-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activities (
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

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage activities for their farms" ON public.activities;

-- Create a simpler, more permissive policy for testing
CREATE POLICY "Users can manage activities for their farms"
  ON public.activities FOR ALL
  TO authenticated
  USING (
    farm_id IN (
      SELECT id FROM public.farms
      WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    farm_id IN (
      SELECT id FROM public.farms
      WHERE owner_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX IF NOT EXISTS idx_activities_farm_id ON public.activities(farm_id);

-- Verify the policy was created
SELECT policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'activities';
