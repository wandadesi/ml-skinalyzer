// firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxidARnn6O3ixtAxmfWGL1jhtnYOTJOA0",
  authDomain: "skinalyzer-44ff5.firebaseapp.com",
  projectId: "skinalyzer-44ff5",
  storageBucket: "skinalyzer-44ff5.appspot.com",
  messagingSenderId: "499753145724",
  appId: "1:499753145724:web:da6c77b0d9b5638d66c0f9",
  measurementId: "G-M1LVSYH7JM"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export { app, db };