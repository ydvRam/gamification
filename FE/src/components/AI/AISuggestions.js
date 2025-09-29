import React from 'react';

import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { mockAIRecommendations } from '../../data/mockData';

const AISuggestions = () => {
  const suggestions = mockAIRecommendations;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success-600';
    if (confidence >= 80) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 90) return 'bg-success-100';
    if (confidence >= 80) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  return (
    <div className="animate-fade-in"div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Study Recommendations</h2>
            <p className="text-sm text-gray-600">Personalized suggestions based on your performance</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div className="animate-fade-in"div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceBg(suggestion.confidence)} ${getConfidenceColor(suggestion.confidence)}`}>
                {suggestion.confidence}% confident
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning-500" />
                  <span>AI Recommended</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-success-500" />
                  <span>High Impact</span>
                </div>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 group-hover:text-primary-700">
                <span>{suggestion.action}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">AI Insight</h4>
            <p className="text-sm text-gray-600">
              Your learning pattern shows strong performance in science topics. Consider focusing on mathematics 
              to create a more balanced knowledge base. Your consistent study streak is impressive - keep it up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;

