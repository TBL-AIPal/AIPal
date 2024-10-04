const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { templateService } = require('../services');

const createTemplate = catchAsync(async (req, res) => {
  const template = await templateService.createTemplate(req.params.courseId, req.body);
  res.status(httpStatus.CREATED).send(template);
});

const getTemplates = catchAsync(async (req, res) => {
  const templates = await templateService.getTemplatesByCourseId(req.params.courseId);
  res.send(templates);
});

const getTemplate = catchAsync(async (req, res) => {
  const template = await templateService.getTemplateById(req.params.templateId);
  res.send(template);
});

const updateTemplate = catchAsync(async (req, res) => {
  const template = await templateService.updateTemplateById(req.params.templateId, req.body);
  res.send(template);
});

const deleteTemplate = catchAsync(async (req, res) => {
  await templateService.deleteTemplateById(req.params.courseId, req.params.templateId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};
