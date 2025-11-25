# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `sway` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to Ireland
4. Wait for the project to be created (takes ~2 minutes)

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")
   - **service_role key** (under "Project API keys" → "service_role" - keep this secret!)

## 3. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the SQL
5. Verify tables were created by going to **Table Editor** - you should see:
   - `user_profiles`
   - `job_postings`

## 5. Set Up Row Level Security (RLS) - Optional but Recommended

For production, you'll want to set up RLS policies. For now, the anon key will work for basic operations.

### Basic RLS Setup:

```sql
-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read visible profiles
CREATE POLICY "Anyone can read visible profiles"
  ON user_profiles
  FOR SELECT
  USING (profile_visibility = 'visible');

-- Allow anyone to insert profiles
CREATE POLICY "Anyone can insert profiles"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow updates only by email (you'll need to implement auth for this)
-- For now, we'll keep it open for development
```

## 6. Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try submitting the signup form at `http://localhost:3000/signup`

3. Check your Supabase dashboard → **Table Editor** → `user_profiles` to see if data was inserted

## Troubleshooting

- **"Missing Supabase environment variables"**: Make sure your `.env.local` file has all three Supabase variables set
- **"relation does not exist"**: Run the SQL schema in the SQL Editor
- **"permission denied"**: Check your RLS policies or use the service_role key for admin operations

## Next Steps

- Set up email authentication (optional)
- Configure RLS policies for production
- Set up database backups
- Configure API rate limiting

