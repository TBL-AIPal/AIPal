const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

router
  .route('/:method(rag|multi-agent|combined|direct)/:courseId/:templateId')
  .post(
    auth('createMessage'),
    validate(messageValidation.createMessage),
    messageController.createMessage,
  );

module.exports = router;
