import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

import { Trophy, Medal, Award, Users, Calendar, Filter } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('overall');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    loadUserRank();
  }, [selectedPeriod]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (selectedPeriod) {
        case 'weekly':
          response = await apiService.getWeeklyLeaderboard();
          break;
        case 'monthly':
          response = await apiService.getMonthlyLeaderboard();
          break;
        default:
          response = await apiService.getLeaderboard();
      }
      
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const loadUserRank = async () => {
    try {
      const response = await apiService.getUserRank();
      setUserRank(response.data);
    } catch (error) {
      console.error('Error loading user rank:', error);
    }
  };

  const periods = [
    { id: 'overall', name: 'Overall' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
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
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other learners</p>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <div className="animate-fade-in">
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Rankings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">#{userRank.overall.rank}</div>
                    <div className="text-sm text-gray-600">Overall Rank</div>
                    <div className="text-xs text-gray-500">{userRank.overall.totalPoints} points</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">#{userRank.weekly.rank}</div>
                    <div className="text-sm text-gray-600">Weekly Rank</div>
                    <div className="text-xs text-gray-500">{userRank.weekly.totalPoints} points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Filter */}
      <div className="animate-fade-in">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === period.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="animate-fade-in">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {periods.find(p => p.id === selectedPeriod)?.name} Leaderboard
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{leaderboard.length} players</span>
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                <p className="text-gray-500">No players found for this period.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      player.id === user?.id 
                        ? 'border-primary-300 bg-primary-50' 
                        : getRankColor(player.rank)
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(player.rank)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {player.firstName} {player.lastName}
                          {player.id === user?.id && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Level {player.level}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {player.totalPoints?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;