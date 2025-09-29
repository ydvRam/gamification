import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

import { TrendingUp, Target, Award } from 'lucide-react';

const ProgressChart = () => {
  // Sample data for demonstration
  const data = [
    { week: 'Week 1', points: 120, quizzes: 3, streak: 2 },
    { week: 'Week 2', points: 180, quizzes: 5, streak: 4 },
    { week: 'Week 3', points: 250, quizzes: 7, streak: 6 },
    { week: 'Week 4', points: 320, quizzes: 9, streak: 8 },
    { week: 'Week 5', points: 400, quizzes: 12, streak: 10 },
    { week: 'Week 6', points: 480, quizzes: 15, streak: 12 },
    { week: 'Week 7', points: 560, quizzes: 18, streak: 14 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Points: <span className="font-medium text-primary-600">{payload[0].value}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Quizzes: <span className="font-medium text-success-600">{payload[1].value}</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Accuracy: <span className="font-medium text-warning-600">{payload[2].value}%</span></span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
          <p className="text-sm text-gray-600">Your weekly performance</p>
        </div>
        <div className="flex items-center space-x-2 text-success-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12%</span>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="quizzesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="points"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#pointsGradient)"
            />
            <Area
              type="monotone"
              dataKey="quizzes"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#quizzesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-full mx-auto mb-2">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-bold text-primary-600">20</div>
          <div className="text-xs text-gray-600">Quizzes Done</div>
        </div>
        <div className="text-center p-3 bg-success-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-success-500 rounded-full mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-bold text-success-600">92%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
        <div className="text-center p-3 bg-warning-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-warning-500 rounded-full mx-auto mb-2">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-bold text-warning-600">7</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;


