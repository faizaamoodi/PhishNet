chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`📬 Received request:`, message);

  if (message.action === "analyzeEmail") {
      fetch("http://127.0.0.1:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: message.subject, content: "" }) // Ensure correct data structure
      })
      .then(response => response.json())
      .then(data => {
          console.log(`📤 Sending response to content script:`, data);
          sendResponse(data);
      })
      .catch(error => {
          console.error("❌ Backend request failed:", error);
          sendResponse({ result: "Safe" });
      });

      return true;
  }
});

async function analyzeEmail(subject, content) {
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content }),
    });

    if (!response.ok) {
      console.error(`⚠️ API request failed: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Received response for "${subject}":`, result);
    return result;
  } catch (error) {
    console.error("❌ Failed to analyze email:", error);
    return { result: "Unknown" };
  }
}
