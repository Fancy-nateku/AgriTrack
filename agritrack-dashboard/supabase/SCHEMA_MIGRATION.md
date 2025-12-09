# AgriTrack Database Schema Migration Guide

## Overview

This document explains the database schema consolidation for AgriTrack and provides guidance for applying the schema to your Supabase project.

## Schema Files History

Previously, the `/supabase` directory contained **13 different SQL files**, created during development and debugging:

### Archived Files (moved to `/supabase/archive/`)
- `schema_final.sql` - Earlier "final" version with only core tables
- `schema_simple.sql` - Simplified version for testing
- `schema_v2.sql` - Second iteration
- `schema_extended.sql` - Extended version with all tables (basis for current schema)
- `check_state.sql` - Debugging script
- `complete_fix.sql` - Bug fix script
- `create_my_data.sql` - Test data creation
- `create_profile_farm.sql` - Profile/farm setup script
- `debug_activities.sql` - Activities table debugging
- `diagnose.sql` - Diagnostic queries
- `fix_activities.sql` - Activities table fixes
- `manual_setup.sql` - Manual setup instructions

### Current Authoritative Schema
**`schema.sql`** - Single source of truth for the database schema

## What's Included in the Current Schema

### Core Tables (Currently Used)
1. **profiles** - User profiles (extends Supabase auth.users)
2. **farms** - Farm information (multi-farm support)
3. **expenses** - Expense tracking
4. **income** - Income/sales tracking
5. **activities** - Activity planning and task management

### Future Feature Tables (Ready for Implementation)
6. **crops** - Crop planting and harvest tracking
7. **inventory** - Farm inventory management
8. **workers** - Farm workers/employees
9. **labor_records** - Daily labor records and payments
10. **farm_notes** - Daily farm observations and notes

### Security & Performance
- **Row Level Security (RLS)** enabled on all tables
- **RLS Policies** ensure users can only access their own data
- **Indexes** on frequently queried columns for performance
- **Foreign key constraints** for data integrity

## How to Apply the Schema

### For a New Supabase Project

1. **Create a new Supabase project** at https://supabase.com

2. **Configure Authentication Settings**
   - Go to: Authentication > Settings
   - **Disable** "Enable email confirmations"
   - This allows username-based authentication

3. **Run the Schema**
   - Go to: SQL Editor in Supabase Dashboard
   - Copy the entire contents of `schema.sql`
   - Paste and click "Run"
   - Wait for completion (should take a few seconds)

4. **Verify Installation**
   ```sql
   -- Run this query to see all tables
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
   ```
   
   You should see all 10 tables listed.

5. **Configure Frontend**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

### For an Existing Supabase Project

> **⚠️ WARNING**: Running this schema will **DROP ALL EXISTING TABLES** and their data!

If you have existing data:

1. **Backup your data first**
   ```sql
   -- Export each table's data
   COPY (SELECT * FROM profiles) TO '/tmp/profiles_backup.csv' CSV HEADER;
   COPY (SELECT * FROM farms) TO '/tmp/farms_backup.csv' CSV HEADER;
   -- ... repeat for all tables
   ```

2. **Run the schema** (this will drop and recreate all tables)

3. **Restore your data**
   ```sql
   -- Import data back
   COPY profiles FROM '/tmp/profiles_backup.csv' CSV HEADER;
   -- ... repeat for all tables
   ```

Alternatively, you can:
- Create a new Supabase project for the updated schema
- Migrate data programmatically using the Supabase client

## Authentication Approach

AgriTrack uses a **username-based authentication** system designed for farmers who may not have email addresses.

### How It Works

1. **Frontend** (`AuthContext.tsx`):
   - User enters username and password
   - Frontend converts username to `username@agritrack.local` format
   - Calls Supabase auth with this fake email

2. **Supabase**:
   - Email confirmation is disabled
   - User is created immediately
   - Returns auth session

3. **Profile Creation**:
   - Frontend manually creates profile record
   - Links to auth.users via user ID
   - Stores actual username in profiles table

### Why This Approach?

- Supabase requires email-based auth by default
- Target users (farmers) may not have email
- This workaround provides username/password auth
- Simple and effective for the use case

## Testing the Schema

After applying the schema, test the setup:

```sql
-- 1. Check that RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't' (true) for rowsecurity

-- 2. Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
-- Should see multiple policies per table

-- 3. Test with a user (do this via the application)
-- - Sign up with a username
-- - Create a farm
-- - Add an expense
-- - Verify data appears correctly
```

## Troubleshooting

### Issue: "relation does not exist" errors
**Solution**: Make sure you ran the entire `schema.sql` file, not just parts of it.

### Issue: RLS policy violations
**Solution**: Ensure you're authenticated and have created a farm. All data is scoped to farms owned by the user.

### Issue: Profile creation fails
**Solution**: Check that email confirmation is disabled in Supabase Dashboard > Authentication > Settings.

### Issue: Can't see other users' data
**Solution**: This is correct! RLS policies ensure data isolation between users.

## Migration Changelog

### Version 1.0 (2025-11-25)
- Consolidated 13 schema files into single `schema.sql`
- Added comprehensive inline documentation
- Added table and column comments
- Included all future feature tables
- Optimized indexes for common queries
- Archived old schema files

## Next Steps

1. ✅ Schema is consolidated and documented
2. Apply schema to your Supabase project
3. Test authentication flow
4. Begin implementing future features (crops, inventory, etc.)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Supabase authentication settings
3. Review the inline comments in `schema.sql`
4. Check the application logs for specific error messages
