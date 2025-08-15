// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "aide-memoire-nm3806.firebaseapp.com",
    projectId: "aide-memoire-nm3806",
    storageBucket: "aide-memoire-nm3806.firebasestorage.app",
    messagingSenderId: "730452334111",
    appId: "1:730452334111:web:ee28c9c2905cd709b5e72a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);