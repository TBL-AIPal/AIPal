const httpStatus = require('http-status');
const pdfParse = require('pdf-parse');
const { Document, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateEmbedding } = require('./embedding.service');

/**
 * Create a document associated with a course and generate its embedding
 * @param {ObjectId} courseId
 * @param {Object} file
 * @returns {Promise<Document>}
 */
const createDocument = async (courseId, file) => {
  const documentData = {
    filename: file.originalname,
    data: file.buffer,
    contentType: file.mimetype,
    size: file.buffer.length,
    text: '',
  };

  if (file.mimetype === 'application/pdf') {
    const pdfData = await pdfParse(file.buffer);
    documentData.text = pdfData.text;
  }

  if (documentData.text) {
    const embedding = await generateEmbedding(documentData.text);
    documentData.embedding = embedding;
  }

  const document = await Document.create({
    ...documentData,
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
  const course = await Course.findById(courseId).populate('documents');
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  // Return an empty array if no documents are found
  return course.documents.length ? course.documents : [];
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
 * @param {ObjectId} courseId
 * @param {ObjectId} documentId
 * @returns {Promise<Document>}
 */
const deleteDocumentById = async (courseId, documentId) => {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }

  // Update the course to remove the document ID in the documents array
  await Course.updateOne({ _id: courseId }, { $pull: { documents: document._id } });

  await document.remove();
  return document;
};

module.exports = {
  createDocument,
  getDocumentsByCourseId,
  getDocumentById,
  deleteDocumentById,
};
