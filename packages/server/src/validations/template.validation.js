const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTemplate = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      'any.required': 'Template name is required',
    }),
    constraints: Joi.array().items(Joi.string()),
  }),
};

const getTemplates = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
  }),
};

const getTemplate = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    templateId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Template ID is required',
    }),
  }),
};

const updateTemplate = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
    templateId: Joi.string().custom(objectId).messages({
      'any.required': 'Template ID is required',
    }),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      constraints: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteTemplate = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).messages({
      'any.required': 'Course ID is required',
    }),
    templateId: Joi.string().custom(objectId).messages({
      'any.required': 'Template ID is required',
    }),
  }),
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};
