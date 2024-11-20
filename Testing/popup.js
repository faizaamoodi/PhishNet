let token;

document.getElementById("connect-btn").addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, (accessToken) => {
    if (chrome.runtime.lastError) {
      document.getElementById("status").textContent = "Failed to connect";
      console.error("Error connecting:", chrome.runtime.lastError.message);
      return;
    }
    token = accessToken;
    document.getElementById("status").textContent = "Connected to gmail!";
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
