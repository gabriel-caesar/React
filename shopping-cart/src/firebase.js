import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCkfc0JYUIWVdJcQsrYsj0qK1czoIKwGzE",
  authDomain: "boxcart-7d05e.firebaseapp.com",
  projectId: "boxcart-7d05e",
  storageBucket: "boxcart-7d05e.firebasestorage.app",
  messagingSenderId: "1085551195768",
  appId: "1:1085551195768:web:e620d6219fe1fc676adf8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // database

// initializing the authentication service
const auth = getAuth();

export { db, auth };