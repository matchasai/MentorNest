// API base URL - will be replaced by environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios-like API instance
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Student endpoints
  async getProfile(token) {
    return this.request('/students/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getCourses(token) {
    return this.request('/courses', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Mentor endpoints
  async getMentors() {
    return this.request('/mentors');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export API instance
const api = new APIClient(API_BASE_URL);
export default api;