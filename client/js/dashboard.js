// js/dashboard.js

document.addEventListener("DOMContentLoaded", async () => {
    const gallery = document.getElementById("my-gallery");
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("image-file");
    const uploadBtn = document.getElementById("upload-btn");
    const uploadMsg = document.getElementById("upload-msg");
    const userNameDisplay = document.getElementById("user-name");
    const navAvatar = document.getElementById("nav-avatar");
    const publicProfileLink = document.getElementById("public-profile-link");

    // ---------------------------------------------------------
    // 1. Authorization Check & User Info Load
    // ---------------------------------------------------------
    let currentUser = null;

    try {
        // Fetch current user details from your backend
        // Endpoint: /api/v1/users/current-user
        const response = await window.api.get('/users/current-user');
        currentUser = response.data;

        // Update UI with user info
        if (currentUser) {
            userNameDisplay.textContent = currentUser.fullname || currentUser.username;
            if (currentUser.avatar) {
                navAvatar.src = currentUser.avatar;
            }
            // Set link to their public profile
            publicProfileLink.href = `public-profile.html?username=${currentUser.username}`;
        }

    } catch (error) {
        console.warn("User not authenticated, redirecting...", error);
        window.location.href = "login.html";
        return; // Stop execution
    }

    // ---------------------------------------------------------
    // 2. Fetch & Render User's Gallery
    // ---------------------------------------------------------
    const loadMyImages = async () => {
        try {
            // Endpoint: /api/v1/images/my-images (See image.routes.js)
            const response = await window.api.get('/images/my-images');
            
            // Backend returns: { user: {...}, images: [...], count: n }
            const images = response.data.images || [];

            if (images.length === 0) {
                gallery.innerHTML = `
                    <div class="break-inside-avoid col-span-full text-center py-10">
                        <p class="text-gray-400 text-lg">No images found.</p>
                        <p class="text-gray-500 text-sm">Upload your first artwork above!</p>
                    </div>`;
                return;
            }

            // Render Masonry Items
            gallery.innerHTML = images.map(img => `
                <div class="break-inside-avoid mb-4 group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow" id="card-${img._id}">
                    
                    <img src="${img.imageFile}" 
                         alt="My Upload" 
                         class="w-full h-auto object-cover" 
                         loading="lazy">
                    
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onclick="deleteImage('${img._id}')" 
                                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform scale-90 hover:scale-105 transition-transform"
                                title="Delete Image">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>

                    <div class="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                        ${new Date(img.createdAt).toLocaleDateString()}
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error("Failed to load gallery:", error);
            gallery.innerHTML = `<p class="text-red-500 text-center">Failed to load images.</p>`;
        }
    };

    // ---------------------------------------------------------
    // 3. Handle Image Upload
    // ---------------------------------------------------------
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) return;

        // Prepare UI
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Uploading...`;
        uploadMsg.classList.add('hidden');

        const formData = new FormData();
        // Backend expects 'image' field for the file (upload.single("image"))
        formData.append("image", file);

        try {
            // Endpoint: /api/v1/images/upload
            await window.api.post('/images/upload', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Success
            uploadMsg.textContent = "Image uploaded successfully!";
            uploadMsg.className = "text-sm font-medium text-green-600 mt-2";
            uploadMsg.classList.remove('hidden');
            
            uploadForm.reset();
            loadMyImages(); // Refresh the gallery immediately

        } catch (error) {
            // Error
            uploadMsg.textContent = error.message || "Upload failed. Please try again.";
            uploadMsg.className = "text-sm font-medium text-red-600 mt-2";
            uploadMsg.classList.remove('hidden');
        } finally {
            // Reset Button
            uploadBtn.disabled = false;
            uploadBtn.textContent = "Upload";
        }
    });

    // ---------------------------------------------------------
    // 4. Handle Delete (Global Function)
    // ---------------------------------------------------------
    // We attach this to window so the HTML onclick="..." can find it
    window.deleteImage = async (imageId) => {
        if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) {
            return;
        }

        try {
            // Endpoint: /api/v1/images/:imageId
            await window.api.delete(`/images/${imageId}`);
            
            // Remove the card from UI smoothly
            const card = document.getElementById(`card-${imageId}`);
            if (card) {
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            }
        } catch (error) {
            alert(error.message || "Failed to delete image");
        }
    };

    // Initial Load
    loadMyImages();
});