import React from 'react';
import { Brain, Trophy, Zap, Users, Target, Star } from 'lucide-react';
import { GlowingCards, GlowingCard } from '../components/lightswind/glowing-cards.tsx';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Interactive Quizzes',
      description: 'Engaging quizzes with real-time feedback and instant results',
      color: 'from-blue-500 to-blue-600',
      glowColor: '#3b82f6'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn badges, points, and compete on leaderboards',
      color: 'from-yellow-500 to-yellow-600',
      glowColor: '#f59e0b'
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Personalized learning paths powered by artificial intelligence',
      color: 'from-purple-500 to-purple-600',
      glowColor: '#9333ea'
    },
    {
      icon: Users,
      title: 'Social Learning',
      description: 'Learn together with friends and study groups',
      color: 'from-green-500 to-green-600',
      glowColor: '#22c55e'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'from-red-500 to-red-600',
      glowColor: '#ef4444'
    },
    {
      icon: Star,
      title: 'Achievements',
      description: 'Unlock rewards and celebrate your learning milestones',
      color: 'from-pink-500 to-pink-600',
      glowColor: '#ec4899'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-fade-in text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Better Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our gamified learning platform can transform your educational experience
          </p>
        </div>

        <GlowingCards
          enableGlow={true}
          glowRadius={30}
          glowOpacity={0.8}
          animationDuration={400}
          enableHover={true}
          gap="2rem"
          maxWidth="75rem"
          padding="2rem 1rem"
          responsive={true}
          className="w-full"
        >
          {features.map((feature, index) => (
            <GlowingCard
              key={feature.title}
              glowColor={feature.glowColor}
              hoverEffect={true}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </GlowingCard>
          ))}
        </GlowingCards>
      </div>
    </div>
  );
};

export default Features;


