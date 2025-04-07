const httpStatus = require('http-status');
const pdfParse = require('pdf-parse');
const { Document, Course, Chunk } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteChunksByDocumentId } = require('./chunk.service');

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
    // Extract text and metadata
    const pdfData = await pdfParse(file.buffer);
    documentData.text = pdfData.text;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document type');
  }

  const document = await Document.create({
    ...documentData,
  });

  // Update the course to add the document ID to the documents array
  await Course.updateOne(
    { _id: courseId },
    { $push: { documents: document._id } },
  );

  return document;
};

/**
 * Get documents' metadata by course ID
 * @param {ObjectId} courseId
 * @returns {Promise<Document[]>}
 */
const getDocumentsByCourseId = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: 'documents',
    select: '-data -text',
  });

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
 * Update a document by ID
 * @param {ObjectId} documentId - The ID of the document to update.
 * @param {Object} updateBody - The fields to update.
 * @returns {Promise<Document>} - The updated document.
 */
const updateDocumentById = async (documentId, updateBody) => {
  const document = await getDocumentById(documentId);
  const { filename, status } = updateBody;

  if (filename !== undefined) {
    document.filename = filename.trim();
  }

  if (status !== undefined) {
    // Enforce transition rules for status
    if (
      (document.status === 'completed' || document.status === 'failed') &&
      status !== 'processing'
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot transition from status "${document.status}" to "${status}".`,
      );
    }
    document.status = status;
  }
  await document.save();
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

  await deleteChunksByDocumentId(document._id);

  await document.remove();
  return document;
};

module.exports = {
  createDocument,
  getDocumentsByCourseId,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
};
