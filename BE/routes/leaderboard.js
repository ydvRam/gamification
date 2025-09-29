const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get overall leaderboard
// @route   GET /api/leaderboard
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    // Get users sorted by total points
    const users = await User.find({ isActive: true })
      .select('firstName lastName stats level experience')
      .sort({ 'stats.totalPoints': -1, 'stats.totalQuizzes': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPoints: user.stats.totalPoints,
      totalQuizzes: user.stats.totalQuizzes,
      level: user.level,
      experience: user.experience
    }));

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @desc    Get weekly leaderboard
// @route   GET /api/leaderboard/weekly
// @access  Public
router.get('/weekly', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    // Get start of current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get weekly quiz attempts and calculate points
    const weeklyStats = await QuizAttempt.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$pointsEarned' },
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      {
        $match: {
          'userData.isActive': true
        }
      },
      {
        $project: {
          _id: 1,
          firstName: '$userData.firstName',
          lastName: '$userData.lastName',
          totalPoints: 1,
          totalQuizzes: 1,
          averageScore: 1,
          level: '$userData.level',
          experience: '$userData.experience'
        }
      },
      {
        $sort: { totalPoints: -1, totalQuizzes: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit * 1
      }
    ]);

    // Add rank to each user
    const leaderboard = weeklyStats.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPoints: user.totalPoints,
      totalQuizzes: user.totalQuizzes,
      averageScore: Math.round(user.averageScore),
      level: user.level,
      experience: user.experience
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        period: 'weekly',
        startDate: startOfWeek
      }
    });
  } catch (error) {
    console.error('Get weekly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching weekly leaderboard'
    });
  }
});

// @desc    Get monthly leaderboard
// @route   GET /api/leaderboard/monthly
// @access  Public
router.get('/monthly', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get monthly quiz attempts and calculate points
    const monthlyStats = await QuizAttempt.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$pointsEarned' },
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      {
        $match: {
          'userData.isActive': true
        }
      },
      {
        $project: {
          _id: 1,
          firstName: '$userData.firstName',
          lastName: '$userData.lastName',
          totalPoints: 1,
          totalQuizzes: 1,
          averageScore: 1,
          level: '$userData.level',
          experience: '$userData.experience'
        }
      },
      {
        $sort: { totalPoints: -1, totalQuizzes: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit * 1
      }
    ]);

    // Add rank to each user
    const leaderboard = monthlyStats.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPoints: user.totalPoints,
      totalQuizzes: user.totalQuizzes,
      averageScore: Math.round(user.averageScore),
      level: user.level,
      experience: user.experience
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        period: 'monthly',
        startDate: startOfMonth
      }
    });
  } catch (error) {
    console.error('Get monthly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching monthly leaderboard'
    });
  }
});

// @desc    Get user's rank
// @route   GET /api/leaderboard/rank
// @access  Private
router.get('/rank', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get user's rank in overall leaderboard
    const overallRank = await User.countDocuments({
      isActive: true,
      $or: [
        { 'stats.totalPoints': { $gt: user.stats.totalPoints } },
        {
          'stats.totalPoints': user.stats.totalPoints,
          'stats.totalQuizzes': { $gt: user.stats.totalQuizzes }
        }
      ]
    }) + 1;

    // Get user's rank in weekly leaderboard
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyPoints = await QuizAttempt.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$pointsEarned' }
        }
      }
    ]);

    const userWeeklyPoints = weeklyPoints[0]?.totalPoints || 0;

    const weeklyRank = await QuizAttempt.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$pointsEarned' }
        }
      },
      {
        $match: {
          $or: [
            { totalPoints: { $gt: userWeeklyPoints } }
          ]
        }
      },
      {
        $count: 'count'
      }
    ]);

    const weeklyRankPosition = (weeklyRank[0]?.count || 0) + 1;

    res.json({
      success: true,
      data: {
        overall: {
          rank: overallRank,
          totalPoints: user.stats.totalPoints,
          totalQuizzes: user.stats.totalQuizzes
        },
        weekly: {
          rank: weeklyRankPosition,
          totalPoints: userWeeklyPoints
        }
      }
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user rank'
    });
  }
});

module.exports = router;
