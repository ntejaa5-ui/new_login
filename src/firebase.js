// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNvRTEp2DTD91hhon-U5QMTUDxjkhr0vs",
  authDomain: "clg1-24298.firebaseapp.com",
  projectId: "clg1-24298",
  storageBucket: "clg1-24298.firebasestorage.app",
  messagingSenderId: "991475859856",
  appId: "1:991475859856:web:df6d92884769f665337315",
  measurementId: "G-K710NC1CWE"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
