// js/home.js

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("masonry-grid");
    const statusMsg = document.getElementById("status-msg");

    const loadImages = async () => {
        try {
            // Endpoint: /api/v1/images/random
            const response = await window.api.get('/images/random');
            const images = response.data; // Your backend returns the array in .data

            if (!images || images.length === 0) {
                grid.innerHTML = "";
                statusMsg.textContent = "No artwork found. Be the first to upload!";
                statusMsg.classList.remove("hidden");
                return;
            }

            // Clear loading skeletons
            grid.innerHTML = "";

            // Render Images
            const html = images.map(img => {
                // Determine user public profile URL
                // Note: img.user.username comes from your aggregation pipeline
                const profileUrl = `public-profile.html?username=${img.user.username}`;
                
                return `
                <div class="break-inside-avoid mb-4 group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                    <img src="${img.imageFile}" 
                         alt="Artwork by ${img.user.username}" 
                         class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                         loading="lazy">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p class="text-white font-bold text-sm">@${img.user.username}</p>
                            <a href="${profileUrl}" class="text-xs text-gray-300 hover:text-white hover:underline mt-1 inline-block">View Profile</a>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            grid.innerHTML = html;

        } catch (error) {
            console.error("Error loading images:", error);
            statusMsg.textContent = "Failed to load gallery. Please try again later.";
            statusMsg.classList.remove("hidden");
            // Keep skeletons or clear grid? 
            // Usually better to keep skeletons or show a retry button
        }
    };

    loadImages();
});