import { clsx } from 'clsx';

// Class name utility
export const cn = (...inputs) => {
  return clsx(inputs);
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toLocaleString();
};

// Format time duration
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Calculate accuracy
export const calculateAccuracy = (correct, total) => {
  return calculatePercentage(correct, total);
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-success-600 bg-success-100',
    medium: 'text-warning-600 bg-warning-100',
    hard: 'text-danger-600 bg-danger-100',
  };
  return colors[difficulty] || colors.medium;
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    math: '🧮',
    science: '🔬',
    history: '📚',
    english: '📝',
    geography: '🌍',
    computer: '💻',
  };
  return icons[category] || '📖';
};

// Get rank badge class
export const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  return 'rank-other';
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  return password.length >= 8;
};

// Shuffle array
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate quiz score
export const calculateQuizScore = (answers, questions) => {
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === questions[index].correctAnswer) {
      correct++;
    }
  });
  return {
    correct,
    total: questions.length,
    percentage: calculatePercentage(correct, questions.length),
  };
};

// Get performance level
export const getPerformanceLevel = (accuracy) => {
  if (accuracy >= 90) return { level: 'Excellent', color: 'success' };
  if (accuracy >= 80) return { level: 'Good', color: 'primary' };
  if (accuracy >= 70) return { level: 'Fair', color: 'warning' };
  return { level: 'Needs Improvement', color: 'danger' };
};

// Calculate streak
export const calculateStreak = (quizHistory) => {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = quizHistory.length - 1; i >= 0; i--) {
    const quizDate = new Date(quizHistory[i].completedAt);
    quizDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - quizDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Get achievement progress
export const getAchievementProgress = (achievement, userStats) => {
  switch (achievement.id) {
    case 'quiz_master':
      return {
        current: userStats.totalQuizzes,
        target: 50,
        percentage: calculatePercentage(userStats.totalQuizzes, 50),
      };
    case 'streak_keeper':
      return {
        current: userStats.currentStreak,
        target: 7,
        percentage: calculatePercentage(userStats.currentStreak, 7),
      };
    case 'perfectionist':
      return {
        current: userStats.perfectQuizzes,
        target: 10,
        percentage: calculatePercentage(userStats.perfectQuizzes, 10),
      };
    default:
      return { current: 0, target: 1, percentage: 0 };
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};


