const Joi = require('joi');
const { objectId } = require('./custom.validation');

const apiKeyPattern = /^[a-zA-Z0-9_-]{10,}$/;

const createCourse = {
  body: Joi.object()
    .keys({
      name: Joi.string().required().messages({
        'string.pattern.base': 'Name must be valid',
      }),
      description: Joi.string().allow(''),
      apiKeys: Joi.object()
        .keys({
          gemini: Joi.string().pattern(apiKeyPattern).allow('').optional().messages({
            'string.pattern.base': 'Gemini API Key must be valid',
          }),
          llama: Joi.string().pattern(apiKeyPattern).allow('').optional().messages({
            'string.pattern.base': 'Llama API Key must be valid',
          }),
          chatgpt: Joi.string().pattern(apiKeyPattern).allow('').optional().messages({
            'string.pattern.base': 'ChatGPT API Key must be valid',
          }),
        })
        .or('gemini', 'llama', 'chatgpt') // ✅ At least one must be provided
        .messages({
          'object.base':
            'API keys must be a valid object with Gemini, Llama, and ChatGPT keys',
          'object.missing': 'At least one API key must be provided', // Custom error if none are given
        }),
    })
    .strict(),
};

const getCourses = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID must be valid',
    }),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID must be valid',
    }),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string().allow(''),
      apiKeys: Joi.object()
        .keys({
          gemini: Joi.string().pattern(apiKeyPattern).messages({
            'string.pattern.base': 'Gemini API Key must be valid',
          }),
          llama: Joi.string().pattern(apiKeyPattern).messages({
            'string.pattern.base': 'Llama API Key must be valid',
          }),
          chatgpt: Joi.string().pattern(apiKeyPattern).messages({
            'string.pattern.base': 'ChatGPT API Key must be valid',
          }),
        })
        .messages({
          'object.base':
            'API keys must be a valid object with Gemini, Llama, and ChatGPT keys',
        }),
      llmConstraints: Joi.array().items(Joi.string()),
      owner: Joi.string().custom(objectId),
      students: Joi.array().items(Joi.string().custom(objectId)),
      staff: Joi.array().items(Joi.string().custom(objectId)),
      whitelist: Joi.array().items(Joi.string().email()).messages({
        'string.email': 'Whitelist must contain valid email addresses',
      }), // ✅ Keep whitelist support with email validation
    })
    .min(1)
    .strict(),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID must be valid',
    }),
  }),
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
