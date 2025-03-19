const Joi = require('joi');

const createTutorialGroup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateTutorialGroupUsers = {
    body: Joi.object().keys({
      userIds: Joi.array().items(Joi.string().hex().length(24)).required(),
    }),
  };

module.exports = {
    createTutorialGroup,
    updateTutorialGroupUsers,
};