import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Brain,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Target
} from 'lucide-react';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadQuizData = async () => {
      if (!isMounted) return;
      await loadQuiz();
    };
    
    loadQuizData();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  const loadQuiz = async () => {
    try {
      const response = await apiService.getQuiz(id);
      
      if (response.data.quiz && response.data.quiz.questions) {
        setQuiz(response.data.quiz);
        setTimeLeft(response.data.quiz.timeLimit * 60); // Convert minutes to seconds
        setLoading(false);
      } else {
        toast.error('Invalid quiz data received');
        navigate('/app/quizzes');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
      navigate('/app/quizzes');
    }
  };

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizCompleted && quiz && quiz.questions) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted, quiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (quiz?.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Early return if quiz data is not loaded yet or quiz hasn't started
    if (!quiz || !quiz.questions || !isQuizStarted) {
      return; // Don't show error toast, just return silently
    }
    
    try {

      setIsQuizCompleted(true);
      
      // Prepare answers in the format expected by the API
      const answersArray = quiz.questions.map((question, index) => ({
        questionId: question._id || index.toString(),
        selectedAnswer: answers[index] || 0,
        timeSpent: 30 // Mock time spent per question
      }));

      const attemptData = {
        answers: answersArray,
        timeSpent: (quiz.timeLimit * 60) - timeLeft
      };

      const response = await apiService.submitQuizAttempt(id, attemptData);
      
      // Store quiz results
      setQuizResults(response.data);
      
      toast.success(`Quiz completed! Score: ${response.data.score}%`);
      
      // Show achievement unlock notifications
      if (response.data.newlyUnlockedAchievements && response.data.newlyUnlockedAchievements.length > 0) {
        response.data.newlyUnlockedAchievements.forEach(achievement => {
          toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`, {
            duration: 5000,
            icon: '🏆'
          });
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const startQuiz = () => {
    setIsQuizStarted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
        <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/app/quizzes')}
          className="btn-primary"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (isQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in card text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
          <p className="text-xl text-gray-600 mb-8">Great job on the {quiz.title}</p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {quizResults ? `${quizResults.score}%` : '0%'}
              </div>
              <div className="text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-600">
                {quizResults ? `${quizResults.correctAnswers}/${quizResults.totalQuestions}` : '0/0'}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-600">
                {quizResults ? quizResults.pointsEarned : 0}
              </div>
              <div className="text-gray-600">Points Earned</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/app/quizzes')}
              className="btn-primary flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Quizzes</span>
            </button>
            <button
              onClick={() => navigate('/app/quizzes')}
              className="btn-outline flex items-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Go to Quizzes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in card">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/app/quizzes')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Time Limit</div>
                <div className="font-semibold">{quiz.timeLimit} minutes</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Questions</div>
                <div className="font-semibold">{quiz.questions.length}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Points</div>
                <div className="font-semibold">{quiz.points}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={startQuiz}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz?.questions?.[currentQuestion];
  const progress = quiz?.questions ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;

  // Additional safety check for quiz questions
  if (!quiz?.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not available</h2>
        <p className="text-gray-600 mb-6">This quiz doesn't have any questions available.</p>
        <button
          onClick={() => navigate('/app/quizzes')}
          className="btn-primary"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-fade-in card">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/quizzes')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{formatTime(timeLeft)}</div>
              <div className="text-xs text-gray-500">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQ.question}</h2>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                  index === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              className="btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;