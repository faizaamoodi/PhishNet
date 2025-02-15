let token;

document.getElementById("connect-btn").addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, (accessToken) => {
    if (chrome.runtime.lastError) {
      document.getElementById("status").textContent = "Failed to connect to Gmail.";
      console.error("Error connecting to Gmail:", chrome.runtime.lastError.message);
      return;
    }
    token = accessToken;
    document.getElementById("status").textContent = "Connected to Gmail!";
    document.getElementById("scan-btn").disabled = false;
  });
});

document.getElementById("scan-btn").addEventListener("click", async () => {
  document.getElementById("status").textContent = "Scanning your inbox...";
  try {
    const messages = await fetchGmailMessages(token);
    const scanResults = await analyzeMessages(messages);
    displayResults(scanResults);

    const confPhish = document.getElementById("conf-btn");
    const markSafe = document.getElementById("marksafe-btn");
    confPhish.style.display = "inline-block";
    markSafe.style.display = "inline-block";
    confPhish.disabled = false;
    markSafe.disabled = false;
    document.getElementById("status").textContent = "Scanning complete! Ready to confirm.";  
  } catch (error) {
    document.getElementById("status").textContent = "Failed to scan inbox. Please try again.";
    console.error("Error scanning inbox:", error);
  }
});

document.getElementById("marksafe-btn").addEventListener("click", () => {
  const resultsContainer = document.getElementById("results");
  const flaggedPhishingEmails = resultsContainer.querySelectorAll(".phishing");

  flaggedPhishingEmails.forEach((email) => {
    email.classList.remove("phishing");
    email.classList.add("safe");
    email.querySelector(".status").textContent = "Marked as Safe";
  });

  document.getElementById("status").textContent = "Selected emails marked as safe.";
});

async function fetchGmailMessages(accessToken) {
  const response = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  const data = await response.json();

  // If there are no messages, return empty array
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  const messagePromises = data.messages.map((message) =>
    fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json())
  );

  const messages = await Promise.all(messagePromises);
  return messages;
}

async function analyzeMessages(messages) {
  const results = [];
  console.log("Total messages to analyze:", messages.length); // Debugging log
  for (const message of messages) {
    const subject = message.payload.headers.find((h) => h.name === "Subject")?.value || "No Subject";
    const content = message.snippet || "No Content";
    console.log("Analyzing:", subject, content); // Debugging log
    const result = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content }),
    }).then((res) => res.json());

    console.log("Result:", result); // Debugging log
    results.push({ subject, content, status: result.result });
  }
  return results;
}

function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = results
    .map(
      (result) => `
      <div>
        <strong>${result.subject}</strong>: ${
        result.status === "Phishing" ? "Phishing" : "Safe"
      }
      </div>
    `
    )
    .join("");
  document.getElementById("status").textContent = "Scan complete!";
}
