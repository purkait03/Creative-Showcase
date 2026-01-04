// js/api.js

// Initialize Axios
const api = axios.create({
    baseURL: '/api/v1',  // <--- RELATIVE PATH
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response Interceptor: Clean up the response data
api.interceptors.response.use(
    (response) => {
        // Your backend returns: { statusCode, data, message, success }
        // We return just the 'data' part for easier use in UI
        return response.data; 
    },
    (error) => {
        // If error has a response from backend (e.g., 400, 401)
        if (error.response) {
            // Return the backend's error message if available
            // Your ApiError usually throws JSON, so we look for error.response.data.message
            const customError = new Error(error.response.data.message || "Something went wrong");
            customError.statusCode = error.response.status;
            return Promise.reject(customError);
        }
        
        // Network errors (server down, etc.)
        return Promise.reject(error);
    }
);

// Global export
window.api = api;