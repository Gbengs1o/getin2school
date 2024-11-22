import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhs9Z4H6Yiye-ssyB5_6DJkInWaDTkkYM",
  authDomain: "getin2school1site.firebaseapp.com",
  projectId: "getin2school1site",
  storageBucket: "getin2school1site.appspot.com",
  messagingSenderId: "286860803613",
  appId: "1:286860803613:web:c6b78a4cf6faf194b590f4",
  measurementId: "G-1T9N5M9GSW",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig }; // Exporting firebaseConfig now
