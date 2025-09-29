const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required']
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: ['quiz', 'streak', 'points', 'level', 'special', 'social']
  },
  type: {
    type: String,
    required: [true, 'Achievement type is required'],
    enum: ['single', 'cumulative', 'milestone', 'special']
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['quiz_count', 'points_earned', 'streak_days', 'level_reached', 'score_achieved', 'category_mastery', 'time_based']
    },
    value: {
      type: Number,
      required: function() {
        return this.type !== 'special';
      }
    },
    category: {
      type: String,
      required: function() {
        return this.type === 'category_mastery';
      },
      enum: ['math', 'science', 'history', 'language', 'geography', 'art']
    },
    difficulty: {
      type: String,
      required: function() {
        return this.type === 'score_achieved';
      },
      enum: ['beginner', 'intermediate', 'advanced']
    }
  },
  points: {
    type: Number,
    required: [true, 'Achievement points are required'],
    min: [1, 'Points must be at least 1']
  },
  experience: {
    type: Number,
    required: [true, 'Achievement experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  maxEarned: {
    type: Number,
    default: 1
  },
  currentEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Check if user meets criteria
achievementSchema.methods.checkCriteria = function(userStats, userAttempts) {
  switch (this.criteria.type) {
    case 'quiz_count':
      return userStats.totalQuizzes >= this.criteria.value;
    
    case 'points_earned':
      return userStats.totalPoints >= this.criteria.value;
    
    case 'streak_days':
      return userStats.currentStreak >= this.criteria.value;
    
    case 'level_reached':
      return userStats.level >= this.criteria.value;
    
    case 'score_achieved':
      if (this.criteria.difficulty) {
        const attempts = userAttempts.filter(attempt => 
          attempt.difficulty === this.criteria.difficulty
        );
        return attempts.some(attempt => attempt.percentage >= this.criteria.value);
      }
      return userAttempts.some(attempt => attempt.percentage >= this.criteria.value);
    
    case 'category_mastery':
      const categoryAttempts = userAttempts.filter(attempt => 
        attempt.category === this.criteria.category
      );
      return categoryAttempts.length >= this.criteria.value;
    
    case 'time_based':
      // Special time-based achievements (e.g., daily login)
      return false; // Implement based on specific requirements
    
    default:
      return false;
  }
};

// Get achievement rarity color
achievementSchema.methods.getRarityColor = function() {
  const colors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };
  return colors[this.rarity] || colors.common;
};

module.exports = mongoose.model('Achievement', achievementSchema);
