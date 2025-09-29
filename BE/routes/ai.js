const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AIService = require('../services/aiService');

// @desc    Get AI-powered quiz recommendations
// @route   GET /api/ai/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const result = await AIService.getPersonalizedRecommendations(
      req.user.id,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating recommendations'
    });
  }
});

// @desc    Get learning insights and suggestions
// @route   GET /api/ai/insights
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const insights = await AIService.generateLearningInsights(req.user.id);

    res.json({
      success: true,
      data: { insights }
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating insights'
    });
  }
});

// @desc    Predict quiz performance
// @route   GET /api/ai/predict/:quizId
// @access  Private
router.get('/predict/:quizId', protect, async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const prediction = await AIService.predictPerformance(req.user.id, quizId);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: { prediction }
    });
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating prediction'
    });
  }
});

// @desc    Get personalized learning path
// @route   GET /api/ai/learning-path
// @access  Private
router.get('/learning-path', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const recommendations = await AIService.getPersonalizedRecommendations(req.user.id, 10);
    const insights = await AIService.generateLearningInsights(req.user.id);

    // Create a structured learning path
    const learningPath = {
      currentLevel: user.level,
      nextMilestone: (user.level + 1) * 1000,
      progress: (user.experience / ((user.level + 1) * 1000)) * 100,
      recommendations: recommendations.recommendations,
      insights: insights,
      suggestedActions: []
    };

    // Add suggested actions based on analysis
    if (recommendations.analysis.weakAreas.length > 0) {
      learningPath.suggestedActions.push({
        type: 'focus',
        message: `Focus on ${recommendations.analysis.weakAreas[0].category} to improve your weak areas`,
        priority: 'high'
      });
    }

    if (recommendations.analysis.performance.improvementTrend === 'declining') {
      learningPath.suggestedActions.push({
        type: 'review',
        message: 'Review easier topics to rebuild confidence',
        priority: 'medium'
      });
    }

    if (user.stats.currentStreak < 3) {
      learningPath.suggestedActions.push({
        type: 'consistency',
        message: 'Try to maintain a daily learning streak',
        priority: 'medium'
      });
    }

    res.json({
      success: true,
      data: { learningPath }
    });
  } catch (error) {
    console.error('Learning path error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating learning path'
    });
  }
});

// @desc    Get performance analytics
// @route   GET /api/ai/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const QuizAttempt = require('../models/QuizAttempt');
    const User = require('../models/User');

    const user = await User.findById(req.user.id);
    const attempts = await QuizAttempt.find({ user: req.user.id })
      .populate('quiz', 'category difficulty title');

    // Generate comprehensive analytics
    const analytics = {
      overview: {
        totalQuizzes: attempts.length,
        averageScore: attempts.length > 0 ? 
          Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0,
        totalPoints: user.stats.totalPoints,
        currentLevel: user.level,
        experience: user.experience
      },
      performance: AIService.analyzeUserPerformance(attempts),
      categoryBreakdown: {},
      difficultyBreakdown: {},
      timeAnalysis: {},
      trends: {}
    };

    // Category breakdown
    const categories = ['math', 'science', 'history', 'language', 'geography', 'art'];
    categories.forEach(category => {
      const categoryAttempts = attempts.filter(a => a.quiz.category === category);
      analytics.categoryBreakdown[category] = {
        attempts: categoryAttempts.length,
        averageScore: categoryAttempts.length > 0 ? 
          Math.round(categoryAttempts.reduce((sum, a) => sum + a.score, 0) / categoryAttempts.length) : 0,
        totalPoints: categoryAttempts.reduce((sum, a) => sum + a.pointsEarned, 0)
      };
    });

    // Difficulty breakdown
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    difficulties.forEach(difficulty => {
      const difficultyAttempts = attempts.filter(a => a.quiz.difficulty === difficulty);
      analytics.difficultyBreakdown[difficulty] = {
        attempts: difficultyAttempts.length,
        averageScore: difficultyAttempts.length > 0 ? 
          Math.round(difficultyAttempts.reduce((sum, a) => sum + a.score, 0) / difficultyAttempts.length) : 0,
        totalPoints: difficultyAttempts.reduce((sum, a) => sum + a.pointsEarned, 0)
      };
    });

    // Time analysis (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAttempts = attempts.filter(a => a.createdAt >= thirtyDaysAgo);
    analytics.timeAnalysis = {
      last30Days: {
        attempts: recentAttempts.length,
        averageScore: recentAttempts.length > 0 ? 
          Math.round(recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length) : 0,
        totalPoints: recentAttempts.reduce((sum, a) => sum + a.pointsEarned, 0)
      }
    };

    // Weekly trends
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayAttempts = attempts.filter(a => 
        a.createdAt >= date && a.createdAt < nextDate
      );
      
      weeklyData.push({
        date: date.toISOString().split('T')[0],
        attempts: dayAttempts.length,
        averageScore: dayAttempts.length > 0 ? 
          Math.round(dayAttempts.reduce((sum, a) => sum + a.score, 0) / dayAttempts.length) : 0,
        totalPoints: dayAttempts.reduce((sum, a) => sum + a.pointsEarned, 0)
      });
    }
    
    analytics.trends.weekly = weeklyData;

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating analytics'
    });
  }
});

module.exports = router;
