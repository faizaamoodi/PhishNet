import app from './firebase-config'; // Adjust the path if needed

chrome.runtime.onInstalled.addListener(() => {
  console.log("PhishNet extension installed!");
});


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCGyK2CUBIsDen5PN6rR8wSV23JQXwcCes",
  authDomain: "phishing-f4a58.firebaseapp.com",
  projectId: "phishing-f4a58",
  storageBucket: "phishing-f4a58.firebasestorage.app",
  messagingSenderId: "789589561947",
  appId: "1:789589561947:web:4bf5306862472c915c257e",
  measurementId: "G-ST9ZKKDMXX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

chrome.runtime.onInstalled.addListener(() => {
  console.log("PhishNet extension installed!");
  console.log("Firebase initialized!");
});
