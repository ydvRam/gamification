const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { quizValidation } = require('../middleware/validation');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const AchievementService = require('../services/achievementService');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category && category !== 'undefined' && category !== 'null') filter.category = category;
    if (difficulty && difficulty !== 'undefined' && difficulty !== 'null') filter.difficulty = difficulty;
    if (search && search !== 'undefined' && search !== 'null') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const quizzes = await Quiz.find(filter)
      .select('-questions.correctAnswer') // Don't expose correct answers
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(filter);

    res.json({
      success: true,
      data: {
        quizzes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quizzes'
    });
  }
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer'); // Don't expose correct answers


    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }


    res.json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz'
    });
  }
});

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
router.post('/', protect, authorize('admin', 'teacher'), validate(quizValidation.create), async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quiz'
    });
  }
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin/Teacher)
router.put('/:id', protect, authorize('admin', 'teacher'), validate(quizValidation.update), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating quiz'
    });
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin/Teacher)
router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting quiz'
    });
  }
});

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private
router.post('/:id/attempt', protect, validate(quizValidation.submitAttempt), async (req, res) => {
  try {

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }


    // Calculate score
    let correctAnswers = 0;
    const { answers } = req.body;

    // Create a map for quick lookup
    const answersMap = {};
    answers.forEach(answer => {
      answersMap[answer.questionId] = answer.selectedAnswer;
    });

    quiz.questions.forEach((question, index) => {
      const userAnswer = answersMap[question._id] ?? answersMap[index.toString()];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const pointsEarned = Math.round((score / 100) * (quiz.totalPoints || 0));
    

    // Create quiz attempt with simplified logic
    
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && answer.selectedAnswer === question.correctAnswer;
      
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: isCorrect || false,
        timeSpent: answer.timeSpent || 0,
        points: isCorrect ? Math.round((quiz.totalPoints || 0) / quiz.questions.length) : 0
      };
    });


    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: req.params.id,
      answers: processedAnswers,
      score: score || 0,
      totalPoints: quiz.totalPoints || 0,
      timeSpent: req.body.timeSpent || 0,
      timeLimit: quiz.timeLimit || 0,
      correctAnswers: correctAnswers || 0,
      totalQuestions: quiz.questions.length || 0,
      difficulty: quiz.difficulty || 'beginner',
      category: quiz.category || 'general',
      pointsEarned: pointsEarned || 0,
      experienceGained: pointsEarned || 0,
      percentage: score || 0
    });

    // Update user stats
    try {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          'stats.totalQuizzes': 1,
          'stats.totalPoints': pointsEarned
        }
      }, { upsert: false });
    } catch (userUpdateError) {
      console.error('Error updating user stats:', userUpdateError);
      // Don't fail the quiz submission if user stats update fails
    }

    // Check and unlock achievements
    let newlyUnlockedAchievements = [];
    try {
      newlyUnlockedAchievements = await AchievementService.checkAndUnlockAchievements(req.user.id, {
        quizAttempt: {
          quizId: req.params.id,
          score,
          percentage: score,
          timeSpent: req.body.timeSpent || 0,
          timeLimit: quiz.timeLimit,
          category: quiz.category,
          difficulty: quiz.difficulty,
          pointsEarned
        }
      });
      
    } catch (achievementError) {
      console.error('Error checking achievements:', achievementError);
      // Don't fail the quiz submission if achievement checking fails
    }

    // Trigger real-time notifications
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('quiz-completed', {
          userId: req.user.id,
          quizId: req.params.id,
          score,
          pointsEarned,
          newlyUnlockedAchievements
        });
        
        // Send separate achievement unlock notifications
        if (newlyUnlockedAchievements.length > 0) {
          io.emit('achievement-unlocked', {
            userId: req.user.id,
            achievements: newlyUnlockedAchievements
          });
        }
        
      }
    } catch (socketError) {
      console.error('Error sending socket notification:', socketError);
      // Don't fail the quiz submission if socket fails
    }

    
    res.json({
      success: true,
      data: {
        attempt,
        score,
        pointsEarned,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        newlyUnlockedAchievements
      }
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quiz attempt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get quiz recommendations
// @route   GET /api/quizzes/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    // Get user's completed quizzes
    const completedQuizzes = await QuizAttempt.find({ user: req.user.id })
      .select('quiz')
      .populate('quiz', 'category difficulty');

    const completedQuizIds = completedQuizzes.map(attempt => attempt.quiz._id);

    // Get recommendations based on user preferences and performance
    const recommendations = await Quiz.find({
      _id: { $nin: completedQuizIds },
      difficulty: { $in: user.preferences.difficulty || ['beginner', 'intermediate'] },
      category: { $in: user.preferences.subjects || [] }
    })
    .limit(5)
    .select('-questions.correctAnswer');

    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recommendations'
    });
  }
});

module.exports = router;
