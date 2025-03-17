// imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGyK2CUBIsDen5PN6rR8wSV23JQXwcCes",
    authDomain: "phishing-f4a58.firebaseapp.com",
    projectId: "phishing-f4a58",
    storageBucket: "phishing-f4a58.firebasestorage.app",
    messagingSenderId: "789589561947",
    appId: "1:789589561947:web:4bf5306862472c915c257e",
    measurementId: "G-ST9ZKKDMXX"
  };
  
  // initialize firebase
  const app = initializeApp(firebaseConfig);
  
  // load DOM first
  document.addEventListener("DOMContentLoaded", function () {
      console.log("register.js loaded and DOM fully parsed"); // Debugging check
  
      // element references from DOM
      const signupForm = document.getElementById("signupForm");
      const loginForm = document.getElementById("loginForm");
      const toggleModeBtn = document.getElementById("toggleModeBtn");
      const title = document.getElementById("title");
      const forgotPasswordLink = document.getElementById("forgotPasswordLink");
      const forgotPasswordModal = document.getElementById("forgotPasswordModal");
      const closeModal = document.getElementById("closeModal");
  
      // initialize firebase services
      const auth = getAuth(app);
      const db = getFirestore(app);
  
      // debug - check for all elements in DOM
      if (!signupForm || !loginForm || !toggleModeBtn || !title) {
          console.error("One or more elements are missing from the DOM.");
          return;
      }
  
      let isLoginMode = false;
  
      // switch between log in and sign up
      toggleModeBtn.addEventListener("click", function () {
          isLoginMode = !isLoginMode;
          console.log("Toggle button clicked. New mode:", isLoginMode ? "Login" : "Sign Up");
  
          // shows or hides fields based on mode
          signupForm.style.display = isLoginMode ? "none" : "block";
          loginForm.style.display = isLoginMode ? "block" : "none";
          title.textContent = isLoginMode ? "Log In" : "Sign Up";
          toggleModeBtn.textContent = isLoginMode ? "Switch to Sign Up" : "Switch to Log In";
      });
  
      // password validation
      function isPasswordValid(password) {
        // regex to ensure pw is at least 8 char with 1 symbol, 1 uppercase, and 1 number
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(password);
      }
  
      // sign up form
      signupForm.addEventListener("submit", async (event) => {
          event.preventDefault();
  
          // gets inputs from user and trims whitespace
          const name = document.getElementById("signupName").value.trim();
          const email = document.getElementById("signupEmail").value.trim();
          const password = document.getElementById("signupPassword").value.trim();
  
          // ensures all fields are filled
          if (!name || !email || !password) {
              alert("Please fill in all required fields.");
              return;
          }
  
          // message if pw doesn't meet criteria
          if (!isPasswordValid(password)) {
              alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one symbol.");
              return;
          }
  
          try {
              // create new user in firebase
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
  
              // save data in firebase under user's UID
              await setDoc(doc(db, "users", user.uid), {
                  name: name,
                  email: email,
                  createdAt: new Date().toISOString()
              });
  
              // success or error message upon registering
              alert(`User ${user.email} registered successfully!`);
          } catch (error) {
              alert(`Error: ${error.message}`);
          }
      });
  
    // sign in form
     loginForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          
          // gets input from user and trims whitespace
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value.trim();
  
          if (!email || !password) {
              alert("Please fill in both email and password.");
              return;
          }
  
          try {
                  // sign in using firebase authentication
                  const userCredential = await signInWithEmailAndPassword(auth, email, password);
                  const user = userCredential.user;
  
                  alert(`Welcome back, ${user.email}!`);
              } catch (error) {
                  console.error("Login failed:", error);
                  alert(`Login failed: ${error.message}`);
              }
          });
  
      // open forgot password function
      forgotPasswordLink.addEventListener("click", (event) => {
          event.preventDefault();
          forgotPasswordModal.style.display = "block";
      });
  
      // close forgot password modal
      closeModal.addEventListener("click", () => {
          forgotPasswordModal.style.display = "none";
      });
  
      // close modal if user clicks elsewhere
      window.addEventListener("click", (event) => {
          if (event.target === forgotPasswordModal) {
              forgotPasswordModal.style.display = "none";
          }
      });
  
      // submit forgot password form
      document.getElementById("forgotPasswordForm").addEventListener("submit", (event) => {
          event.preventDefault();
  
          // get email address from modal
          const email = document.getElementById("modalEmail").value.trim();
  
          // ensure email is fileld
          if (!email) {
              alert("Email is required.");
              return;
          }
  
          // send email. is not fully implemented yet.
          alert("Check your email for reset instructions.");
          forgotPasswordModal.style.display = "none";
      });
  });
  
