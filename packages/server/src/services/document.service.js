const httpStatus = require('http-status');
const pdfParse = require('pdf-parse');
const { Document, Course, Chunk } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateEmbedding } = require('./RAG/embedding.service');
const { processText } = require('./RAG/preprocessing.service');
const recursiveSplit = require('../utils/recursiveSplit');
const { decrypt } = require('../utils/cryptoUtils');
const config = require('../config/config');

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

  const document = await Document.create({
    ...documentData,
  });

  // Update the course to add the document ID to the documents array
  await Course.updateOne(
    { _id: courseId },
    { $push: { documents: document._id } },
  );

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  //TODO: https://github.com/TBL-AIPal/AIPal/issues/44
  const apiKey = decrypt(course.apiKeys.chatgpt, config.encryption.key);

  if (documentData.text) {
    const chunksText = recursiveSplit(documentData.text, 1000, 200);
    const chunks = await Promise.all(
      chunksText.map(async (text) => {
        const normalizedData = await processText(text);
        const embedding = await generateEmbedding(normalizedData, apiKey);
        return { text, embedding };
      }),
    );
    await Chunk.insertMany(
      chunks.map((chunk) => ({ ...chunk, document: document._id })),
    );
  }

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
  await Course.updateOne(
    { _id: courseId },
    { $pull: { documents: document._id } },
  );
  // Delete the associated chunks using the document ID
  await Chunk.deleteMany({ Document: document._id });

  await document.remove();
  return document;
};

module.exports = {
  createDocument,
  getDocumentsByCourseId,
  getDocumentById,
  deleteDocumentById,
};
