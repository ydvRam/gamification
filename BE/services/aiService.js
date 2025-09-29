const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

class AIService {
  /**
   * Get personalized quiz recommendations based on user's performance and preferences
   */
  static async getPersonalizedRecommendations(userId, limit = 5) {
    try {
      const user = await User.findById(userId);
      const userAttempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty');

      // Analyze user's performance patterns
      const performanceAnalysis = this.analyzeUserPerformance(userAttempts);
      
      // Get user's weak areas
      const weakAreas = this.identifyWeakAreas(userAttempts);
      
      // Get user's strong areas
      const strongAreas = this.identifyStrongAreas(userAttempts);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        user,
        performanceAnalysis,
        weakAreas,
        strongAreas,
        limit
      );

      return {
        recommendations,
        analysis: {
          performance: performanceAnalysis,
          weakAreas,
          strongAreas
        }
      };
    } catch (error) {
      console.error('AI recommendation error:', error);
      throw error;
    }
  }

  /**
   * Analyze user's performance patterns
   */
  static analyzeUserPerformance(attempts) {
    if (attempts.length === 0) {
      return {
        averageScore: 0,
        totalAttempts: 0,
        improvementTrend: 'stable',
        consistency: 'low'
      };
    }

    const scores = attempts.map(attempt => attempt.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Calculate improvement trend
    const recentScores = scores.slice(-5);
    const olderScores = scores.slice(-10, -5);
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const olderAvg = olderScores.length > 0 ? 
      olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length : recentAvg;
    
    let improvementTrend = 'stable';
    if (recentAvg > olderAvg + 5) improvementTrend = 'improving';
    else if (recentAvg < olderAvg - 5) improvementTrend = 'declining';

    // Calculate consistency (lower standard deviation = more consistent)
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    const consistency = standardDeviation < 15 ? 'high' : standardDeviation < 25 ? 'medium' : 'low';

    return {
      averageScore: Math.round(averageScore),
      totalAttempts: attempts.length,
      improvementTrend,
      consistency,
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores)
    };
  }

  /**
   * Identify user's weak areas based on performance
   */
  static identifyWeakAreas(attempts) {
    const categoryPerformance = {};
    
    attempts.forEach(attempt => {
      const category = attempt.quiz.category;
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { scores: [], count: 0 };
      }
      categoryPerformance[category].scores.push(attempt.score);
      categoryPerformance[category].count++;
    });

    const weakAreas = [];
    Object.entries(categoryPerformance).forEach(([category, data]) => {
      const averageScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      if (averageScore < 70 && data.count >= 2) {
        weakAreas.push({
          category,
          averageScore: Math.round(averageScore),
          attempts: data.count
        });
      }
    });

    return weakAreas.sort((a, b) => a.averageScore - b.averageScore);
  }

  /**
   * Identify user's strong areas
   */
  static identifyStrongAreas(attempts) {
    const categoryPerformance = {};
    
    attempts.forEach(attempt => {
      const category = attempt.quiz.category;
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { scores: [], count: 0 };
      }
      categoryPerformance[category].scores.push(attempt.score);
      categoryPerformance[category].count++;
    });

    const strongAreas = [];
    Object.entries(categoryPerformance).forEach(([category, data]) => {
      const averageScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      if (averageScore >= 85 && data.count >= 2) {
        strongAreas.push({
          category,
          averageScore: Math.round(averageScore),
          attempts: data.count
        });
      }
    });

    return strongAreas.sort((a, b) => b.averageScore - a.averageScore);
  }

  /**
   * Generate personalized quiz recommendations
   */
  static async generateRecommendations(user, performance, weakAreas, strongAreas, limit) {
    const recommendations = [];
    
    // Get user's completed quiz IDs
    const completedQuizIds = await QuizAttempt.find({ user: user._id })
      .distinct('quiz');

    // 1. Recommend quizzes in weak areas (40% of recommendations)
    const weakAreaQuizzes = await Quiz.find({
      _id: { $nin: completedQuizIds },
      category: { $in: weakAreas.map(area => area.category) },
      difficulty: this.getRecommendedDifficulty(performance.averageScore)
    })
    .limit(Math.ceil(limit * 0.4))
    .select('-questions.correctAnswer');

    recommendations.push(...weakAreaQuizzes.map(quiz => ({
      ...quiz.toObject(),
      reason: 'Improve weak area',
      priority: 'high'
    })));

    // 2. Recommend quizzes in user's preferred categories (30% of recommendations)
    const preferredCategories = user.preferences?.subjects || [];
    if (preferredCategories.length > 0) {
      const preferredQuizzes = await Quiz.find({
        _id: { $nin: completedQuizIds },
        category: { $in: preferredCategories },
        difficulty: this.getRecommendedDifficulty(performance.averageScore)
      })
      .limit(Math.ceil(limit * 0.3))
      .select('-questions.correctAnswer');

      recommendations.push(...preferredQuizzes.map(quiz => ({
        ...quiz.toObject(),
        reason: 'Based on your interests',
        priority: 'medium'
      })));
    }

    // 3. Recommend quizzes in strong areas for mastery (20% of recommendations)
    const strongAreaQuizzes = await Quiz.find({
      _id: { $nin: completedQuizIds },
      category: { $in: strongAreas.map(area => area.category) },
      difficulty: 'advanced'
    })
    .limit(Math.ceil(limit * 0.2))
    .select('-questions.correctAnswer');

    recommendations.push(...strongAreaQuizzes.map(quiz => ({
      ...quiz.toObject(),
      reason: 'Master your strong areas',
      priority: 'low'
    })));

    // 4. Fill remaining slots with popular quizzes (10% of recommendations)
    const remainingSlots = limit - recommendations.length;
    if (remainingSlots > 0) {
      const popularQuizzes = await Quiz.find({
        _id: { $nin: completedQuizIds }
      })
      .sort({ 'stats.totalAttempts': -1 })
      .limit(remainingSlots)
      .select('-questions.correctAnswer');

      recommendations.push(...popularQuizzes.map(quiz => ({
        ...quiz.toObject(),
        reason: 'Popular among learners',
        priority: 'low'
      })));
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Get recommended difficulty based on user's average score
   */
  static getRecommendedDifficulty(averageScore) {
    if (averageScore >= 85) return 'advanced';
    if (averageScore >= 70) return 'intermediate';
    return 'beginner';
  }

  /**
   * Generate learning insights and suggestions
   */
  static async generateLearningInsights(userId) {
    try {
      const user = await User.findById(userId);
      const attempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty title');

      const insights = [];

      // Performance insights
      const performance = this.analyzeUserPerformance(attempts);
      
      if (performance.improvementTrend === 'improving') {
        insights.push({
          type: 'positive',
          title: 'Great Progress!',
          message: 'Your recent scores show improvement. Keep up the excellent work!',
          icon: '📈'
        });
      } else if (performance.improvementTrend === 'declining') {
        insights.push({
          type: 'warning',
          title: 'Focus Needed',
          message: 'Your recent performance has declined. Consider reviewing easier topics first.',
          icon: '⚠️'
        });
      }

      // Consistency insights
      if (performance.consistency === 'high') {
        insights.push({
          type: 'positive',
          title: 'Consistent Performer',
          message: 'You maintain steady performance across quizzes. This shows good understanding!',
          icon: '🎯'
        });
      }

      // Weak area insights
      const weakAreas = this.identifyWeakAreas(attempts);
      if (weakAreas.length > 0) {
        insights.push({
          type: 'suggestion',
          title: 'Focus Areas',
          message: `Consider practicing more in: ${weakAreas.map(area => area.category).join(', ')}`,
          icon: '🎓'
        });
      }

      // Streak insights
      if (user.stats.currentStreak >= 7) {
        insights.push({
          type: 'positive',
          title: 'Streak Master!',
          message: `Amazing! You've maintained a ${user.stats.currentStreak}-day learning streak!`,
          icon: '🔥'
        });
      }

      return insights;
    } catch (error) {
      console.error('AI insights error:', error);
      throw error;
    }
  }

  /**
   * Predict user's next quiz performance
   */
  static async predictPerformance(userId, quizId) {
    try {
      const user = await User.findById(userId);
      const quiz = await Quiz.findById(quizId);
      const userAttempts = await QuizAttempt.find({ user: userId })
        .populate('quiz', 'category difficulty');

      if (!quiz) return null;

      // Get user's performance in similar quizzes
      const similarQuizzes = userAttempts.filter(attempt => 
        attempt.quiz.category === quiz.category && 
        attempt.quiz.difficulty === quiz.difficulty
      );

      if (similarQuizzes.length === 0) {
        // No similar experience, use overall average
        const overallAverage = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / userAttempts.length;
        return {
          predictedScore: Math.round(overallAverage),
          confidence: 'low',
          reasoning: 'Based on overall performance'
        };
      }

      const similarAverage = similarQuizzes.reduce((sum, attempt) => sum + attempt.score, 0) / similarQuizzes.length;
      const confidence = similarQuizzes.length >= 3 ? 'high' : similarQuizzes.length >= 2 ? 'medium' : 'low';

      return {
        predictedScore: Math.round(similarAverage),
        confidence,
        reasoning: `Based on ${similarQuizzes.length} similar quiz${similarQuizzes.length > 1 ? 'es' : ''}`
      };
    } catch (error) {
      console.error('AI prediction error:', error);
      throw error;
    }
  }
}

module.exports = AIService;
