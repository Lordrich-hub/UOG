# Firebase Configuration

To set up Firebase for this project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your Firebase project
4. Copy the Firebase configuration
5. Replace the placeholder values in `config/firebase.ts` with your actual Firebase credentials:

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

## Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication

## Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Create database (start in test mode for development)
3. The app will automatically create user documents with this structure:

```
users/{userId}
  - name: string
  - email: string
  - role: "student" | "staff"
  - createdAt: string (ISO date)
```

## Security Rules (Recommended for Production)

Update your Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features

- **Sign Up**: Students and staff can create accounts with email/password
- **Sign In**: Existing users can sign in
- **Role-based Navigation**: Automatically redirects to student or staff portal based on role
- **Guest Access**: Continue as guest option for demo purposes
- **Persistent Sessions**: User role is stored locally for quick app launches
