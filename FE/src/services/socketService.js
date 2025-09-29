import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join user-specific room
  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-user-room', userId);
    }
  }

  // Join leaderboard room
  joinLeaderboard() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-leaderboard');
    }
  }

  // Listen for quiz completion notifications
  onQuizCompleted(callback) {
    this.addEventListener('quiz-completed', callback);
  }

  // Listen for achievement unlocks
  onAchievementUnlocked(callback) {
    this.addEventListener('achievement-unlocked', callback);
  }

  // Listen for level up notifications
  onLevelUp(callback) {
    this.addEventListener('level-up', callback);
  }

  // Listen for leaderboard updates
  onLeaderboardUpdate(callback) {
    this.addEventListener('leaderboard-updated', callback);
  }

  // Listen for rare achievements
  onRareAchievement(callback) {
    this.addEventListener('rare-achievement', callback);
  }

  // Listen for streak milestones
  onStreakMilestone(callback) {
    this.addEventListener('streak-milestone', callback);
  }

  // Listen for rank improvements
  onRankImproved(callback) {
    this.addEventListener('rank-improved', callback);
  }

  // Listen for daily challenges
  onDailyChallenge(callback) {
    this.addEventListener('daily-challenge', callback);
  }

  // Listen for study reminders
  onStudyReminder(callback) {
    this.addEventListener('study-reminder', callback);
  }

  // Generic event listener
  addEventListener(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  // Remove event listener
  removeEventListener(event, callback) {
    if (this.socket && this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event);
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
        this.socket.off(event, callback);
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      if (this.listeners.has(event)) {
        this.listeners.delete(event);
      }
    }
  }

  // Clean up all listeners
  cleanup() {
    if (this.socket) {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

export default new SocketService();
