document.getElementById('loginBtn').addEventListener('click', function() {
    chrome.tabs.create({ url: 'register.html' });
  });