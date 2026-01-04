// js/public-profile.js

document.addEventListener("DOMContentLoaded", async () => {
    const gallery = document.getElementById("public-gallery");
    const header = document.getElementById("profile-header");
    const errorContainer = document.getElementById("error-container");

    // UI Elements
    const avatarEl = document.getElementById("profile-avatar");
    const nameEl = document.getElementById("profile-name");
    const usernameEl = document.getElementById("profile-username");
    const joinedEl = document.getElementById("profile-joined");

    // 1. Get Username from URL Query Parameter
    // Example: public-profile.html?username=john_doe
    const params = new URLSearchParams(window.location.search);
    const targetUsername = params.get("username");

    if (!targetUsername) {
        window.location.href = "index.html"; // Redirect if no username provided
        return;
    }

    // 2. Fetch User Data & Images
    try {
        // Endpoint: /api/v1/images/profile/:username
        // (Mapped to getImagesByUsername in image.controller.js)
        const response = await window.api.get(`/images/profile/${targetUsername}`);
        
        // Backend returns: { user: {...}, images: [...] }
        const { user, images } = response.data;

        // 3. Render Profile Header
        document.title = `${user.fullname} (@${user.username}) - Creative Showcase`;
        
        nameEl.textContent = user.fullname;
        usernameEl.textContent = `@${user.username}`;
        joinedEl.textContent = `Member since ${new Date(user.createdAt).toLocaleDateString()}`;
        
        if (user.avatar) {
            avatarEl.src = user.avatar;
        }

        // Fade in header
        header.classList.remove("opacity-0");

        // 4. Render Gallery
        if (images.length === 0) {
            gallery.innerHTML = `
                <div class="break-inside-avoid col-span-full text-center py-10">
                    <p class="text-gray-400">This user hasn't uploaded any artwork yet.</p>
                </div>`;
            return;
        }

        const html = images.map(img => `
            <div class="break-inside-avoid mb-4 group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                <img src="${img.imageFile}" 
                     alt="Artwork by ${user.username}" 
                     class="w-full h-auto object-cover" 
                     loading="lazy">
                
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
        `).join('');

        gallery.innerHTML = html;

    } catch (error) {
        console.error("Error fetching profile:", error);
        
        // Handle 404 (User not found)
        if (error.statusCode === 404) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
            errorContainer.classList.remove("hidden");
        } else {
            gallery.innerHTML = `<p class="text-red-500 text-center">Failed to load profile.</p>`;
        }
    }
});