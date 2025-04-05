const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');
const logger = require('../config/logger');

const createDocument = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }
  logger.info('Document creation started.');
  const document = await documentService.createDocument(
    req.params.courseId,
    req.file,
  );
  logger.info('Document creation completed.');
  res.status(httpStatus.CREATED).send(document);
});

const getDocuments = catchAsync(async (req, res) => {
  const documents = await documentService.getDocumentsByCourseId(
    req.params.courseId,
  );
  res.send(documents);
});

const getDocument = catchAsync(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.documentId);
  res.send(document);
});

const deleteDocument = catchAsync(async (req, res) => {
  await documentService.deleteDocumentById(
    req.params.courseId,
    req.params.documentId,
  );
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDocument,
  getDocuments,
  getDocument,
  deleteDocument,
};
