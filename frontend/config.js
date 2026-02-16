// Backend Configuration
// Change this to switch between different backends

const CONFIG = {
    // OPTION 1: PythonAnywhere (when deployed)
    // BACKEND_URL: 'https://yourusername.pythonanywhere.com',
    
    // OPTION 2: Local Development (when running on your PC)
    BACKEND_URL: 'http://localhost:5000',
    
    // OPTION 3: VPS/Cloud Server (when you upgrade)
    // BACKEND_URL: 'https://your-server-ip:5000',
    
    // OPTION 4: Custom Domain (future)
    // BACKEND_URL: 'https://api.yourdownloader.com',
    
    // API Endpoints
    API: {
        INFO: '/api/info',
        DOWNLOAD: '/api/download',
        FORMATS: '/api/formats',
        HEALTH: '/api/health'
    },
    
    // Request timeout (milliseconds)
    TIMEOUT: 30000,
    
    // Enable debug mode
    DEBUG: true
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return CONFIG.BACKEND_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
