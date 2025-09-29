import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Users, Star, Filter, Search, Play, Trophy, Zap } from 'lucide-react';
import { GlowingCards, GlowingCard } from '../components/lightswind/glowing-cards.tsx';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const PublicQuizzes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalLearners: 0,
    totalCompleted: 0,
    averageRating: 0
  });

  const categories = [
    { id: 'all', name: 'All Categories', count: 0 },
    { id: 'math', name: 'Mathematics', count: 0 },
    { id: 'science', name: 'Science', count: 0 },
    { id: 'history', name: 'History', count: 0 },
    { id: 'language', name: 'Language Arts', count: 0 },
    { id: 'geography', name: 'Geography', count: 0 },
    { id: 'art', name: 'Art & Culture', count: 0 },
  ];

  useEffect(() => {
    loadQuizzes();
  }, [searchTerm, selectedCategory, sortBy]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        limit: 20
      };
      
      const response = await apiService.getQuizzes(params);
      setQuizzes(response.data.quizzes);
      setStats({
        totalQuizzes: response.data.pagination.total,
        totalLearners: 10000, // Mock data
        totalCompleted: 50000, // Mock data
        averageRating: 4.9 // Mock data
      });
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get glow color based on category
  const getGlowColor = (category) => {
    const colors = {
      math: '#3b82f6',
      science: '#22c55e',
      history: '#f59e0b',
      language: '#9333ea',
      geography: '#06b6d4',
      art: '#ec4899'
    };
    return colors[category] || '#6b7280';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'math': return '🔢';
      case 'science': return '🔬';
      case 'history': return '📚';
      case 'language': return '📝';
      case 'geography': return '🌍';
      case 'art': return '🎨';
      default: return '📖';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our <span className="text-gradient">Quiz Library</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover thousands of interactive quizzes across various subjects. 
              Challenge yourself, track your progress, and compete with learners worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                <div className="text-sm opacity-90">Active Quizzes</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stats.totalLearners.toLocaleString()}</div>
                <div className="text-sm opacity-90">Active Learners</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stats.totalCompleted.toLocaleString()}</div>
                <div className="text-sm opacity-90">Quizzes Completed</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlowingCards
            enableGlow={true}
            glowRadius={25}
            glowOpacity={0.7}
            animationDuration={400}
            enableHover={true}
            gap="2rem"
            maxWidth="75rem"
            padding="1rem"
            responsive={true}
            className="w-full"
          >
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No quizzes found. Try adjusting your filters.</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <GlowingCard
                  key={quiz._id}
                  glowColor={getGlowColor(quiz.category)}
                  hoverEffect={true}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group min-w-[300px]"
                >
                  {/* Quiz Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{getCategoryIcon(quiz.category)}</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-sm">
                        {getCategoryIcon(quiz.category)}
                      </span>
                    </div>
                  </div>

                  {/* Quiz Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 capitalize">{quiz.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>

                    {/* Quiz Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{quiz.timeLimit}m</div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Brain className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{quiz.questions?.length || 0}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{quiz.points}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quiz.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Link
                      to="/signup"
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Quiz</span>
                    </Link>
                  </div>
                </GlowingCard>
              ))
            )}
          </GlowingCards>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-200 font-medium">
              Load More Quizzes
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of learners who are already improving their knowledge with our interactive quizzes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 font-medium"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicQuizzes;
