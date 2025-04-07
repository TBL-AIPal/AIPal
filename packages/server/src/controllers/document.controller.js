const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { documentService, chunkService } = require('../services');
const logger = require('../config/logger');

const createDocument = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }
  logger.verbose('Document upload started.');
  const document = await documentService.createDocument(
    req.params.courseId,
    req.file,
  );
  logger.verbose('Document upload completed.');
  res.status(httpStatus.CREATED).send(document);

  await chunkService.createChunksFromDocumentId(
    req.params.courseId,
    document._id,
  );
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

const updateDocument = catchAsync(async (req, res) => {
  const document = await documentService.updateDocumentById(
    req.params.documentId,
  );
  res.send(document);
  if (document.status == 'processing') {
    await chunkService.createChunksFromDocumentId(document._id);
  }
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
  updateDocument,
  deleteDocument,
};
