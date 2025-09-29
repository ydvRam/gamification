const Achievement = require('../models/Achievement');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');

class AchievementService {
  /**
   * Check and unlock achievements for a user based on their current stats
   * @param {string} userId - User ID
   * @param {Object} context - Additional context (quiz attempt, etc.)
   * @returns {Array} - Array of newly unlocked achievements
   */
  static async checkAndUnlockAchievements(userId, context = {}) {
    try {
      console.log('🔍 Checking achievements for user:', userId);
      
      // Get user with current stats
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user's current achievements
      const userAchievementIds = user.achievements.map(ua => ua.achievement.toString());
      
      // Get all available achievements
      const allAchievements = await Achievement.find({ isActive: true });
      
      // Get user's quiz attempts for context
      const userAttempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty totalPoints');
      
      // Get user stats for achievement checking
      const userStats = {
        totalPoints: user.stats.totalPoints,
        totalQuizzes: user.stats.totalQuizzes,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        level: user.stats.level,
        experience: user.stats.experience
      };

      const newlyUnlockedAchievements = [];

      // Check each achievement
      for (const achievement of allAchievements) {
        // Skip if already unlocked
        if (userAchievementIds.includes(achievement._id.toString())) {
          continue;
        }

        // Check if user meets criteria
        const meetsCriteria = await this.checkAchievementCriteria(
          achievement, 
          userStats, 
          userAttempts, 
          context
        );

        if (meetsCriteria) {
          console.log('🎉 Achievement unlocked:', achievement.name);
          
          // Add achievement to user
          await User.findByIdAndUpdate(userId, {
            $push: {
              achievements: {
                achievement: achievement._id,
                earnedAt: new Date()
              }
            },
            $inc: {
              'stats.totalPoints': achievement.points,
              'stats.experience': achievement.experience
            }
          });

          // Update user stats if needed
          await this.updateUserStatsForAchievement(userId, achievement);

          newlyUnlockedAchievements.push({
            ...achievement.toObject(),
            earnedAt: new Date()
          });
        }
      }

      // Check for level up after potential achievement unlocks
      await this.checkLevelUp(userId);

      return newlyUnlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  /**
   * Check if user meets specific achievement criteria
   * @param {Object} achievement - Achievement object
   * @param {Object} userStats - User statistics
   * @param {Array} userAttempts - User's quiz attempts
   * @param {Object} context - Additional context
   * @returns {boolean} - Whether criteria is met
   */
  static async checkAchievementCriteria(achievement, userStats, userAttempts, context) {
    try {
      const { criteria } = achievement;

      switch (criteria.type) {
        case 'quiz_count':
          return userStats.totalQuizzes >= criteria.value;

        case 'points_earned':
          return userStats.totalPoints >= criteria.value;

        case 'streak_days':
          return userStats.currentStreak >= criteria.value;

        case 'level_reached':
          return userStats.level >= criteria.value;

        case 'score_achieved':
          if (criteria.difficulty) {
            const attempts = userAttempts.filter(attempt => 
              attempt.quiz && attempt.quiz.difficulty === criteria.difficulty
            );
            return attempts.some(attempt => attempt.percentage >= criteria.value);
          }
          return userAttempts.some(attempt => attempt.percentage >= criteria.value);

        case 'category_mastery':
          const categoryAttempts = userAttempts.filter(attempt => 
            attempt.quiz && attempt.quiz.category === criteria.category
          );
          return categoryAttempts.length >= criteria.value;

        case 'perfect_score':
          // Check for perfect scores (100%)
          return userAttempts.some(attempt => attempt.percentage === 100);

        case 'speed_demon':
          // Check for fast quiz completions (under time limit)
          if (context.quizAttempt) {
            const timeRatio = context.quizAttempt.timeSpent / (context.quizAttempt.timeLimit * 60);
            return timeRatio <= 0.5; // Completed in half the time
          }
          return false;

        case 'streak_master':
          // Check for specific streak milestones
          return userStats.currentStreak >= criteria.value;

        case 'points_milestone':
          // Check for specific point milestones
          return userStats.totalPoints >= criteria.value;

        case 'quiz_master':
          // Check for completing quizzes in all categories
          const categories = ['math', 'science', 'history', 'language', 'geography', 'art'];
          const completedCategories = new Set();
          
          userAttempts.forEach(attempt => {
            if (attempt.quiz && attempt.quiz.category) {
              completedCategories.add(attempt.quiz.category);
            }
          });
          
          return completedCategories.size >= categories.length;

        default:
          console.warn('Unknown achievement criteria type:', criteria.type);
          return false;
      }
    } catch (error) {
      console.error('Error checking achievement criteria:', error);
      return false;
    }
  }

  /**
   * Update user stats based on achievement unlocked
   * @param {string} userId - User ID
   * @param {Object} achievement - Achievement object
   */
  static async updateUserStatsForAchievement(userId, achievement) {
    try {
      const updateFields = {};

      // Update specific stats based on achievement type
      switch (achievement.category) {
        case 'points':
          updateFields['stats.totalPoints'] = achievement.points;
          break;
        case 'streak':
          // Streak achievements might affect current streak
          break;
        case 'level':
          // Level achievements might affect level directly
          break;
        case 'quiz':
          // Quiz achievements might affect total quizzes
          break;
      }

      if (Object.keys(updateFields).length > 0) {
        await User.findByIdAndUpdate(userId, { $inc: updateFields });
      }
    } catch (error) {
      console.error('Error updating user stats for achievement:', error);
    }
  }

  /**
   * Check if user should level up and update accordingly
   * @param {string} userId - User ID
   */
  static async checkLevelUp(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Calculate level based on experience (1000 XP per level)
      const newLevel = Math.floor(user.stats.experience / 1000) + 1;
      
      if (newLevel > user.stats.level) {
        console.log(`🎊 User ${userId} leveled up to level ${newLevel}!`);
        
        await User.findByIdAndUpdate(userId, {
          'stats.level': newLevel
        });

        // Check for level-based achievements
        await this.checkAndUnlockAchievements(userId, { levelUp: true });
      }
    } catch (error) {
      console.error('Error checking level up:', error);
    }
  }

  /**
   * Get achievement progress for a user
   * @param {string} userId - User ID
   * @returns {Object} - Achievement progress data
   */
  static async getAchievementProgress(userId) {
    try {
      const user = await User.findById(userId);
      const allAchievements = await Achievement.find({ isActive: true });
      const userAchievementIds = user.achievements.map(ua => ua.achievement.toString());
      const userAttempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty totalPoints');

      const userStats = {
        totalPoints: user.stats.totalPoints,
        totalQuizzes: user.stats.totalQuizzes,
        currentStreak: user.stats.currentStreak,
        longestStreak: user.stats.longestStreak,
        level: user.stats.level,
        experience: user.stats.experience
      };

      const progress = allAchievements.map(achievement => {
        const isUnlocked = userAchievementIds.includes(achievement._id.toString());
        let currentProgress = 0;
        let maxProgress = 1;
        let progressPercentage = isUnlocked ? 100 : 0;

        // Calculate progress for locked achievements
        if (!isUnlocked) {
          switch (achievement.criteria.type) {
            case 'quiz_count':
              currentProgress = userStats.totalQuizzes;
              maxProgress = achievement.criteria.value;
              break;
            case 'points_earned':
              currentProgress = userStats.totalPoints;
              maxProgress = achievement.criteria.value;
              break;
            case 'streak_days':
              currentProgress = userStats.currentStreak;
              maxProgress = achievement.criteria.value;
              break;
            case 'level_reached':
              currentProgress = userStats.level;
              maxProgress = achievement.criteria.value;
              break;
            case 'category_mastery':
              const categoryAttempts = userAttempts.filter(attempt => 
                attempt.quiz && attempt.quiz.category === achievement.criteria.category
              );
              currentProgress = categoryAttempts.length;
              maxProgress = achievement.criteria.value;
              break;
          }
          
          progressPercentage = Math.min(100, Math.round((currentProgress / maxProgress) * 100));
        }

        return {
          ...achievement.toObject(),
          isUnlocked,
          currentProgress,
          maxProgress,
          progressPercentage
        };
      });

      return progress;
    } catch (error) {
      console.error('Error getting achievement progress:', error);
      return [];
    }
  }

  /**
   * Get recently unlocked achievements for notifications
   * @param {string} userId - User ID
   * @param {number} limit - Number of recent achievements to return
   * @returns {Array} - Recent achievements
   */
  static async getRecentAchievements(userId, limit = 5) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'achievements.achievement',
          model: 'Achievement'
        });

      const recentAchievements = user.achievements
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, limit)
        .map(ua => ({
          ...ua.achievement.toObject(),
          earnedAt: ua.earnedAt
        }));

      return recentAchievements;
    } catch (error) {
      console.error('Error getting recent achievements:', error);
      return [];
    }
  }
}

module.exports = AchievementService;
