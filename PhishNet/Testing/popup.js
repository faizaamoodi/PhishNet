import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase-config';

const auth = getAuth(app);

let token;

document.getElementById("connect-btn").addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, (accessToken) => {
    if (chrome.runtime.lastError) {
      document.getElementById("status").textContent = "Failed to connect";
      console.error("Error connecting:", chrome.runtime.lastError.message);
      return;
    }
    token = accessToken;
    document.getElementById("status").textContent = "Connected to Gmail!";
    document.getElementById("scan-btn").disabled = false;
  });
});

document.getElementById("scan-btn").addEventListener("click", async () => {
  document.getElementById("status").textContent = "Scanning inbox...";
  try {
    const messages = await fetchGmailMessages(token);
    const scanResults = await analyzeMessages(messages);
    displayResults(scanResults);
  } catch (error) {
    document.getElementById("status").textContent = "Failed to scan. Please try again later.";
    console.error("Error:", error);
  }
});

document.getElementById("sign-up-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    document.getElementById("status").textContent = "Sign-up successful!";
  } catch (error) {
    console.error("Sign-up error:", error.message);
    document.getElementById("status").textContent = `Sign-up failed: ${error.message}`;
  }
});

document.getElementById("sign-in-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    document.getElementById("status").textContent = "Sign-in successful!";
  } catch (error) {
    console.error("Sign-in error:", error.message);
    document.getElementById("status").textContent = `Sign-in failed: ${error.message}`;
  }
});
