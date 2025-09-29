const Joi = require('joi');

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// User validation schemas
const userValidation = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional().allow(''),
    lastName: Joi.string().trim().min(2).max(50).optional().allow(''),
    email: Joi.string().email().optional().allow(''),
    preferences: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        push: Joi.boolean().optional(),
        achievements: Joi.boolean().optional()
      }).optional(),
      difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
      subjects: Joi.array().items(Joi.string().valid('math', 'science', 'history', 'language', 'geography', 'art')).optional()
    }).optional()
  }).min(1) // At least one field must be provided
};

// Quiz validation schemas
const quizValidation = {
  create: Joi.object({
    title: Joi.string().trim().min(5).max(100).required()
      .messages({
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string().trim().min(10).max(500).required()
      .messages({
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
      }),
    category: Joi.string().valid('math', 'science', 'history', 'language', 'geography', 'art').required()
      .messages({
        'any.only': 'Category must be one of: math, science, history, language, geography, art',
        'any.required': 'Category is required'
      }),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required()
      .messages({
        'any.only': 'Difficulty must be one of: beginner, intermediate, advanced',
        'any.required': 'Difficulty is required'
      }),
    timeLimit: Joi.number().integer().min(1).max(120).required()
      .messages({
        'number.min': 'Time limit must be at least 1 minute',
        'number.max': 'Time limit cannot exceed 120 minutes',
        'any.required': 'Time limit is required'
      }),
    questions: Joi.array().items(
      Joi.object({
        question: Joi.string().trim().min(10).required(),
        options: Joi.array().items(Joi.string().trim().min(1)).length(4).required(),
        correctAnswer: Joi.number().integer().min(0).max(3).required(),
        explanation: Joi.string().trim().max(500),
        points: Joi.number().integer().min(1).max(100).default(10),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner')
      })
    ).min(1).max(50).required()
      .messages({
        'array.min': 'Quiz must have at least 1 question',
        'array.max': 'Quiz cannot have more than 50 questions',
        'any.required': 'Questions are required'
      }),
    tags: Joi.array().items(Joi.string().trim().max(20)).max(10)
  }),

  submitAttempt: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedAnswer: Joi.number().integer().min(0).max(3).required(),
        timeSpent: Joi.number().min(0).required()
      })
    ).required(),
    timeSpent: Joi.number().min(0).required()
  })
};

// Contact validation schemas
const contactValidation = {
  sendMessage: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    subject: Joi.string().trim().min(5).max(200).required()
      .messages({
        'string.min': 'Subject must be at least 5 characters',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    message: Joi.string().trim().min(10).max(2000).required()
      .messages({
        'string.min': 'Message must be at least 10 characters',
        'string.max': 'Message cannot exceed 2000 characters',
        'any.required': 'Message is required'
      })
  })
};

module.exports = {
  validate,
  userValidation,
  quizValidation,
  contactValidation
};
