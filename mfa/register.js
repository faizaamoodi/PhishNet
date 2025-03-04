document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const title = document.getElementById("title");

    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeModal = document.getElementById("closeModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const otpField = document.getElementById("otpField");
    let isOtpVerified = false;

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
        // format for phone number
        const phoneRegex = /^\+?\d{1,15}$/;
        return phoneRegex.test(phone);
    }

    async function sendOtp(phone) {
        try {
            const response = await fetch("http://localhost:3000/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const result = await response.json();
            if (result.success) {
                alert("OTP sent to your phone.");
                otpField.style.display = "block";
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    }

    async function verifyOtp(phone, otp) {
        try {
            const response = await fetch("http://localhost:3000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        }
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

    // handle send OTP button-click
    sendOtpBtn.addEventListener("click", () => {
        const phone = document.getElementById("signupPhone").value.trim();
        if (isPhoneNumberValid(phone)) {
            sendOtp(phone);
        } else {
            alert("Please enter a valid phone number.");
        }
    });

    // signup form submission
    signupForm.addEventListener("submit", async(event) => {
        event.preventDefault();

        const phone = document.getElementById("signupPhone").value.trim();
        const otp = document.getElementById("otpCode").value.trim();

        if (otpField.style.display === "block" && !isOtpVerified) {
            isOtpVerified = await verifyOtp(phone, otp);
            if (!isOtpVerified) {
                alert("Invalid OTP. Please try again.");
                return;
            }
            alert("Phone number verified.");
        }

        if (isOtpVerified) {
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (!name || !email || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            if (!isPasswordValid(password)) {
                alert(
                    "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one symbol."
                );
                return;
            }

            const user = { name, email, phone, password };
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
            existingUsers.push(user);
            localStorage.setItem("users", JSON.stringify(existingUsers));

            const signupData = `Sign-Up: Name: ${name}, Email: ${email}, Phone: ${phone}, Password: ${password}\n`;
            saveDataToFile("user_data.txt", signupData);

            alert("Registration successful!");
        }
    });

    // forgot password functionality
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
