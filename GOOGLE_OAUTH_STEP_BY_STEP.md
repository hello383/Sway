# Google OAuth Setup - Step by Step Guide

## Part 1: Google Cloud Console Setup

### Step 1: Create/Select a Project
1. Go to: https://console.cloud.google.com/
2. Click the project dropdown at the top (next to "Google Cloud")
3. Either:
   - **Select existing project** (if you have one for Sway)
   - **Click "New Project"** → Name it "Sway" → Click "Create"

### Step 2: Enable Google Identity API
1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for: **"Google Identity Services API"** (or "Google+ API")
3. Click on it
4. Click the **"Enable"** button
5. Wait for it to enable (usually instant)

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in the form:
   - **App name**: `Sway`
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On "Scopes" page, click **"Save and Continue"** (no need to add scopes)
7. On "Test users" page, click **"Save and Continue"** (skip for now)
8. On "Summary" page, click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Name it: **"Sway Production"**
6. **Authorized JavaScript origins** - Click "Add URI" and add:
   ```
   https://joinsway.org
   http://localhost:3000
   ```
7. **Authorized redirect URIs** - Click "Add URI" and add:
   ```
   https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback
   ```
8. Click **"Create"**
9. **IMPORTANT**: A popup will show your credentials:
   - **Client ID**: Copy this (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-abc123...`)
   - ⚠️ **Save these somewhere safe!** You won't see the secret again.

---

## Part 2: Supabase Configuration

### Step 5: Enable Google OAuth in Supabase
1. Go to: https://supabase.com/dashboard/project/jxfpbrahiaynzyifshpe
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"** tab
4. Find **"Google"** in the list
5. **Toggle the switch to ON** (it should turn green/blue)
6. Paste your credentials:
   - **Client ID (for OAuth)**: Paste the Client ID from Step 4
   - **Client secret (for OAuth)**: Paste the Client Secret from Step 4
7. Click **"Save"** at the bottom

---

## Part 3: Test It!

### Step 6: Test Google Sign-In
1. Go to: https://joinsway.org/signup (or http://localhost:3000/signup if testing locally)
2. Click **"Continue with Google"** button
3. You should be redirected to Google sign-in
4. Sign in with your Google account
5. You should be redirected back to Sway!

---

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback`

**Error: "provider is not enabled"**
- Go back to Supabase → Authentication → Providers
- Make sure Google is toggled ON (green/blue)
- Click Save

**Can't find OAuth credentials in Google Cloud Console**
- Make sure you're in the correct project
- Go to: APIs & Services → Credentials
- Look for "OAuth 2.0 Client IDs" section

---

## Quick Reference

- **Supabase Project**: jxfpbrahiaynzyifshpe
- **Supabase URL**: https://jxfpbrahiaynzyifshpe.supabase.co
- **Redirect URI**: https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback
- **App URL**: https://joinsway.org

