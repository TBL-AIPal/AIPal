const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRoom = {
  body: Joi.object()
    .keys({
      name: Joi.string().required().messages({
        'any.required': 'Room name is required',
      }),
      description: Joi.string(),
      code: Joi.string().required().messages({
        'any.required': 'Room code is required',
      }),
      template: Joi.string().custom(objectId).required().messages({
        'any.required': 'Template ID is required',
      }),
      selectedModel: Joi.string()
        .valid('chatgpt', 'gemini', 'llama3')
        .required(),
      selectedMethod: Joi.string()
        .valid('direct', 'multi-agent', 'rag', 'combined')
        .required(),
    })
    .strict(),
};

const getRooms = {
  // You can define any query parameters or filters if needed
};

const getRoom = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId), // Ensure this is allowed
    roomId: Joi.string().custom(objectId).required(),
  }),
};

const getRoomsByCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
  }),
};

const getRoomsByTemplate = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
    templateId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Template ID is required',
    }),
  }),
};

const updateRoom = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Course ID is required',
    }),
    roomId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Room ID is required',
    }),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      code: Joi.string(),
      template: Joi.string().custom(objectId),
      allowedUsers: Joi.array().items(Joi.string().custom(objectId)),
      allowedTutorialGroups: Joi.array().items(Joi.string().custom(objectId)),
      selectedModel: Joi.string(),
      selectedMethod: Joi.string(),
    })
    .min(1)
    .strict(),
};

const deleteRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Room ID is required',
    }),
  }),
};

const getMessagesByRoom = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
    roomId: Joi.string().custom(objectId).required(),
  }),
};

const sendMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
    roomId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    sender: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  getRoomsByTemplate,
  getRoomsByCourse,
  updateRoom,
  deleteRoom,
  getMessagesByRoom,
  sendMessage,
};
