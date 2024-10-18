const Joi = require('joi');
const { objectId } = require('./custom.validation');

// API key validation
const apiKeyPattern = /^sk-[a-zA-Z0-9-_]{40,}$/;

const createCourse = {
  body: Joi.object()
    .keys({
      name: Joi.string().required().messages({
        'string.pattern.base': 'Name must be valid',
      }),
      description: Joi.string().allow(''),
      apiKey: Joi.string().pattern(apiKeyPattern).required().messages({
        'string.pattern.base': 'API Key must be valid',
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
      apiKey: Joi.string().pattern(apiKeyPattern).messages({
        'string.pattern.base': 'API Key must be valid',
      }),
      llmConstraints: Joi.array().items(Joi.string()),
      owner: Joi.string().custom(objectId),
      students: Joi.array().items(Joi.string().custom(objectId)),
      staff: Joi.array().items(Joi.string().custom(objectId)),
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
