# Quick Guide: Enable Google OAuth in Supabase

## The Error
```
"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"
```

This means Google OAuth is not enabled in your Supabase project.

## Quick Fix (2 Steps)

### Step 1: Enable Google OAuth in Supabase Dashboard

1. **Go to your Supabase project**: https://supabase.com/dashboard/project/jxfpbrahiaynzyifshpe
2. **Click "Authentication"** in the left sidebar
3. **Click "Providers"** tab
4. **Find "Google"** in the list
5. **Toggle it ON** (switch should be green)
6. **Click "Save"**

⚠️ **If you don't have Google OAuth credentials yet**, you'll need to:
- Get a Client ID and Client Secret from Google Cloud Console
- See Step 2 below

### Step 2: Get Google OAuth Credentials (If Needed)

If you haven't set up Google OAuth credentials:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity Services API"
   - Click "Enable"
4. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: "Sway"
5. **Add Authorized redirect URIs**:
   ```
   https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback
   ```
6. **Copy the Client ID and Client Secret**
7. **Paste them in Supabase** (Step 1, fields 4-5)

## Test It

After enabling:
1. Go to https://joinsway.org/signup (or http://localhost:3000/signup)
2. Click "Continue with Google"
3. It should redirect to Google sign-in!

## Current Configuration

- **Supabase Project**: jxfpbrahiaynzyifshpe
- **Redirect URI**: `https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback`
- **App URL**: https://joinsway.org

