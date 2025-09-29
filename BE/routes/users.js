const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { userValidation } = require('../middleware/validation');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Achievement = require('../models/Achievement');
const AchievementService = require('../services/achievementService');

// @desc    Get user progress and stats
// @route   GET /api/users/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get recent quiz attempts
    const recentAttempts = await QuizAttempt.find({ user: req.user.id })
      .populate('quiz', 'title category difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate additional stats
    const totalAttempts = await QuizAttempt.countDocuments({ user: req.user.id });
    const averageScore = await QuizAttempt.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    // Get user's achievements
    const userAchievements = await Achievement.find({
      _id: { $in: user.achievements.map(a => a.achievement) }
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          stats: user.stats,
          level: user.level,
          experience: user.experience
        },
        progress: {
          totalAttempts,
          averageScore: averageScore[0]?.avgScore || 0,
          recentAttempts,
          achievements: userAchievements
        }
      }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user progress'
    });
  }
});

// @desc    Get user achievements
// @route   GET /api/users/achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get all available achievements
    const allAchievements = await Achievement.find();
    
    // Get user's unlocked achievements
    const unlockedAchievements = await Achievement.find({
      _id: { $in: user.achievements.map(a => a.achievement) }
    });

    // Get locked achievements
    const lockedAchievements = allAchievements.filter(
      achievement => !user.achievements.some(ua => ua.achievement.toString() === achievement._id.toString())
    );

    res.json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        locked: lockedAchievements,
        totalUnlocked: unlockedAchievements.length,
        totalAvailable: allAchievements.length
      }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user achievements'
    });
  }
});

// @desc    Get user achievement progress
// @route   GET /api/users/achievements/progress
// @access  Private
router.get('/achievements/progress', protect, async (req, res) => {
  try {
    const achievementProgress = await AchievementService.getAchievementProgress(req.user.id);
    
    res.json({
      success: true,
      data: achievementProgress
    });
  } catch (error) {
    console.error('Get achievement progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievement progress'
    });
  }
});

// @desc    Get recent achievements
// @route   GET /api/users/achievements/recent
// @access  Private
router.get('/achievements/recent', protect, async (req, res) => {
  try {
    const recentAchievements = await AchievementService.getRecentAchievements(req.user.id, 5);
    
    res.json({
      success: true,
      data: recentAchievements
    });
  } catch (error) {
    console.error('Get recent achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent achievements'
    });
  }
});

// @desc    Get user stats and analytics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get detailed quiz attempt statistics
    const quizStats = await QuizAttempt.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalPoints: { $sum: '$pointsEarned' },
          bestScore: { $max: '$score' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    // Get category-wise performance
    const categoryStats = await QuizAttempt.aggregate([
      { $match: { user: req.user.id } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      {
        $group: {
          _id: '$quizData.category',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalPoints: { $sum: '$pointsEarned' }
        }
      }
    ]);

    // Get weekly progress (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyProgress = await QuizAttempt.aggregate([
      { 
        $match: { 
          user: req.user.id,
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          attempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalPoints: { $sum: '$pointsEarned' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          stats: user.stats,
          level: user.level,
          experience: user.experience
        },
        analytics: {
          overview: quizStats[0] || {
            totalAttempts: 0,
            averageScore: 0,
            totalPoints: 0,
            bestScore: 0,
            totalTimeSpent: 0
          },
          categoryPerformance: categoryStats,
          weeklyProgress
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user stats'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, validate(userValidation.updateProfile), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body.preferences },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @desc    Level up user
// @route   POST /api/users/level-up
// @access  Private
router.post('/level-up', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate new level based on experience
    const newLevel = Math.floor(user.experience / 1000) + 1;
    const experienceToNextLevel = (newLevel * 1000) - user.experience;
    
    if (newLevel > user.level) {
      // Level up the user
      await User.findByIdAndUpdate(req.user.id, {
        level: newLevel,
        $push: {
          achievements: {
            achievement: '507f1f77bcf86cd799439012', // Level up achievement ID
            unlockedAt: new Date()
          }
        }
      });

      res.json({
        success: true,
        data: {
          newLevel,
          experienceToNextLevel,
          leveledUp: true
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          currentLevel: user.level,
          experienceToNextLevel,
          leveledUp: false
        }
      });
    }
  } catch (error) {
    console.error('Level up error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during level up'
    });
  }
});

module.exports = router;
