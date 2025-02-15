document.getElementById('loginBtn').addEventListener('click', function() {
    chrome.tabs.create({ url: 'frontend/register.html' });
  });
