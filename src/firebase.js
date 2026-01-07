import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtw9RSBiTJuVZrISNhA3V1D1HQ3Cr2x7s",
  authDomain: "p4paisa-b4df7.firebaseapp.com",
  projectId: "p4paisa-b4df7",
  storageBucket: "p4paisa-b4df7.firebasestorage.app",
  messagingSenderId: "1058038922124",
  appId: "1:1058038922124:web:e3598e746cc0dfc43774a9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
