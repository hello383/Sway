-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  town TEXT,
  role TEXT NOT NULL,
  experience TEXT NOT NULL,
  current_company TEXT,
  expected_salary TEXT,
  work_hours TEXT NOT NULL,
  remote_retreats TEXT,
  work_environment TEXT,
  profile_visibility TEXT NOT NULL CHECK (profile_visibility IN ('visible', 'email')),
  employment_status TEXT,
  government_campaign BOOLEAN DEFAULT false,
  campaign_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_postings table (for future use)
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT,
  remote_type TEXT,
  salary_range TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_visibility ON user_profiles(profile_visibility);
CREATE INDEX IF NOT EXISTS idx_user_profiles_county ON user_profiles(county);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

