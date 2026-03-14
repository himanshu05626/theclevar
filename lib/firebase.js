import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAlENWaE14gTg1w_pLZ5f2E1ofTHhRngog",
  authDomain: "the-clevar.firebaseapp.com",
  projectId: "the-clevar",
  storageBucket: "the-clevar.firebasestorage.app",
  messagingSenderId: "942249849295",
  appId: "1:942249849295:web:465317e84acaaefda522ba",
  measurementId: "G-9WPDPJRHWY"
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics (optional)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;