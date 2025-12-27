# Code Quality Checks

This document outlines automated and manual checks to prevent common bugs in the Sway codebase.

## Automated Checks

### Profile Redirect Issues

Run the automated scanner to check for profile redirect bugs:

```bash
npm run check-redirects
```

This script checks for:
- Profile checks without `profile_visibility` validation
- Redirects to `/profile` without checking visibility type
- Missing `campaign_only` handling in redirect logic
- Profile queries that should include `profile_visibility` in select

**What it looks for:**
- ❌ `if (profile && profile.id)` → redirect (missing visibility check)
- ✅ `if (profile && profile.id && (profile.profile_visibility === 'visible' || profile.profile_visibility === 'email'))` → redirect

## Manual Code Review Checklist

### Before Committing Changes

1. **Profile Redirect Logic**
   - [ ] Does the code check `profile_visibility` before redirecting to `/profile`?
   - [ ] Are `campaign_only` profiles handled correctly (should NOT redirect to profile)?
   - [ ] Does the profile query include `profile_visibility` in the select?

2. **Profile Visibility States**
   - `'visible'` - Profile is searchable by employers
   - `'email'` - Profile is private, receives email notifications
   - `'campaign_only'` - Profile is for campaign support only, not in database

3. **Common Patterns to Watch**

   **❌ Bad Pattern:**
   ```typescript
   const { data: profile } = await supabase
     .from('user_profiles')
     .select('id')  // Missing profile_visibility!
     .eq('email', email)
     .maybeSingle()
   
   if (profile && profile.id) {
     router.push('/profile')  // Will redirect campaign_only users incorrectly!
   }
   ```

   **✅ Good Pattern:**
   ```typescript
   const { data: profile } = await supabase
     .from('user_profiles')
     .select('id, profile_visibility')  // Include visibility
     .eq('email', email)
     .maybeSingle()
   
   // Only redirect if they have a complete profile
   if (profile && profile.id && 
       (profile.profile_visibility === 'visible' || profile.profile_visibility === 'email')) {
     router.push('/profile')
   } else if (profile && profile.profile_visibility === 'campaign_only') {
     // Allow them to complete signup
   }
   ```

## Search Patterns for Manual Review

Use these grep commands to find potential issues:

```bash
# Find all profile checks
grep -rn "profile.*\.id" app/

# Find all redirects to profile
grep -rn "router.push.*profile" app/
grep -rn "redirect.*profile" app/

# Find profile queries
grep -rn "from('user_profiles')" app/
grep -rn 'from("user_profiles")' app/

# Check if profile_visibility is being checked
grep -rn "profile_visibility" app/
```

## Common Bug Scenarios

### Scenario 1: Campaign Signup → Complete Profile
**Bug:** User signs up via homepage campaign form (creates `campaign_only` profile), then clicks "Complete my profile" but gets redirected to `/profile` instead of signup form.

**Fix:** Check `profile_visibility` before redirecting.

### Scenario 2: OAuth Sign-in with Campaign Profile
**Bug:** User previously signed up for campaign, then signs in with Google OAuth, gets redirected to `/profile` instead of signup.

**Fix:** Check `profile_visibility` in auth callback.

### Scenario 3: Login with Campaign Profile
**Bug:** User with `campaign_only` profile logs in, gets redirected to `/profile` instead of signup.

**Fix:** Check `profile_visibility` in login redirect logic.

## Files to Review When Adding Redirect Logic

When adding new redirect logic, check these files for reference:

- `app/signup/page.tsx` - Example of correct campaign_only handling
- `app/auth/callback/page.tsx` - OAuth callback redirect logic
- `app/login/page.tsx` - Login redirect logic
- `app/success/page.tsx` - Success page redirect logic

## Running Checks in CI/CD

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Check redirect logic
  run: npm run check-redirects
```

## Reporting Issues

If the automated check finds issues:
1. Review the flagged code
2. Verify if it's a false positive or real issue
3. Fix the issue following the patterns in this document
4. Re-run the check to confirm fix

