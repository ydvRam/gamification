import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Zap, Award, Target, Brain } from 'lucide-react';

const PublicLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const timeFilters = [
    { id: 'all', name: 'All Time', icon: Trophy },
    { id: 'monthly', name: 'This Month', icon: TrendingUp },
    { id: 'weekly', name: 'This Week', icon: Zap },
  ];

  const categories = [
    { id: 'all', name: 'All Subjects' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'language', name: 'Language Arts' },
  ];

  const topPerformers = [
    {
      id: 1,
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      points: 15420,
      rank: 1,
      level: 'Expert',
      badges: 47,
      quizzesCompleted: 156,
      accuracy: 94.2,
      streak: 28,
      country: '🇺🇸',
      achievements: ['Quiz Master', 'Perfect Score', 'Speed Demon']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      points: 14890,
      rank: 2,
      level: 'Expert',
      badges: 43,
      quizzesCompleted: 142,
      accuracy: 92.8,
      streak: 21,
      country: '🇨🇦',
      achievements: ['Knowledge Seeker', 'Consistent Performer', 'Team Player']
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      username: '@mike_rod',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      points: 14230,
      rank: 3,
      level: 'Advanced',
      badges: 39,
      quizzesCompleted: 138,
      accuracy: 91.5,
      streak: 35,
      country: '🇲🇽',
      achievements: ['Streak Master', 'Quick Learner', 'History Buff']
    },
    {
      id: 4,
      name: 'Emma Thompson',
      username: '@emmathompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      points: 13850,
      rank: 4,
      level: 'Advanced',
      badges: 36,
      quizzesCompleted: 131,
      accuracy: 93.1,
      streak: 18,
      country: '🇬🇧',
      achievements: ['Science Whiz', 'Accuracy Champion', 'Curious Mind']
    },
    {
      id: 5,
      name: 'David Kim',
      username: '@davidkim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      points: 13420,
      rank: 5,
      level: 'Advanced',
      badges: 34,
      quizzesCompleted: 127,
      accuracy: 90.7,
      streak: 24,
      country: '🇰🇷',
      achievements: ['Math Genius', 'Problem Solver', 'Determined Learner']
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      user: 'Alex Chen',
      achievement: 'Perfect Score Master',
      description: 'Achieved 100% on 10 consecutive quizzes',
      time: '2 hours ago',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      achievement: 'Speed Demon',
      description: 'Completed a quiz in under 2 minutes',
      time: '4 hours ago',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      id: 3,
      user: 'Michael Rodriguez',
      achievement: 'Streak Master',
      description: 'Maintained a 35-day learning streak',
      time: '6 hours ago',
      icon: Target,
      color: 'text-green-500'
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Global <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See how you stack up against learners worldwide. Compete, improve, and climb the rankings!
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">25K+</div>
                <div className="text-sm opacity-90">Active Players</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">150K+</div>
                <div className="text-sm opacity-90">Quizzes Completed</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-sm opacity-90">Achievements Earned</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm opacity-90">Average Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Time Filter */}
            <div className="flex space-x-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    timeFilter === filter.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.name}</span>
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Top Performers
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {topPerformers.map((player, index) => (
                    <div key={player.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getRankIcon(player.rank)}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                                <span className="text-gray-500">{player.country}</span>
                              </div>
                              <p className="text-sm text-gray-500">{player.username}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}>
                                  {player.level}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {player.streak} day streak
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {player.points.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">points</div>
                          <div className="flex items-center justify-end space-x-4 mt-2 text-xs text-gray-500">
                            <span>{player.quizzesCompleted} quizzes</span>
                            <span>{player.accuracy}% accuracy</span>
                          </div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {player.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 px-6 py-4 text-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <span>Join the competition</span>
                    <TrendingUp className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Achievements */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Recent Achievements
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${achievement.color}`}>
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {achievement.user}
                        </p>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Climb */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    How to Climb
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Complete Quizzes</h4>
                      <p className="text-sm text-gray-600">Earn points for every quiz you finish</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Maintain Accuracy</h4>
                      <p className="text-sm text-gray-600">Higher accuracy scores give bonus points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Build Streaks</h4>
                      <p className="text-sm text-gray-600">Daily learning streaks multiply your points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Earn Achievements</h4>
                      <p className="text-sm text-gray-600">Special badges provide extra point bonuses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Compete?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join the leaderboard and start climbing the ranks today. Every quiz brings you closer to the top!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              Join Competition
            </Link>
            <Link
              to="/quizzes"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 font-medium"
            >
              Browse Quizzes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicLeaderboard;
