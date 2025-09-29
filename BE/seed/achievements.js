const Achievement = require('../models/Achievement');

const sampleAchievements = [
  {
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'quiz',
    type: 'milestone',
    points: 50,
    experience: 100,
    criteria: {
      type: 'quiz_count',
      value: 1
    },
    rarity: 'common'
  },
  {
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: '🏆',
    category: 'quiz',
    type: 'milestone',
    points: 200,
    experience: 300,
    criteria: {
      type: 'quiz_count',
      value: 10
    },
    rarity: 'uncommon'
  },
  {
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '⭐',
    category: 'quiz',
    type: 'single',
    points: 100,
    experience: 200,
    criteria: {
      type: 'score_achieved',
      value: 100
    },
    rarity: 'rare'
  },
  {
    name: 'Streak Master',
    description: 'Complete quizzes for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    type: 'milestone',
    points: 300,
    experience: 500,
    criteria: {
      type: 'streak_days',
      value: 7
    },
    rarity: 'epic'
  },
  {
    name: 'Point Collector',
    description: 'Earn 1000 total points',
    icon: '💰',
    category: 'points',
    type: 'milestone',
    points: 400,
    experience: 400,
    criteria: {
      type: 'points_earned',
      value: 1000
    },
    rarity: 'uncommon'
  },
  {
    name: 'Math Expert',
    description: 'Complete 5 math quizzes',
    icon: '🎓',
    category: 'quiz',
    type: 'milestone',
    points: 250,
    experience: 350,
    criteria: {
      type: 'category_mastery',
      value: 5,
      category: 'math'
    },
    rarity: 'uncommon'
  },
  {
    name: 'Level Up',
    description: 'Reach level 5',
    icon: '📈',
    category: 'level',
    type: 'milestone',
    points: 500,
    experience: 600,
    criteria: {
      type: 'level_reached',
      value: 5
    },
    rarity: 'epic'
  },
  {
    name: 'Science Lover',
    description: 'Complete 3 science quizzes',
    icon: '🔬',
    category: 'quiz',
    type: 'milestone',
    points: 150,
    experience: 200,
    criteria: {
      type: 'category_mastery',
      value: 3,
      category: 'science'
    },
    rarity: 'common'
  },
  {
    name: 'History Buff',
    description: 'Complete 3 history quizzes',
    icon: '📚',
    category: 'quiz',
    type: 'milestone',
    points: 150,
    experience: 200,
    criteria: {
      type: 'category_mastery',
      value: 3,
      category: 'history'
    },
    rarity: 'common'
  },
  {
    name: 'Language Arts Pro',
    description: 'Complete 3 language quizzes',
    icon: '✍️',
    category: 'quiz',
    type: 'milestone',
    points: 150,
    experience: 200,
    criteria: {
      type: 'category_mastery',
      value: 3,
      category: 'language'
    },
    rarity: 'common'
  }
];

const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await Achievement.deleteMany({});
    
    // Insert sample achievements
    const createdAchievements = await Achievement.insertMany(sampleAchievements);
    
    console.log(`✅ Seeded ${createdAchievements.length} achievements successfully!`);
    return createdAchievements;
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    throw error;
  }
};

module.exports = { seedAchievements, sampleAchievements };
