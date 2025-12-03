# Google OAuth Setup for Sway

## ✅ Changes Made:

1. **Added password fields to signup form** - Users can now set their own password
2. **Updated API to use user passwords** - No more random temporary passwords
3. **Added "Sign in with Google" buttons** - On both signup and login pages

---

## 🔐 Configure Google OAuth in Supabase

Follow these steps to enable Google sign-in:

### **Step 1: Get Google OAuth Credentials**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a new project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name it "Sway" or "joinsway"
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name: "Sway Production"

5. **Add Authorized URLs**:
   
   **Authorized JavaScript origins:**
   ```
   https://joinsway.org
   http://localhost:3000
   ```

   **Authorized redirect URIs:**
   ```
   https://jxfpbrahiaynzyifshpe.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```

6. **Copy your credentials**:
   - **Client ID**: `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com`
   - **Client Secret**: `YOUR_CLIENT_SECRET_HERE`

---

### **Step 2: Configure Supabase**

1. **Go to Supabase**: https://supabase.com/dashboard/project/jxfpbrahiaynzyifshpe

2. **Click "Authentication"** → **"Providers"**

3. **Find "Google"** and toggle it ON

4. **Paste your credentials**:
   - **Client ID**: (from Step 1)
   - **Client Secret**: (from Step 1)

5. **Click "Save"**

---

### **Step 3: Test It!**

1. **Commit and push changes**:
   ```bash
   cd /Users/iggy/Desktop/desktop/CoachPackLocal/Sway
   git add -A
   git commit -m "Add password fields and Google OAuth"
   git push origin main
   ```

2. **Wait for Netlify to deploy** (2-3 minutes)

3. **Test on localhost**:
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000/signup
   - Click "Continue with Google"
   - Sign in with your Google account
   - You should be redirected back!

4. **Test on production**:
   - Go to https://joinsway.netlify.app/signup (or joinsway.org once DNS is fixed)
   - Click "Continue with Google"
   - Should work!

---

## 🎯 What Users Can Now Do:

### **Option 1: Sign up with Email + Password**
1. Fill out signup form
2. Set their own password
3. Login anytime with email/password

### **Option 2: Sign up with Google**
1. Click "Continue with Google"
2. Authorize with Google account
3. Auto-create profile
4. Login instantly with Google

---

## 🔒 Security Notes:

✅ **Passwords are now user-chosen** (not random)  
✅ **Google OAuth is secure** (Supabase handles tokens)  
✅ **Email is auto-verified** for Google sign-ins  
✅ **Row Level Security is enabled** (from earlier)  

---

## 📋 Next Steps:

1. **Configure Google OAuth** (follow Step 1 & 2 above)
2. **Commit and deploy changes**
3. **Test both signup methods**
4. **Celebrate!** 🎉

Your auth system is now production-ready with multiple sign-in options!

