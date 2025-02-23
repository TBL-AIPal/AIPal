const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(), // ✅ Required in params
    templateId: Joi.string().custom(objectId).required(), // ✅ Required in params
    method: Joi.string().required(), // ✅ Allow method field
  }),
  body: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required(), // ✅ Moved to body (matches API)
    userId: Joi.string().custom(objectId).required(), // ✅ Required userId (sender)
    sender: Joi.string().optional(), // ✅ Allow sender field
    conversation: Joi.array()
      .items(
        Joi.object({
          role: Joi.string().valid('user', 'assistant', 'system').required(), // ✅ Role validation
          sender: Joi.string().optional(), // ✅ Allow sender inside conversation
          content: Joi.string().required(), // ✅ Content is required
        })
      )
      .min(1)
      .required(), // ✅ At least one message is required
    documents: Joi.array().items(Joi.string().custom(objectId)).optional(), // ✅ Optional document IDs
    constraints: Joi.array().items(Joi.string()).optional(), // ✅ Optional constraints
  }).strict(false), // ✅ Allow extra fields like sender and method
};

module.exports = {
  createMessage,
};