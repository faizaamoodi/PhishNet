import app from './firebase-config'; // Adjust the path if needed

chrome.runtime.onInstalled.addListener(() => {
  console.log("PhishNet extension installed!");
});
