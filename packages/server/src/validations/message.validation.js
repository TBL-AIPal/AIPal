const Joi = require('joi');

const createMessage = {
  params: {
    method: Joi.string().allow('direct', 'rag', 'multi-agent', 'combined'),
    courseId: Joi.string().required(),
    templateId: Joi.string().required(),
  },
  body: Joi.object({
    conversation: Joi.array().items(Joi.object()).required(),
    constraints: Joi.array().items(Joi.string()).optional(),
  }),
};

module.exports = {
  createMessage,
};
