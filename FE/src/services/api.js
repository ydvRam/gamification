const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Debug logging removed for cleaner console

      if (!response.ok) {
        throw new Error(data.message || data.errors || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Contact methods
  async sendContactMessage(messageData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  // Quiz methods
  async getQuizzes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/quizzes${queryString ? `?${queryString}` : ''}`);
  }

  async getQuiz(id) {
    return this.request(`/quizzes/${id}`);
  }

  async submitQuizAttempt(quizId, attemptData) {
    return this.request(`/quizzes/${quizId}/attempt`, {
      method: 'POST',
      body: JSON.stringify(attemptData)
    });
  }

  async getQuizRecommendations() {
    return this.request('/quizzes/recommendations');
  }

  // User methods
  async getUserProgress() {
    return this.request('/users/progress');
  }

  async getUserAchievements() {
    return this.request('/users/achievements');
  }

  async getAchievementProgress() {
    return this.request('/users/achievements/progress');
  }

  async getRecentAchievements() {
    return this.request('/users/achievements/recent');
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async updateUserPreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    });
  }

  async levelUp() {
    return this.request('/users/level-up', {
      method: 'POST'
    });
  }

  // Leaderboard methods
  async getLeaderboard(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard${queryString ? `?${queryString}` : ''}`);
  }

  async getWeeklyLeaderboard() {
    return this.request('/leaderboard/weekly');
  }

  async getMonthlyLeaderboard() {
    return this.request('/leaderboard/monthly');
  }

  async getUserRank() {
    return this.request('/leaderboard/rank');
  }

  // AI methods
  async getAIRecommendations(limit = 5) {
    return this.request(`/ai/recommendations?limit=${limit}`);
  }

  async getLearningInsights() {
    return this.request('/ai/insights');
  }

  async getLearningPath() {
    return this.request('/ai/learning-path');
  }

  async getPerformanceAnalytics() {
    return this.request('/ai/analytics');
  }

  async predictQuizPerformance(quizId) {
    return this.request(`/ai/predict/${quizId}`);
  }
}

export default new ApiService();
