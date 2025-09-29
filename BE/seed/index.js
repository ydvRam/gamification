const mongoose = require('mongoose');
require('dotenv').config();

// Import seed functions
const { seedQuizzes } = require('./quizzes');
const { seedAchievements } = require('./achievements');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edugame');
    console.log('📚 Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Run all seed functions
const runSeeds = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    // Seed quizzes
    await seedQuizzes();
    
    // Seed achievements
    await seedAchievements();
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };
