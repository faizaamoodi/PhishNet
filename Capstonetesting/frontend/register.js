let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let phoneField = document.getElementById("phoneField");
let title = document.getElementById("title");
let signupForm = document.getElementById("signupForm");

let forgotPasswordModal = document.getElementById("forgotPasswordModal");
let closeModal = document.getElementById("closeModal");
let forgotPasswordForm = document.getElementById("forgotPasswordForm");
let submitForgotPassword = document.getElementById("submitForgotPassword");
let confirmationMessage = document.getElementById("confirmationMessage");

signinBtn.onclick = function(){
    nameField.style.maxHeight = "0";
    phoneField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
}

signupBtn.onclick = function(){
    nameField.style.maxHeight = "60px";
    phoneField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
}

signupForm.onsubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long and contain at least one number and one symbol.");
        return;
    }

    console.log("Form submitted:");
    console.log("Name: " + name);
    console.log("Email: " + email);

    if (phone) {
        console.log("Phone Number: " + phone);
    }

    console.log("Password: " + password);


    signupForm.reset();
}

document.getElementById("forgotPasswordLink").onclick = function() {
    forgotPasswordModal.style.display = "block";
}

closeModal.onclick = function() {
    forgotPasswordModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
    }
}

forgotPasswordForm.onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById("modalEmail").value;
    const phone = document.getElementById("modalPhone").value;

    if (!email) {
        alert("Email is required.");
        return;
    }

    confirmationMessage.style.display = "block";
    forgotPasswordForm.reset();
}