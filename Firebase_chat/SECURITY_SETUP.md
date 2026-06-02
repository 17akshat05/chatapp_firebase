# Environment & Security Setup Guide

## 🔒 What's Been Done

Your sensitive data has been secured:

### Files Protected:
- ✅ **Supabase credentials** - Moved to `.env`
- ✅ **.gitignore updated** - Will ignore `.env`, `google-services.json`, keystores
- ✅ **supabase.js** - Now reads from environment variables

### Files to Protect (Manual):
1. **google-services.json** (Android Firebase config) - Already in `.gitignore`
2. **GoogleService-Info.plist** (iOS Firebase config) - Already in `.gitignore`
3. **.env file** - NEVER commit this (already in `.gitignore`)

---

## 🚀 Setup Instructions

### Step 1: Install react-native-config (For Environment Variables)

```bash
npm install react-native-config
npx pod-install ios
```

### Step 2: Update metro.config.js

The metro config is ready to support environment variables. React Native will automatically load your `.env` file.

### Step 3: Configure Your Local .env

**The `.env` file is already created with your Supabase credentials.**

For new developers joining your project:
1. Copy `.env.example` to `.env`
2. Fill in their own credentials (Supabase URL & API key)
3. Never commit `.env` file

### Step 4: Firebase Configuration (Platform-Specific)

**Android:**
- Place `google-services.json` in `android/app/`
- Don't commit it (already in `.gitignore`)

**iOS:**
- Place `GoogleService-Info.plist` in `ios/Firebase_chat/`
- Don't commit it (already in `.gitignore`)

---

## 📝 Usage in Your Code

The Supabase service is now updated to read from environment variables:

```javascript
// src/services/supabase.js
import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## ⚠️ Before Pushing to GitHub

**Run this to make sure sensitive files won't be pushed:**

```bash
# Check what will be committed
git status

# Verify .env and google-services.json are NOT listed
# They should only appear in .gitignore
```

---

## 🔐 Security Checklist

- [ ] `.env` file exists locally (not committed)
- [ ] `.env.example` is committed with template
- [ ] `.gitignore` includes `.env`, `google-services.json`, `*.keystore`
- [ ] Supabase credentials are in `.env` (not in source code)
- [ ] Firebase configs are in platform directories, not committed
- [ ] Team members have a copy of `.env.example`

---

## 📚 Files Changed

1. ✅ Created `.env.example` - Template for new developers
2. ✅ Created `.env` - Your local credentials (not pushed)
3. ✅ Updated `src/services/supabase.js` - Uses environment variables
4. ✅ Updated `.gitignore` - Protects sensitive files

---

## 🆘 Troubleshooting

**Environment variables not loading?**
- Make sure `.env` is in the project root
- Restart your development server: `npm start`
- Clear metro bundler cache: `npm start -- --reset-cache`

**Different Supabase credentials per environment?**
- Create `.env.development`, `.env.staging`, `.env.production`
- Use appropriate file based on your build

