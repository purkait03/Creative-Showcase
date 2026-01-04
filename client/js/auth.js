// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // ---------------------------------------------------------
    // LOGIN LOGIC
    // ---------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const errorMsgId = "errorMsg"; // The ID of the <p> tag for errors in login.html
            const identifier = document.getElementById("loginIdentifier").value; // Email or Username
            const password = document.getElementById("password").value;

            // Prepare payload based on whether input looks like an email
            const payload = { password };
            if (identifier.includes('@')) {
                payload.email = identifier;
            } else {
                payload.username = identifier;
            }

            const btn = loginForm.querySelector("button");
            const originalBtnText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Logging in...";

            try {
                // Endpoint: /api/v1/users/login
                //
                const response = await window.api.post('/users/login', payload);
                
                // If successful, the httpOnly cookie is set automatically by the browser.
                // Redirect to dashboard
                window.location.href = "dashboard.html";

            } catch (error) {
                console.error("Login Error:", error);
                window.utils.showError(errorMsgId, error.message || "Invalid credentials. Please try again.");
                btn.disabled = false;
                btn.innerText = originalBtnText;
            }
        });
    }

    // ---------------------------------------------------------
    // REGISTRATION LOGIC
    // ---------------------------------------------------------
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const errorMsgId = "errorMsg";
            const fullname = document.getElementById("fullname").value;
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const avatarInput = document.getElementById("avatar");

            const btn = signupForm.querySelector("button");
            const originalBtnText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Creating Account...";

            // Create FormData object for file upload
            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);

            // Append avatar if selected
            if (avatarInput.files[0]) {
                formData.append("avatar", avatarInput.files[0]); // Matches upload.single("avatar")
            }

            try {
                // Endpoint: /api/v1/users/register
                //
                // Note: Axios automatically sets the Content-Type to multipart/form-data for FormData
                const response = await window.api.post('/users/register', formData);

                // Registration successful
                // Redirect to login or dashboard (depending on if your backend auto-logs in on register)
                // Your backend returns tokens on register, so we can go straight to dashboard
                window.location.href = "dashboard.html";

            } catch (error) {
                console.error("Signup Error:", error);
                window.utils.showError(errorMsgId, error.message || "Registration failed. Please try again.");
                btn.disabled = false;
                btn.innerText = originalBtnText;
            }
        });
    }
});