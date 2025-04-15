const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService, roomService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  const { method, courseId } = req.params;
  const { body } = req;

  console.log(body.roomId);
  // ✅ Get templateId from the room
  const room = await roomService.getRoomById(body.roomId);
  const templateId = room.template;

  let result;

  if (method === 'rag') {
    result = await messageService.createContextualizedReply(courseId, templateId, body);
  } else if (method === 'multi-agent') {
    result = await messageService.createMultiAgentReply(courseId, templateId, body);
  } else if (method === 'combined') {
    result = await messageService.createContextualizedAndMultiAgentReply(courseId, templateId, body);
  } else if (method === 'direct') {
    result = await messageService.createDirectReply(courseId, body); // ✅ doesn't need templateId
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
