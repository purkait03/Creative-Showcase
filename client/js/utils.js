// js/utils.js

const utils = {
    /**
     * Format a date string (e.g., "2024-01-01") into a readable format (e.g., "Jan 1, 2024")
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Display an error message in a standard way
     * @param {string} elementId - The ID of the HTML element to show the error in
     * @param {string} message - The message to display
     */
    showError: (elementId, message) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
            el.classList.add('text-red-600', 'text-sm', 'text-center', 'mt-2');
        }
    },

    /**
     * Display a success message
     * @param {string} elementId 
     * @param {string} message 
     */
    showSuccess: (elementId, message) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
            el.classList.remove('text-red-600');
            el.classList.add('text-green-600', 'text-sm', 'text-center', 'mt-2');
        }
    }
};

// Make it globally available
window.utils = utils;