// Import the functions you need from the SDKs you need
"use client";
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG-bVnRt-IpS5FKa5aGrN2wXNK3PnzTAA",
  authDomain: "pantryapp-49065.firebaseapp.com",
  projectId: "pantryapp-49065",
  storageBucket: "pantryapp-49065.appspot.com",
  messagingSenderId: "263605012135",
  appId: "1:263605012135:web:cb5fe20f78737acefcbd82",
  measurementId: "G-LFDSSK7X5D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
