const Quiz = require('../models/Quiz');

const sampleQuizzes = [
  {
    title: 'Basic Algebra Fundamentals',
    description: 'Master the basics of algebra with interactive problems and step-by-step solutions.',
    category: 'math',
    difficulty: 'beginner',
    timeLimit: 15,
    totalPoints: 100,
    tags: ['algebra', 'equations', 'variables'],
    createdBy: '507f1f77bcf86cd799439011', // Sample admin user ID
    questions: [
      {
        question: 'What is the value of x in the equation 2x + 5 = 13?',
        options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
        correctAnswer: 0,
        explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
        points: 10,
        difficulty: 'beginner'
      },
      {
        question: 'Simplify: 3(x + 2) - 2x',
        options: ['x + 6', 'x + 2', '5x + 6', 'x - 6'],
        correctAnswer: 0,
        explanation: 'Distribute: 3x + 6 - 2x = x + 6',
        points: 10,
        difficulty: 'beginner'
      },
      {
        question: 'Solve for y: 2y - 7 = 3y + 1',
        options: ['y = -8', 'y = 8', 'y = -6', 'y = 6'],
        correctAnswer: 0,
        explanation: 'Subtract 2y from both sides: -7 = y + 1, then subtract 1: y = -8',
        points: 15,
        difficulty: 'intermediate'
      }
    ]
  },
  {
    title: 'World War II History',
    description: 'Comprehensive quiz covering major events, battles, and figures of World War II.',
    category: 'history',
    difficulty: 'intermediate',
    timeLimit: 25,
    totalPoints: 150,
    tags: ['world war', 'history', 'battles'],
    createdBy: '507f1f77bcf86cd799439011', // Sample admin user ID
    questions: [
      {
        question: 'When did World War II officially begin?',
        options: ['September 1, 1939', 'December 7, 1941', 'June 6, 1944', 'May 8, 1945'],
        correctAnswer: 0,
        explanation: 'World War II began on September 1, 1939, when Germany invaded Poland.',
        points: 15,
        difficulty: 'beginner'
      },
      {
        question: 'Which battle is considered the turning point of the war in the Pacific?',
        options: ['Pearl Harbor', 'Midway', 'Iwo Jima', 'Okinawa'],
        correctAnswer: 1,
        explanation: 'The Battle of Midway (June 4-7, 1942) was the turning point in the Pacific.',
        points: 20,
        difficulty: 'intermediate'
      },
      {
        question: 'Who was the Prime Minister of Britain during most of World War II?',
        options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'],
        correctAnswer: 1,
        explanation: 'Winston Churchill served as Prime Minister from 1940 to 1945.',
        points: 15,
        difficulty: 'beginner'
      }
    ]
  },
  {
    title: 'Photosynthesis Process',
    description: 'Learn about how plants convert sunlight into energy through photosynthesis.',
    category: 'science',
    difficulty: 'beginner',
    timeLimit: 12,
    totalPoints: 80,
    tags: ['biology', 'plants', 'energy'],
    createdBy: '507f1f77bcf86cd799439011', // Sample admin user ID
    questions: [
      {
        question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 1,
        explanation: 'Plants absorb carbon dioxide (CO2) from the atmosphere during photosynthesis.',
        points: 10,
        difficulty: 'beginner'
      },
      {
        question: 'What is the main product of photosynthesis?',
        options: ['Water', 'Glucose', 'Oxygen', 'Chlorophyll'],
        correctAnswer: 1,
        explanation: 'Glucose (sugar) is the main product of photosynthesis, along with oxygen.',
        points: 15,
        difficulty: 'beginner'
      },
      {
        question: 'Which part of the plant cell contains chlorophyll?',
        options: ['Nucleus', 'Chloroplast', 'Mitochondria', 'Cell Wall'],
        correctAnswer: 1,
        explanation: 'Chloroplasts contain chlorophyll, the green pigment that captures light energy.',
        points: 15,
        difficulty: 'intermediate'
      }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    // Clear existing quizzes
    await Quiz.deleteMany({});
    
    // Insert sample quizzes
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    
    console.log(`✅ Seeded ${createdQuizzes.length} quizzes successfully!`);
    return createdQuizzes;
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  }
};

module.exports = { seedQuizzes, sampleQuizzes };
