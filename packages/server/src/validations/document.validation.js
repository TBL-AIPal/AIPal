const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDocument = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
  }),
  file: Joi.object().required().messages({
    'any.required': 'File is required',
  }),
};

const getDocuments = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
  }),
};

const getDocument = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
    documentId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Document ID is required',
    }),
  }),
};

const updateDocument = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
    documentId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Document ID is required',
    }),
  }),
  body: Joi.object()
    .keys({
      filename: Joi.string().min(1).optional(),
      status: Joi.string()
        .valid('processing', 'completed', 'failed')
        .optional(),
    })
    .or('filename', 'status')
    .messages({
      'object.missing':
        'At least one of "filename" or "status" must be provided',
    }),
};

const deleteDocument = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
    documentId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
  }),
};

module.exports = {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
};
