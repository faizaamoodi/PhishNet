import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCGyK2CUBIsDen5PN6rR8wSV23JQXwcCes",
  authDomain: "phishing-f4a58.firebaseapp.com",
  databaseURL: "https://phishing-f4a58-default-rtdb.firebaseio.com",
  projectId: "phishing-f4a58",
  storageBucket: "phishing-f4a58.firebasestorage.app",
  messagingSenderId: "789589561947",
  appId: "1:789589561947:web:4bf5306862472c915c257e",
  measurementId: "G-ST9ZKKDMXX"
};

const app = initializeApp(firebaseConfig);

export default app;
