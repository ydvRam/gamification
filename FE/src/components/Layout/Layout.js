import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

import { 
  Home, 
  Trophy, 
  Award, 
  User, 
  Menu, 
  X,
  Brain,
  TrendingUp,
  Zap,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Quizzes', href: '/app/quizzes', icon: Brain },
    { name: 'Leaderboard', href: '/app/leaderboard', icon: Trophy },
    { name: 'Achievements', href: '/app/achievements', icon: Award },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden animate-fade-in">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gradient">EduGame</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-6 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gradient">EduGame</span>
          </div>
          <nav className="mt-6 flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* User stats */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Points</span>
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{user?.stats?.totalPoints || 0}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="text-xs opacity-90">+127 this week</span>
              </div>
            </div>
            
            {/* Logout button */}
            <button
              onClick={logout}
              className="w-full mt-4 flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-bold text-gradient">EduGame</span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;


