# Google Search Console Domain Verification

## The Issue
Google OAuth verification requires domain ownership verification for `joinsway.org`.

## Step-by-Step Verification

### Step 1: Add Property to Google Search Console
1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Select "Domain" (not URL prefix)
4. Enter: `joinsway.org`
5. Click "Continue"

### Step 2: Choose Verification Method

**Option A: HTML File Upload (Recommended for Netlify)**
1. Google will show you a verification file (e.g., `google1234567890.html`)
2. Download the file
3. Upload it to the `public/` folder in this project
4. Commit and push to GitHub
5. Netlify will deploy it
6. Click "Verify" in Google Search Console

**Option B: HTML Meta Tag**
1. Google will give you a meta tag like:
   ```html
   <meta name="google-site-verification" content="ABC123..." />
   ```
2. I'll add it to `app/layout.tsx`
3. Commit and push
4. Click "Verify" in Google Search Console

**Option C: DNS Record**
1. Google will give you a TXT record
2. Add it to your DNS provider (wherever joinsway.org DNS is managed)
3. Wait for DNS propagation
4. Click "Verify" in Google Search Console

## Recommended: HTML File Method

Once you get the verification file from Google:
1. Save it to: `public/google1234567890.html` (use the actual filename Google gives you)
2. Tell me the filename and I'll commit it
3. Or commit it yourself and push

## After Verification

Once verified:
1. Go back to Google Cloud Console OAuth consent screen
2. Click "I have fixed the issues"
3. Request re-verification
4. Google should now recognize domain ownership

