const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');

const createDocument = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }

  const documentData = {
    filename: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
    size: req.file.buffer.length,
  };

  const document = await documentService.createDocument(req.params.courseId, documentData);
  res.status(httpStatus.CREATED).send(document);
});

const getDocuments = catchAsync(async (req, res) => {
  const documents = await documentService.getDocumentsByCourseId(req.params.courseId);
  res.send(documents);
});

const getDocument = catchAsync(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.documentId);
  res.send(document);
});

const deleteDocument = catchAsync(async (req, res) => {
  const document = await documentService.deleteDocumentById(req.params.documentId);
  if (!document) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDocument,
  getDocuments,
  getDocument,
  deleteDocument,
};