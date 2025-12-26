# Fix: Google OAuth Shows Supabase Domain Instead of App Domain

## The Problem
Google OAuth consent screen shows: "to continue to jxfpbrahiaynzyifshpe.supabase.co"
We want it to show: "to continue to joinsway.org"

## Why This Happens
Google shows the **redirect URI domain** in the consent screen, not the app domain. This is a security feature - Google shows users where they'll actually be redirected.

Since the redirect URI is: `https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback`
Google displays: `jxfpbrahiaynzyifshpe.supabase.co`

## Solutions to Try

### Solution 1: Check Supabase Site URL
1. Go to: https://supabase.com/dashboard/project/jxfpbrahiaynzyifshpe/auth/url-configuration
2. Set **Site URL** to: `https://joinsway.org`
3. This might help Google recognize the app domain

### Solution 2: Add Authorized Domain in Google OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=joinsway
2. Click "Edit App"
3. Scroll to **"Authorized domains"** section
4. Add: `joinsway.org`
5. Save and republish if needed

### Solution 3: This Might Be Expected Behavior
Unfortunately, Google may always show the redirect URI domain for security/transparency. This is actually a good security practice - users see where they're being redirected.

## Alternative: Custom Domain for Supabase (Advanced)
If you have a custom domain for Supabase, you could use that, but this requires:
- Custom domain setup in Supabase
- DNS configuration
- SSL certificate

## Research Confirmation ✅

**YES - This is EXPECTED BEHAVIOR**

According to Supabase documentation and community discussions:
- Google OAuth shows the **redirect URI domain** (Supabase) by default
- This is a security feature - users see where they're actually being redirected
- This is standard behavior for all Supabase projects using Google OAuth

## Solution (If You Must Change It)

**Option: Custom Domain for Supabase** (Requires Paid Plan)
1. Set up a custom domain in Supabase (e.g., `auth.joinsway.org`)
2. Configure DNS CNAME records
3. Update OAuth redirect URIs to use the custom domain
4. This will make Google show your custom domain

**Cost**: Requires Supabase paid plan (custom domains are a paid feature)

## Deep Research Findings

**Known Issue**: Supabase GitHub Issue #33387
- Multiple users report this, even with custom domains on paid plans
- Custom domains don't always solve it because Google shows redirect URI domain

## Solution: OAuth App Verification (Try This)

**This might actually work** - Some users report success after verification:

1. **Complete OAuth Consent Screen** (Google Cloud Console):
   - App name: "Sway"
   - Upload app logo
   - Application home page: `https://joinsway.org`
   - **Privacy policy URL**: REQUIRED (create one if needed)
   - **Terms of service URL**: REQUIRED (create one if needed)
   - Authorized domains: `joinsway.org`

2. **Submit for Verification** (not just "Save"):
   - Click "Submit for verification" button
   - Google will review your app
   - Process can take days/weeks
   - You may need to provide additional info

3. **After Verification**:
   - Google may show: "to continue to **Sway**" (app name)
   - Instead of: "to continue to domain.com"
   - This is the best outcome possible

## Why Custom Domain Didn't Work

Even with custom domain:
- If redirect URI still uses `*.supabase.co`, Google shows that
- Google displays the redirect URI domain, not app domain
- Custom domain must change the actual redirect URI, not just branding

## Recommendation

1. **Try OAuth App Verification** (Solution above)
   - Complete all required fields
   - Submit for verification
   - May take time but could work

2. **Accept the Limitation**
   - OAuth works perfectly functionally
   - This is a display detail, not a bug
   - Most users don't notice or care

