const Joi = require('joi');
const { objectId } = require('./custom.validation');

// API key validation
const apiKeyPattern = /^sk-[A-Za-z0-9]{48}$/;

const createCourse = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    apiKey: Joi.string().pattern(apiKeyPattern).required().messages({
      'string.pattern.base': 'API Key must be valid',
    }),
    llmConstraints: Joi.array().items(Joi.string()),
    owner: Joi.string().custom(objectId).required(),
    students: Joi.array().items(Joi.string().custom(objectId)),
    staff: Joi.array().items(Joi.string().custom(objectId)),
    documents: Joi.array().items(Joi.string().custom(objectId)),
    template: Joi.array().items(Joi.string().custom(objectId)),
  }),
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
    courseId: Joi.string().custom(objectId),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
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
      documents: Joi.array().items(Joi.string().custom(objectId)),
      template: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
