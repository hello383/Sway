# Deep Research: Google OAuth Domain Display Issue

## Known Issue
- **Supabase GitHub Issue**: #33387
- **Status**: Multiple users report this issue
- **User Experience**: Even with custom domains on paid plans, Google still shows Supabase domain

## The Core Problem
Google OAuth shows the **redirect URI domain** in the consent screen. Since the redirect URI is:
```
https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback
```
Google displays: `jxfpbrahiaynzyifshpe.supabase.co`

## Why Custom Domain Didn't Work
Even with a custom domain set up:
- If the redirect URI still uses `*.supabase.co`, Google will show that
- The redirect URI domain is what Google displays, not the app domain
- Custom domains in Supabase may not change the OAuth redirect URI

## Potential Solutions Found

### Solution 1: OAuth Consent Screen Verification
**Status**: Reported to help by some users

**Steps**:
1. Go to Google Cloud Console → OAuth consent screen
2. Complete ALL fields:
   - App name: "Sway"
   - App logo: Upload your logo
   - Application home page: `https://joinsway.org`
   - Privacy policy URL: (required for verification)
   - Terms of service URL: (required for verification)
   - Authorized domains: Add `joinsway.org`
3. **Submit for verification** (not just "Save")
4. Google will review your app
5. Once verified, Google may show your app name instead of domain

**Note**: Verification can take days/weeks. You may need to provide:
- Privacy policy
- Terms of service
- Domain verification
- App description

### Solution 2: Check if Custom Domain Actually Changed Redirect URI
If you set up a custom domain:
1. Check what the actual redirect URI is in Supabase
2. It should be: `https://auth.joinsway.org/auth/v1/callback` (or similar)
3. Update Google OAuth redirect URIs to match
4. Google should then show your custom domain

### Solution 3: Use App Name Instead of Domain
After verification, Google may show:
- "to continue to **Sway**" (app name)
- Instead of "to continue to domain.com"

This requires:
- App verification
- Complete OAuth consent screen
- Logo and branding

## Current Status
- ✅ OAuth is working functionally
- ❌ Domain display shows Supabase URL
- ⚠️ This is a known limitation

## Recommendation
1. **Try OAuth App Verification** (Solution 1)
   - Complete all consent screen fields
   - Submit for verification
   - May take time but could help

2. **Accept the Limitation**
   - OAuth works perfectly
   - Most users don't notice
   - This is a display detail, not a functional issue

3. **Consider Alternative**
   - Use email/password as primary
   - Google OAuth as secondary option
   - Users who use Google won't care about the domain

## Next Steps
1. Complete OAuth consent screen with all required fields
2. Submit app for Google verification
3. Wait for verification (can take time)
4. Test if app name appears instead of domain

