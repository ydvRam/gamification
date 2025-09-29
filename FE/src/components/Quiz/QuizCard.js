import React from 'react';
import { Link } from 'react-router-dom';

import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle,
  Brain,
  Zap,
  Award
} from 'lucide-react';
import { getDifficultyColor, getCategoryIcon } from '../../utils/helpers';

const QuizCard = ({ quiz }) => {
  const getCategoryIconComponent = (category) => {
    switch (category) {
      case 'math':
        return Brain;
      case 'science':
        return Zap;
      case 'history':
        return Award;
      default:
        return Brain;
    }
  };

  const CategoryIcon = getCategoryIconComponent(quiz.category);

  return (
    <div className="animate-fade-in"div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="quiz-card group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <CategoryIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-600 capitalize">{quiz.category}</p>
          </div>
        </div>
        {quiz.completed && (
          <CheckCircle className="w-6 h-6 text-success-600" />
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {quiz.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
          {quiz.points} pts
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{quiz.timeLimit} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{quiz.participants.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-warning-500 fill-current" />
          <span>{quiz.rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {quiz.questions} questions
        </div>
        <Link
          to={`/app/quiz/${quiz.id}`}
          className="btn-primary flex items-center space-x-2 text-sm py-2 px-4"
        >
          {quiz.completed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Review</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Quiz</span>
            </>
          )}
        </Link>
      </div>

      {/* Progress indicator for completed quizzes */}
      {quiz.completed && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Your Score</span>
            <span className="font-medium text-success-600">85%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-gradient-to-r from-success-500 to-success-600"
              style={{ width: '85%' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;


