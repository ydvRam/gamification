const socketIo = require('socket.io');

class NotificationService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join user to their personal room
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join user to leaderboard room for real-time updates
      socket.on('join-leaderboard', () => {
        socket.join('leaderboard');
        console.log(`User joined leaderboard room`);
      });

      // Handle quiz completion notifications
      socket.on('quiz-completed', (data) => {
        this.handleQuizCompletion(data);
      });

      // Handle achievement unlock
      socket.on('achievement-unlocked', (data) => {
        this.handleAchievementUnlock(data);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  // Send notification to specific user
  sendToUser(userId, event, data) {
    this.io.to(`user-${userId}`).emit(event, data);
  }

  // Send notification to all users
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Send notification to leaderboard room
  sendToLeaderboard(event, data) {
    this.io.to('leaderboard').emit(event, data);
  }

  // Handle quiz completion
  async handleQuizCompletion(data) {
    const { userId, quizId, score, pointsEarned } = data;
    
    // Send personal notification
    this.sendToUser(userId, 'quiz-completed', {
      type: 'quiz-completed',
      message: `Quiz completed! Score: ${score}%, Points earned: ${pointsEarned}`,
      quizId,
      score,
      pointsEarned,
      timestamp: new Date()
    });

    // Check for achievements
    await this.checkAchievements(userId);

    // Update leaderboard if significant change
    if (pointsEarned > 50) {
      this.sendToLeaderboard('leaderboard-updated', {
        message: 'Leaderboard updated!',
        timestamp: new Date()
      });
    }
  }

  // Handle achievement unlock
  handleAchievementUnlock(data) {
    const { userId, achievement } = data;
    
    this.sendToUser(userId, 'achievement-unlocked', {
      type: 'achievement-unlocked',
      message: `Achievement unlocked: ${achievement.name}!`,
      achievement,
      timestamp: new Date()
    });

    // Broadcast to all users for rare achievements
    if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
      this.broadcast('rare-achievement', {
        message: `${achievement.name} achievement unlocked!`,
        achievement,
        timestamp: new Date()
      });
    }
  }

  // Check for new achievements
  async checkAchievements(userId) {
    try {
      const User = require('../models/User');
      const Achievement = require('../models/Achievement');
      const QuizAttempt = require('../models/QuizAttempt');

      const user = await User.findById(userId);
      const userAttempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty');

      const allAchievements = await Achievement.find({ isActive: true });
      const unlockedAchievementIds = user.achievements.map(a => a.achievement.toString());

      for (const achievement of allAchievements) {
        if (!unlockedAchievementIds.includes(achievement._id.toString())) {
          if (achievement.checkCriteria(user.stats, userAttempts)) {
            // Unlock achievement
            await User.findByIdAndUpdate(userId, {
              $push: {
                achievements: {
                  achievement: achievement._id,
                  unlockedAt: new Date()
                }
              }
            });

            // Send notification
            this.handleAchievementUnlock({
              userId,
              achievement: {
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                rarity: achievement.rarity,
                points: achievement.points
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Achievement check error:', error);
    }
  }

  // Send level up notification
  sendLevelUp(userId, newLevel) {
    this.sendToUser(userId, 'level-up', {
      type: 'level-up',
      message: `Congratulations! You've reached level ${newLevel}!`,
      newLevel,
      timestamp: new Date()
    });
  }

  // Send streak notification
  sendStreakUpdate(userId, streakDays) {
    if (streakDays % 7 === 0 && streakDays > 0) {
      this.sendToUser(userId, 'streak-milestone', {
        type: 'streak-milestone',
        message: `Amazing! ${streakDays} day streak!`,
        streakDays,
        timestamp: new Date()
      });
    }
  }

  // Send leaderboard position change
  sendLeaderboardUpdate(userId, oldRank, newRank) {
    if (oldRank && newRank < oldRank) {
      this.sendToUser(userId, 'rank-improved', {
        type: 'rank-improved',
        message: `Your rank improved from #${oldRank} to #${newRank}!`,
        oldRank,
        newRank,
        timestamp: new Date()
      });
    }
  }

  // Send daily challenge notification
  sendDailyChallenge(userId, challenge) {
    this.sendToUser(userId, 'daily-challenge', {
      type: 'daily-challenge',
      message: 'New daily challenge available!',
      challenge,
      timestamp: new Date()
    });
  }

  // Send study reminder
  sendStudyReminder(userId) {
    this.sendToUser(userId, 'study-reminder', {
      type: 'study-reminder',
      message: 'Time for your daily learning session!',
      timestamp: new Date()
    });
  }
}

module.exports = NotificationService;
