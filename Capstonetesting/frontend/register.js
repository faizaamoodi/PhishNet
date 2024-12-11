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
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const phone = document.getElementById("signupPhone").value;
        const password = document.getElementById("signupPassword").value;

        if (!name || !email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        const params = new URLSearchParams({
            name,
            email,
            phone,
            action: "signup",
        }).toString();

        window.open(`success.html?${params}`, "_blank");
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Please fill in your email and password.");
            return;
        }

        const params = new URLSearchParams({
            email,
            action: "login",
        }).toString();

        window.open(`success.html?${params}`, "_blank");
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

        const email = document.getElementById("modalEmail").value;
        const phone = document.getElementById("modalPhone").value;

        if (!email) {
            alert("Email is required.");
            return;
        }

        const params = new URLSearchParams({
            email,
            phone,
            action: "forgot_password",
        }).toString();

        window.open(`success.html?${params}`, "_blank");
    });
});
