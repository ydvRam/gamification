// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// App Configuration
export const APP_CONFIG = {
  name: 'EduGame',
  version: '1.0.0',
  description: 'Educational Gamification App',
};

// Quiz Configuration
export const QUIZ_CONFIG = {
  difficulties: [
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'danger' },
  ],
  categories: [
    { value: 'math', label: 'Mathematics', icon: '🧮' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'history', label: 'History', icon: '📚' },
    { value: 'english', label: 'English', icon: '📝' },
    { value: 'geography', label: 'Geography', icon: '🌍' },
    { value: 'computer', label: 'Computer Science', icon: '💻' },
  ],
  timeLimits: [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
  ],
};

// Achievement Configuration
export const ACHIEVEMENT_TYPES = {
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🏆',
    points: 500,
  },
  STREAK_KEEPER: {
    id: 'streak_keeper',
    name: 'Streak Keeper',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    points: 300,
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 100% on 10 quizzes',
    icon: '💯',
    points: 400,
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 20 quizzes under time limit',
    icon: '⚡',
    points: 350,
  },
  RISING_STAR: {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach top 10 in leaderboard',
    icon: '⭐',
    points: 600,
  },
};

// Leaderboard Configuration
export const LEADERBOARD_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'all-time', label: 'All Time' },
];

// User Stats Configuration
export const USER_STATS = {
  initialPoints: 0,
  initialStreak: 0,
  initialRank: 999,
  initialAccuracy: 0,
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  QUIZ_PROGRESS: 'quizProgress',
  THEME: 'theme',
};

// Toast Messages
export const TOAST_MESSAGES = {
  QUIZ_COMPLETED: 'Quiz completed successfully! 🎉',
  ACHIEVEMENT_EARNED: 'New achievement unlocked! 🏆',
  STREAK_UPDATED: 'Streak updated! Keep it up! 🔥',
  POINTS_EARNED: 'Points earned! ⭐',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  LOGIN_SUCCESS: 'Welcome back! 👋',
  LOGOUT_SUCCESS: 'Logged out successfully.',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  QUIZZES: {
    LIST: '/quizzes',
    DETAIL: '/quizzes/:id',
    ATTEMPT: '/quizzes/:id/attempt',
    RECOMMENDATIONS: '/quizzes/recommendations',
  },
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    ACHIEVEMENTS: '/users/achievements',
  },
  LEADERBOARD: {
    LIST: '/leaderboard',
    CATEGORY: '/leaderboard/:category',
    PERIOD: '/leaderboard/:period',
  },
  AI: {
    RECOMMENDATIONS: '/ai/recommendations/:userId',
    INSIGHTS: '/ai/insights/:userId',
  },
};


