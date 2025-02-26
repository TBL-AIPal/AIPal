const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  const { method, courseId, templateId } = req.params;

  const { body } = req;

  let result;

  if (method === 'rag') {
    result = await messageService.createContextualizedReply(
      courseId,
      templateId,
      body,
    );
  } else if (method === 'multi-agent') {
    result = await messageService.createMultiAgentReply(courseId, body);
  } else if (method === 'combined') {
    result = await messageService.createContextualizedAndMultiAgentReply(
      courseId,
      templateId,
      body,
    );
  } else if (method === 'direct') {
    result = await messageService.createDirectReply(courseId, body);
  } else if (method === 'gemini') {
    result = await messageService.createGeminiReply(courseId, templateId, body);
  } else if (method === 'llama3') {
    result = await messageService.createLlama3Reply(courseId, templateId, body);
  } else {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid method' });
    return;
  }

  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  createMessage,
};
