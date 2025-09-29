import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import AppLayout from './components/Layout/AppLayout';
import PublicLayout from './components/Layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import PublicQuizzes from './pages/PublicQuizzes';
import PublicLeaderboard from './pages/PublicLeaderboard';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// App Pages (Protected Routes)
import Dashboard from './pages/app/Dashboard';
import Quizzes from './pages/app/Quizzes';
import QuizDetail from './pages/app/QuizDetail';
import Leaderboard from './pages/app/Leaderboard';
import Achievements from './pages/app/Achievements';
import Profile from './pages/app/Profile';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Landing />} />
              <Route path="quizzes" element={<PublicQuizzes />} />
              <Route path="leaderboard" element={<PublicLeaderboard />} />
              <Route path="features" element={<Features />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            
            {/* Protected App Routes with Sidebar */}
            <Route path="/app/*" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quiz/:id" element={<QuizDetail />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


