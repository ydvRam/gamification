const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  points: {
    type: Number,
    default: 0
  }
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  timeLimit: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned', 'timeout'],
    default: 'completed'
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  experienceGained: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }]
}, {
  timestamps: true
});

// Calculate percentage before saving
quizAttemptSchema.pre('save', function(next) {
  if (this.totalQuestions > 0) {
    this.percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  next();
});

// Get attempt summary
quizAttemptSchema.methods.getSummary = function() {
  return {
    score: this.score,
    percentage: this.percentage,
    correctAnswers: this.correctAnswers,
    totalQuestions: this.totalQuestions,
    timeSpent: this.timeSpent,
    pointsEarned: this.pointsEarned,
    experienceGained: this.experienceGained,
    status: this.status,
    completedAt: this.completedAt
  };
};

// Check if attempt is passing (70% or higher)
quizAttemptSchema.methods.isPassing = function() {
  return this.percentage >= 70;
};

// Get performance level
quizAttemptSchema.methods.getPerformanceLevel = function() {
  if (this.percentage >= 90) return 'excellent';
  if (this.percentage >= 80) return 'good';
  if (this.percentage >= 70) return 'satisfactory';
  return 'needs_improvement';
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
