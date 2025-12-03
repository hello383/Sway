-- Add auth_user_id column to link profiles to Supabase Auth users
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update profile_visibility to allow 'campaign_only'
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_profile_visibility_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_profile_visibility_check 
CHECK (profile_visibility IN ('visible', 'email', 'campaign_only'));

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);

