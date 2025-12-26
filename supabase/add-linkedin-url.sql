-- Add linkedin_url column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add index for LinkedIn URL lookups (optional, but useful if you'll search by LinkedIn)
CREATE INDEX IF NOT EXISTS idx_user_profiles_linkedin_url ON user_profiles(linkedin_url) WHERE linkedin_url IS NOT NULL;

