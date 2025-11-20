import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAclqEhYVqp2SWbslzcsEEBY6aghAtKXCw",
  authDomain: "university-of-greenwich-4cc5b.firebaseapp.com",
  projectId: "university-of-greenwich-4cc5b",
  storageBucket: "university-of-greenwich-4cc5b.firebasestorage.app",
  messagingSenderId: "1001931786048",
  appId: "1:1001931786048:web:55073ccbc930524b661ca5",
  measurementId: "G-QZDD2X074E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
