// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "aide-memoire-nm3806.firebaseapp.com",
    projectId: "aide-memoire-nm3806",
    storageBucket: "aide-memoire-nm3806.firebasestorage.app",
    messagingSenderId: "730452334111",
    appId: "1:730452334111:web:ee28c9c2905cd709b5e72a"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };