const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Quiz category is required'],
    enum: ['math', 'science', 'history', 'language', 'geography', 'art']
  },
  difficulty: {
    type: String,
    required: [true, 'Quiz difficulty is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute'],
    max: [120, 'Time limit cannot exceed 120 minutes']
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    }
  }]
}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  }
  next();
});

// Calculate average score
quizSchema.methods.calculateAverageScore = function() {
  if (this.attempts > 0) {
    this.averageScore = this.ratings.reduce((sum, rating) => sum + rating.rating, 0) / this.ratings.length;
  }
};

// Get quiz statistics
quizSchema.methods.getStats = function() {
  return {
    totalQuestions: this.questions.length,
    totalPoints: this.totalPoints,
    timeLimit: this.timeLimit,
    attempts: this.attempts,
    averageScore: this.averageScore,
    rating: this.rating
  };
};

module.exports = mongoose.model('Quiz', quizSchema);
