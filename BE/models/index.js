// Import all models to ensure they are registered with Mongoose
const User = require('./User');
const Quiz = require('./Quiz');
const QuizAttempt = require('./QuizAttempt');
const Achievement = require('./Achievement');

module.exports = {
  User,
  Quiz,
  QuizAttempt,
  Achievement
};
