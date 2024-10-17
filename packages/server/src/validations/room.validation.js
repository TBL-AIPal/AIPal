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
    })
    .strict(),
};

const getRooms = {
  // You can define any query parameters or filters if needed
};

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required().messages({
      'any.required': 'Room ID is required',
    }),
  }),
};

const updateRoom = {
  params: Joi.object().keys({
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

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
