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

document.getElementById("loginBtn").addEventListener("click", function() {
    chrome.tabs.create({ url: "mfa/index.html" });
});

document.getElementById("scan-btn").addEventListener("click", async () => {
  document.getElementById("status").textContent = "Scanning your inbox...";
  try {
    const messages = await fetchGmailMessages(token);
    const scanResults = await analyzeMessages(messages);
    displayResults(scanResults);
  } catch (error) {
    document.getElementById("status").textContent = "Failed to scan inbox. Please try again.";
    console.error("Error scanning inbox:", error);
  }
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
  if (!data.messages || data.messages.length === 0) {
    return [];
  }
  const messagePromises = data.messages.map((message) =>
    fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json())
  );
  return await Promise.all(messagePromises);
}

async function analyzeMessages(messages) {
  const results = [];
  for (const message of messages) {
    const subject = message.payload.headers.find((h) => h.name === "Subject")?.value || "No Subject";
    const content = message.snippet || "No Content";
    const result = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content }),
    }).then((res) => res.json());
    results.push({ subject, content, status: result.result });
  }
  return results;
}

function displayResults(results) {
  console.log("Results:", results);

  // Store results
  chrome.storage.local.set({ scanResults: results }, () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "updateLabels"});
    });
  });



  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = results
    .map(
      (result) => `
      <div>
        <strong>${result.subject}</strong>: ${
          result.status === "Phishing" ? "🔴 Phishing" : "🟢 Safe"
        }
      </div>`
    )
    .join("");

  document.getElementById("download-pdf-btn").disabled = false;
  document.getElementById("status").textContent = "Scan complete!";
  window.scanResults = results;
}

document.getElementById("download-pdf-btn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm',
    margins: { top: 20, right: 20, bottom: 20, left: 20 }
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setFontSize(18);
  doc.text("Scan Results", 20, 20);
  doc.setFontSize(12);
  let yPosition = 30;
  function addMultiLineText(text, x, y, maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * 7);
  }

  window.scanResults.forEach((result, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    yPosition = addMultiLineText(`Subject: ${result.subject}`, 20, yPosition, 170);
    yPosition += 5;
    doc.text(`Status: ${result.status === "Phishing" ? "🔴 Phishing" : "🟢 Safe"}`, 20, yPosition);
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
  });
  doc.save("scan_results.pdf");
});
