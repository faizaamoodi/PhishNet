console.log("PhishNet Content Script Loaded");

function addPhishingIndicators() {
    console.log("🔍 Scanning emails...");
  
    chrome.storage.local.get("scanResults", (data) => {
      if (!data.scanResults) {
        console.warn("⚠️ No scan results found");
        return;
      }
  
      const scanResults = data.scanResults;
      const emailRows = document.querySelectorAll('tr.zA.zE');
  
      emailRows.forEach(row => {
        if (row.dataset.phishnetChecked) return;
        row.dataset.phishnetChecked = true;
  
        const subjectElement = row.querySelector('span.bog');
        if (!subjectElement) {
          console.warn(`⚠️ Could not find subject element in row:`, row);
          return;
        }
  
        const subject = subjectElement.innerText.trim();
        console.log(`Checking email: "${subject}"`);
  
        const result = scanResults.find(email => email.subject === subject);
        if (!result) {
          console.warn(`⚠️ No stored result found for "${subject}"`);
          return;
        }
  
        console.log(`Adding label for "${subject}": ${result.status}`);
  
        const label = document.createElement("span");
        label.textContent = result.status === "Phishing" ? " 🔴" : " 🟢";
        label.className = "phishing-label";
        label.style.color = result.status === "Phishing" ? "red" : "green";
        label.style.fontWeight = "bold";
        label.style.marginLeft = "8px";
        label.style.fontSize = "16px";
  
        subjectElement.appendChild(label);
      });
    });
  }
  

const observer = new MutationObserver(() => {
    addPhishingIndicators();
});
observer.observe(document.body, { childList: true, subtree: true });

console.log("🟢 Phishing indicators script initialized.");