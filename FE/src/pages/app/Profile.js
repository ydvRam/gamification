import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Target, 
  TrendingUp, 
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  CheckCircle
} from 'lucide-react';
import ProgressChart from '../../components/Charts/ProgressChart';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    preferences: {
      difficulty: 'beginner',
      subjects: []
    }
  });
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        preferences: user.preferences || {
          difficulty: 'beginner',
          subjects: []
        }
      });
    }
    loadUserStats();
  }, [user]);

  // Refresh profile data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
      toast.error('Failed to load user statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      preferences: user.preferences || {
        difficulty: 'beginner',
        subjects: []
      }
    });
  };

  const handleSave = async () => {
    try {
      // Filter out empty strings and prepare clean data
      const cleanData = {
        firstName: editData.firstName.trim() || undefined,
        lastName: editData.lastName.trim() || undefined,
        email: editData.email.trim() || undefined,
        preferences: editData.preferences
      };

      // Remove undefined values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });

      const result = await updateProfile(cleanData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };


  const handleSubjectToggle = (subject) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        subjects: prev.preferences.subjects.includes(subject)
          ? prev.preferences.subjects.filter(s => s !== subject)
          : [...prev.preferences.subjects, subject]
      }
    }));
  };

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
      <div className="animate-fade-in bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-primary-100 text-lg">
                Level {user?.level || 1} • {user?.stats?.totalPoints || 0} XP
              </p>
            </div>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              isEditing 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl' 
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.firstName || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.lastName || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
              </div>
              

              {/* Difficulty */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Difficulty</h3>
                <select
                  value={editData.preferences.difficulty}
                  onChange={(e) => handleInputChange('preferences.difficulty', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Subjects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested Subjects</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['math', 'science', 'history', 'language', 'geography', 'art'].map((subject) => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.preferences.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        disabled={!isEditing}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700 capitalize">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Stats */}
          <div className="card">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{user?.stats?.totalQuizzes || 0}</div>
                  <div className="text-sm text-gray-600">Quizzes Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{user?.stats?.totalPoints || 0}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{user?.level || 1}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="card">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Progress Overview</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={loadUserStats}
                    disabled={loading}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    title="Refresh Progress Data"
                  >
                    <svg 
                      className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>Last 7 days</span>
                  </div>
                </div>
              </div>
              
              {/* Learning Progress Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Learning Progress</h4>
                    <p className="text-sm text-gray-600">Your weekly performance</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">
                      {userStats?.analytics?.weeklyProgress?.length > 0 ? 
                        `+${Math.round(((userStats.analytics.weeklyProgress[userStats.analytics.weeklyProgress.length - 1]?.totalPoints || 0) - (userStats.analytics.weeklyProgress[0]?.totalPoints || 0)) / Math.max(userStats.analytics.weeklyProgress[0]?.totalPoints || 1, 1) * 100)}%` : 
                        '+0%'
                      }
                    </span>
                  </div>
                </div>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {(() => {
                    // Get weekly progress data or use fallback
                    const weeklyData = userStats?.analytics?.weeklyProgress || [];
                    const maxPoints = Math.max(...weeklyData.map(day => day?.totalPoints || 0), 10); // Minimum height for visibility
                    
                    // Generate 7 days of data (last 7 days)
                    const chartData = [];
                    const today = new Date();
                    
                    for (let i = 6; i >= 0; i--) {
                      const date = new Date(today);
                      date.setDate(date.getDate() - i);
                      const dateStr = date.toISOString().split('T')[0];
                      
                      const dayData = weeklyData.find(day => day._id === dateStr);
                      const points = dayData?.totalPoints || 0;
                      const height = Math.max((points / maxPoints) * 100, 5); // Minimum 5% height
                      
                      chartData.push({
                        height,
                        points,
                        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        attempts: dayData?.attempts || 0
                      });
                    }
                    
                    return chartData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer relative"
                          style={{ height: `${data.height}%`, minHeight: '20px' }}
                          title={`${data.date}: ${data.points} points, ${data.attempts} attempts`}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {data.points} pts, {data.attempts} quizzes
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.date}</span>
                      </div>
                    ));
                  })()}
                </div>
                
                {/* Chart Legend */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Points Earned</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-300 rounded"></div>
                      <span>Quiz Attempts</span>
                    </div>
                  </div>
                  <div>
                    Total: {userStats?.analytics?.weeklyProgress?.reduce((sum, day) => sum + (day?.totalPoints || 0), 0) || 0} points this week
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {/* Current Streak */}
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{userStats?.analytics?.overview?.totalAttempts || 0}</div>
                  <div className="text-sm text-gray-600">Total Attempts</div>
                </div>

                {/* Average Score */}
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{Math.round(userStats?.analytics?.overview?.averageScore || 0)}%</div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>

                {/* Total Points */}
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{userStats?.analytics?.overview?.totalPoints || 0}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;