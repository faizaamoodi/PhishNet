document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const title = document.getElementById("title");
  
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeModal = document.getElementById("closeModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  
    let isLoginMode = false;
  
    function saveDataToFile(filename, data) {
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      URL.revokeObjectURL(url);
    }
  
    function isPasswordValid(password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    }
  
    function isPhoneNumberValid(phone) {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phone);
    }
  
    toggleModeBtn.addEventListener("click", () => {
      if (isLoginMode) {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        title.textContent = "Sign Up";
        toggleModeBtn.textContent = "Switch to Log In";
        isLoginMode = false;
      } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        title.textContent = "Log In";
        toggleModeBtn.textContent = "Switch to Sign Up";
        isLoginMode = true;
      }
    });
  
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const phone = document.getElementById("signupPhone").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
  
      if (!name || !email || !password) {
        alert("Please fill in all required fields.");
        return;
      }
  
      if (phone && !isPhoneNumberValid(phone)) {
        alert("Phone number must be 10 digits.");
        return;
      }
  
      if (!isPasswordValid(password)) {
        alert(
          "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one symbol."
        );
        return;
      }
  
      const user = { name, email, phone: phone || "N/A", password };
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      existingUsers.push(user);
      localStorage.setItem("users", JSON.stringify(existingUsers));
  
      const signupData = `Sign-Up: Name: ${name}, Email: ${email}, Phone: ${phone || "N/A"}, Password: ${password}\n`;
      saveDataToFile("user_data.txt", signupData);
  
      alert("Sign-up successful.");
    });
  
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
  
      if (!email || !password) {
        alert("Please fill in your email and password.");
        return;
      }
  
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = existingUsers.find((user) => user.email === email && user.password === password);
  
      if (user) {
        alert(`Welcome, ${user.name}.`);
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  
    forgotPasswordLink.addEventListener("click", (event) => {
      event.preventDefault();
      forgotPasswordModal.style.display = "block";
    });
  
    closeModal.addEventListener("click", () => {
      forgotPasswordModal.style.display = "none";
    });
  
    window.addEventListener("click", (event) => {
      if (event.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
      }
    });
  
    forgotPasswordForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const email = document.getElementById("modalEmail").value.trim();
  
      if (!email) {
        alert("Email is required.");
        return;
      }
  
      alert("Check email for reset instructions.");
      forgotPasswordModal.style.display = "none";
    });
  });
