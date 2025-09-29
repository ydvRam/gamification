import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { 
  Play, 
  Brain, 
  Trophy, 
  Zap, 
  Users, 
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Landing = () => {
  const [headingRef, isHeadingVisible] = useScrollReveal({ threshold: 0.3 });
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Interactive quiz state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic stats state
  const [dynamicStats, setDynamicStats] = useState({
    activeQuizzes: 3,
    activeLearners: 10000,
    quizzesCompleted: 50000,
    averageRating: 4.9
  });
  
  // Sample quiz data
  const quizData = {
    question: "What is the value of x in 2x + 5 = 13?",
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
  };
  
  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    setShowResult(true);
  };
  
  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  // Load dynamic stats
  useEffect(() => {
    loadDynamicStats();
  }, []);

  const loadDynamicStats = async () => {
    try {
      // Load public data from API (no authentication required)
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/quizzes?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        const quizzesData = data.data.quizzes || [];

        // Generate dynamic numbers based on real data
        setDynamicStats({
          activeQuizzes: Math.max(quizzesData.length, 3),
          activeLearners: Math.floor(10000 + (quizzesData.length * 150)), // Dynamic based on quiz count
          quizzesCompleted: Math.floor(50000 + (quizzesData.length * 25)), // Dynamic based on quiz count
          averageRating: Math.min(4.9 + (quizzesData.length * 0.01), 5.0) // Dynamic rating
        });
      }
    } catch (error) {
      // Keep default values if API fails
    }
  };
  
  const handleLoadMore = async () => {
    setIsLoading(true);
    
    // Check if user is authenticated
    if (!user) {
      // Redirect to login page if not authenticated
      navigate('/login');
      return;
    }
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to the quizzes page
      navigate('/app/quizzes');
    } catch (error) {
      // Handle navigation error silently
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Interactive Quizzes',
      description: 'Engaging quizzes with real-time feedback and instant results',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn badges, points, and compete on leaderboards',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Personalized learning paths powered by artificial intelligence',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Social Learning',
      description: 'Learn together with friends and study groups',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Star,
      title: 'Achievements',
      description: 'Unlock rewards and celebrate your learning milestones',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const stats = [
    { 
      number: dynamicStats.activeQuizzes, 
      label: 'Active Quizzes',
      icon: Brain,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      number: dynamicStats.activeLearners.toLocaleString(), 
      label: 'Active Learners',
      icon: Users,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      number: dynamicStats.quizzesCompleted.toLocaleString(), 
      label: 'Quizzes Completed',
      icon: Trophy,
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      number: dynamicStats.averageRating.toFixed(1), 
      label: 'Average Rating',
      icon: Star,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 
                ref={headingRef}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 scroll-reveal-text"
              >
                <span className="scroll-reveal-word">Learn,</span>
                <span className="scroll-reveal-word">Compete,</span>
                <span className="scroll-reveal-word">and</span>
                <span className="text-gradient block scroll-reveal-word">Earn Rewards</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your learning experience with our gamified education platform. 
                Take interactive quizzes, earn badges, and climb the leaderboards while mastering new skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2">
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/features" className="btn-outline text-lg px-8 py-4 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Math Challenge</h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">Hard</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success-600" />
                      </div>
                      <span className="text-gray-700">Question 1 of 10</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 mb-3">{quizData.question}</p>
                      <div className="space-y-2">
                        {quizData.options.map((option, index) => {
                          const isSelected = selectedAnswer === option;
                          const isCorrect = option === quizData.correctAnswer;
                          const showFeedback = showResult && (isSelected || isCorrect);
                          
                          let buttonClass = "w-full text-left p-3 rounded-lg border transition-all duration-200 ";
                          
                          if (showFeedback) {
                            if (isCorrect) {
                              buttonClass += "border-green-500 bg-green-50 text-green-800";
                            } else if (isSelected && !isCorrect) {
                              buttonClass += "border-red-500 bg-red-50 text-red-800";
                            } else {
                              buttonClass += "border-gray-200 bg-gray-100 text-gray-500";
                            }
                          } else if (isSelected) {
                            buttonClass += "border-primary-500 bg-primary-50 text-primary-800";
                          } else {
                            buttonClass += "border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-gray-800";
                          }
                          
                          return (
                            <button 
                              key={index} 
                              onClick={() => handleAnswerSelect(option)}
                              className={buttonClass}
                              disabled={showResult}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {showFeedback && (
                                  <div className="ml-2">
                                    {isCorrect ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : isSelected ? (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Result Feedback */}
                      {showResult && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              {selectedAnswer === quizData.correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${selectedAnswer === quizData.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                                {selectedAnswer === quizData.correctAnswer ? 'Correct!' : 'Incorrect'}
                              </p>
                              <p className="text-sm text-blue-700 mt-1">
                                {quizData.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      {showResult && (
                        <div className="mt-4 space-y-3">
                          {/* Load More Button */}
                          <div className="flex justify-center">
                            <button
                              onClick={handleLoadMore}
                              disabled={isLoading}
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {isLoading ? (
                                <>
                                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  <span>Load More Quizzes</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          {/* Reset Button */}
                          <div className="flex justify-center">
                            <button
                              onClick={resetQuiz}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Try Again</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-warning-500" />
                        <span className="text-sm text-gray-600">150 points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-warning-500" />
                        <span className="text-sm text-gray-600">Rank #12</span>
                      </div>
                    </div>
                    
                    {/* Quick Access Button - Always Visible */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            <span>Explore All Quizzes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in rounded-2xl p-6 relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: `linear-gradient(135deg, ${stat.gradient.includes('blue') ? '#3b82f6, #8b5cf6' : 
                                                      stat.gradient.includes('green') ? '#10b981, #059669' : 
                                                      stat.gradient.includes('purple') ? '#8b5cf6, #7c3aed' : 
                                                      '#f59e0b, #d97706'})`,
                  boxShadow: `0 0 30px ${stat.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 
                                          stat.gradient.includes('green') ? 'rgba(16, 185, 129, 0.4)' : 
                                          stat.gradient.includes('purple') ? 'rgba(139, 92, 246, 0.4)' : 
                                          'rgba(245, 158, 11, 0.4)'}`
                }}
              >
                {/* Glow effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  
                  {/* Label */}
                  <div className="text-white/90 text-sm font-medium">{stat.label}</div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduGame?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the best of education and gaming to create an engaging learning experience that keeps you motivated and coming back for more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="feature-card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students who are already learning and earning with EduGame.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
                Get Started Free
              </Link>
              <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl text-lg">
                Contact Us
              </Link>
              <Link to="/features" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl text-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;

