const httpStatus = require('http-status');
const { Document, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a document associated with a course
 * @param {ObjectId} courseId
 * @param {Object} documentBody
 * @returns {Promise<Document>}
 */
const createDocument = async (courseId, documentBody) => {
  const document = await Document.create({
    ...documentBody,
    course: courseId,
  });

  // Update the course to add the document ID to the documents array
  await Course.updateOne({ _id: courseId }, { $push: { documents: document._id } });

  return document;
};

/**
 * Get documents by course ID
 * @param {ObjectId} courseId
 * @returns {Promise<Document[]>}
 */
const getDocumentsByCourseId = async (courseId) => {
  const documents = await Document.find({ course: courseId });
  if (!documents.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document(s) not found');
  }
  return documents;
};

/**
 * Get a document by ID
 * @param {ObjectId} documentId
 * @returns {Promise<Document>}
 */
const getDocumentById = async (documentId) => {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }
  return document;
};

/**
 * Delete a document by ID
 * @param {ObjectId} documentId
 * @returns {Promise<Document>}
 */
const deleteDocumentById = async (documentId) => {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }
  await document.remove();
  return document;
};

module.exports = {
  createDocument,
  getDocumentsByCourseId,
  getDocumentById,
  deleteDocumentById,
};
