-- CRITICAL SECURITY FIX: Enable Row Level Security
-- Run this in Supabase SQL Editor immediately!

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on job_postings
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view VISIBLE profiles only
CREATE POLICY "Public profiles are viewable by everyone"
  ON user_profiles
  FOR SELECT
  USING (profile_visibility = 'visible');

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Policy: Anyone can insert a new profile (signup)
CREATE POLICY "Anyone can create a profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Policy: Only service role can delete profiles (admin only)
CREATE POLICY "Only admins can delete profiles"
  ON user_profiles
  FOR DELETE
  USING (false); -- Normal users cannot delete

-- Job Postings Policies
CREATE POLICY "Anyone can view job postings"
  ON job_postings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage job postings"
  ON job_postings
  FOR ALL
  USING (false); -- Only service role can manage jobs

-- Grant authenticated users access
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON job_postings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO anon;
GRANT SELECT ON job_postings TO anon;

