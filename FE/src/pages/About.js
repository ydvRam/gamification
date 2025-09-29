import React from 'react';

import { Brain, Target, Users, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '50K+', label: 'Quizzes Completed' },
    { number: '95%', label: 'Success Rate' },
    { number: '4.9', label: 'User Rating' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-gradient">EduGame</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make learning fun, engaging, and effective through the power of gamification.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that learning should be engaging, motivating, and fun. Traditional education often fails to capture students' attention and maintain their interest over time.
              </p>
              <p className="text-lg text-gray-600">
                EduGame transforms the learning experience by incorporating game elements like points, badges, leaderboards, and achievements. This approach not only makes learning more enjoyable but also significantly improves retention and engagement.
              </p>
            </div>
            <div className="animate-fade-in bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Target className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-semibold">Clear Goals</h3>
                    <p className="text-primary-100">Set and achieve learning objectives</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-semibold">Community</h3>
                    <p className="text-primary-100">Learn together with peers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Award className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-semibold">Recognition</h3>
                    <p className="text-primary-100">Celebrate achievements and progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div className="animate-fade-in text-center" key={stat.label}>
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
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
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students who are already learning and earning with EduGame.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
                Get Started Free
              </a>
              <a href="/features" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


