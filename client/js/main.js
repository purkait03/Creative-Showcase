// js/main.js

document.addEventListener("DOMContentLoaded", async () => {
    const guestNav = document.getElementById("guest-nav");
    const userNav = document.getElementById("user-nav");
    const navUsername = document.getElementById("nav-username");
    const logoutBtn = document.getElementById("logout-btn");

    // 1. Check Authentication Status
    try {
        // Endpoint: /api/v1/users/current-user
        const response = await window.api.get('/users/current-user');
        
        if (response.data) {
            // User is logged in
            const user = response.data;
            
            // SAFETY CHECK: Only update if element exists (Fixes Dashboard crash)
            if (navUsername) {
                navUsername.textContent = user.username || "Artist";
            }
            
            // Toggle Nav items (only if they exist)
            if (guestNav) guestNav.classList.add("hidden");
            if (userNav) userNav.classList.remove("hidden");
        }
    } catch (error) {
        // Not logged in
        if (guestNav) guestNav.classList.remove("hidden");
        if (userNav) userNav.classList.add("hidden");
    }

    // 2. Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                // Important: secure: false must be set in backend controller for this to work on localhost
                await window.api.post('/users/logout');
                
                // Redirect to login
                window.location.href = "login.html";
            } catch (error) {
                console.error("Logout failed", error);
                // Force redirect even if API fails (fallback)
                window.location.href = "login.html";
            }
        });
    }
});