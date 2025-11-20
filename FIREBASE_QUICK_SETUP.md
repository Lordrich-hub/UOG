# Firebase Setup - Step-by-Step Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `uog-app` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for now)
6. Click **Create project**
7. Wait for setup to complete, then click **Continue**

### Step 2: Add Web App

1. In your Firebase project dashboard, click the **web icon** `</>`
2. Enter app nickname: `UOG Web App`
3. **Do NOT check** "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a code snippet - **COPY the firebaseConfig object**

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "uog-app-xxxxx.firebaseapp.com",
  projectId: "uog-app-xxxxx",
  storageBucket: "uog-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxx"
};
```

6. Click **Continue to console**

### Step 3: Enable Email/Password Authentication

1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Click on **Email/Password** in the Sign-in providers list
4. Toggle **Enable** switch to ON
5. Click **Save**

### Step 4: Create Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it later)
4. Click **Next**
5. Select your region (choose closest to you)
6. Click **Enable**
7. Wait for database to be created

### Step 5: Update Your App Config

1. Open the file: `config/firebase.ts` in your project
2. Replace the placeholder config with YOUR copied config from Step 2
3. Save the file

**Before:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**After (with your actual values):**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "uog-app-xxxxx.firebaseapp.com",
  projectId: "uog-app-xxxxx",
  storageBucket: "uog-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxx"
};
```

### Step 6: Test Your App

1. In your terminal, make sure the app is running: `npx expo start`
2. Press `w` to open in web browser
3. You should see the authentication screen
4. Try creating an account with:
   - Name: Test Student
   - Email: test@example.com
   - Password: password123
   - Role: Student
5. Click **Sign Up**

If successful, you'll be redirected to the student home screen!

## 🔒 Security Rules (IMPORTANT - Do this after testing)

Once everything works, secure your database:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all users (for displaying names, etc.)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## 📱 Testing Checklist

- [ ] Sign up as Student works
- [ ] Sign up as Staff works  
- [ ] Sign in with existing account works
- [ ] Redirects to correct portal (student/staff)
- [ ] Guest access still works
- [ ] User data appears in Firestore (check Firebase Console → Firestore Database)

## 🆘 Troubleshooting

**Error: "Permission denied"**
- Make sure Firestore is in test mode
- Check that Authentication is enabled

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Double-check you copied the config correctly
- Make sure there are no extra quotes or spaces

**Error: "Network request failed"**
- Check your internet connection
- Try disabling VPN if you have one

**Can't see users in Firestore**
- Go to Firebase Console → Firestore Database
- Look for a collection called "users"
- If empty, try signing up again

## 🎯 What You'll See in Firebase Console

After signing up:
1. **Authentication** → **Users** tab will show registered users
2. **Firestore Database** → **Data** tab will show user documents

Each user document contains:
- name
- email  
- role (student or staff)
- createdAt timestamp

---

**Need help?** Open the Firebase Console and Expo terminal side-by-side to see real-time updates!
