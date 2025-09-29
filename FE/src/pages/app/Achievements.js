import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

import { Trophy, Award, Star, Target, Zap, CheckCircle, Lock } from 'lucide-react';
import { GlowingCards, GlowingCard } from '../../components/lightswind/glowing-cards.tsx';

const Achievements = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [achievements, setAchievements] = useState({ unlocked: [], locked: [] });
  const [achievementProgress, setAchievementProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
    loadAchievementProgress();
  }, []);

  // Refresh achievements when component becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAchievements();
        loadAchievementProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserAchievements();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error loading achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const loadAchievementProgress = async () => {
    try {
      const response = await apiService.getAchievementProgress();
      setAchievementProgress(response.data);
    } catch (error) {
      console.error('Error loading achievement progress:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Achievements' },
    { id: 'quiz', name: 'Quizzes' },
    { id: 'streak', name: 'Streaks' },
    { id: 'points', name: 'Points' },
    { id: 'level', name: 'Levels' },
    { id: 'special', name: 'Special' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'quiz': return Target;
      case 'streak': return Zap;
      case 'points': return Star;
      case 'level': return Trophy;
      case 'special': return Award;
      default: return Award;
    }
  };

  const getAchievementProgress = (achievementId) => {
    const progress = achievementProgress.find(p => p._id === achievementId);
    return progress || { progressPercentage: 0, currentProgress: 0, maxProgress: 1 };
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getGlowColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const allAchievements = [...achievements.unlocked, ...achievements.locked];
  const filteredAchievements = allAchievements.filter(achievement => {
    return selectedCategory === 'all' || achievement.category === selectedCategory;
  });

  const earnedCount = achievements.unlocked.length;
  const totalCount = allAchievements.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Track your progress and unlock rewards</p>
      </div>

      {/* Stats */}
      <div className="animate-fade-in">
        <GlowingCards
          enableGlow={true}
          glowRadius={20}
          glowOpacity={0.6}
          animationDuration={400}
          enableHover={true}
          gap="1.5rem"
          maxWidth="75rem"
          padding="0"
          responsive={true}
          className="w-full"
        >
          <GlowingCard
            glowColor="#f59e0b"
            hoverEffect={true}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6"
          >
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{earnedCount}</div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </GlowingCard>
          
          <GlowingCard
            glowColor="#3b82f6"
            hoverEffect={true}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6"
          >
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600">Total Available</div>
          </GlowingCard>
          
          <GlowingCard
            glowColor="#10b981"
            hoverEffect={true}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6"
          >
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </GlowingCard>
        </GlowingCards>
      </div>

      {/* Category Filter */}
      <div className="animate-fade-in">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="animate-fade-in">
        <GlowingCards
          enableGlow={true}
          glowRadius={25}
          glowOpacity={0.7}
          animationDuration={400}
          enableHover={true}
          gap="1.5rem"
          maxWidth="75rem"
          padding="0"
          responsive={true}
          className="w-full"
        >
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = achievements.unlocked.some(a => a._id === achievement._id);
            const IconComponent = getCategoryIcon(achievement.category);
            const glowColor = getGlowColor(achievement.rarity);
            
            return (
              <GlowingCard
                key={achievement._id}
                glowColor={glowColor}
                hoverEffect={true}
                className={`bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  isUnlocked 
                    ? 'border-primary-200' 
                    : 'opacity-75 hover:opacity-90'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isUnlocked ? 'bg-primary-100 group-hover:bg-primary-200' : 'bg-gray-100'
                    }`}>
                      {isUnlocked ? (
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">{achievement.points} pts</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200 leading-tight">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{achievement.description}</p>
                    
                    {/* Progress Bar for Locked Achievements */}
                    {!isUnlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                          <span>Progress</span>
                          <span>{getAchievementProgress(achievement._id).progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${getAchievementProgress(achievement._id).progressPercentage}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {getAchievementProgress(achievement._id).currentProgress} / {getAchievementProgress(achievement._id).maxProgress}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                      <span className="text-sm text-gray-600 capitalize font-medium">{achievement.category}</span>
                    </div>
                    {isUnlocked && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </GlowingCard>
            );
          })}
        </GlowingCards>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try selecting a different category or complete more quizzes to unlock achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;