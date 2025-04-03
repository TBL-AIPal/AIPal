const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const httpStatus = require('http-status');
const pdfParse = require('pdf-parse');
const { Document, Course, Chunk } = require('../models');
const ApiError = require('../utils/ApiError');
const {
  generateEmbedding,
  describePageVisualElements,
} = require('./RAG/embedding.service');
const { processTextBatch } = require('./RAG/preprocessing.service');
const splitPagesWithOverlap = require('../utils/splitTexts');
const { decrypt } = require('../utils/cryptoUtils');
const logger = require('../config/logger');
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

  let pdfTitle = '';
  let pagesText = [];
  let pageImages = [];

  if (file.mimetype === 'application/pdf') {
    // Extract text and metadata
    const pdfData = await pdfParse(file.buffer);
    documentData.text = pdfData.text;

    // Extract the title from metadata if available
    if (pdfData.metadata && pdfData.metadata.Title) {
      pdfTitle = pdfData.metadata.Title;
    }

    // Split the text into pages (assume pages are split using \f)
    pagesText = pdfData.text.split('\f').filter((page) => page.trim() !== '');

    // Load the PDF document
    const pdfDoc = await pdfjsLib.getDocument({ data: file.buffer }).promise;

    // Render each page as an image
    pageImages = await Promise.all(
      Array.from({ length: pdfDoc.numPages }, async (_, pageIndex) => {
        const pageNumber = pageIndex + 1;
        const page = await pdfDoc.getPage(pageNumber);

        // Get the viewport for rendering
        const viewport = page.getViewport({ scale: 1.0 });

        // Create a canvas to render the page
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');

        // Render the page onto the canvas
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        // Convert the canvas to an image data URL
        const imageDataUrl = canvas.toDataURL();

        return {
          page: pageNumber,
          imageData: imageDataUrl,
        };
      }),
    );
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
  logger.info('Attempt to retrieve API Key for embeddings');
  const apiKey = decrypt(course.apiKeys.chatgpt, config.encryption.key);
  logger.info('API Key retrieved for embeddings');

  // Generate image description
  const imageDescriptions = await Promise.all(
    pageImages.map(async (image) => {
      logger.info(`Analyzing page ${image.page} for visual elements`);
      const description = await describePageVisualElements(
        image.imageData,
        apiKey,
      );
      return { page: image.page, description };
    }),
  );

  // Create overlapping chunks
  logger.info('Creating overlapping chunks...');
  const overlapPercentage = 0.25; // 25% overlap
  const overlappingChunks = splitPagesWithOverlap(pagesText, overlapPercentage);

  const chunksWithMetadata = [];
  overlappingChunks.forEach((chunk, pageIndex) => {
    const pageNumber = pageIndex + 1;

    // Add image descriptions for the current page
    const pageDescription =
      imageDescriptions.find((img) => img.page === pageNumber)?.description ||
      '';
    const imageDescriptionsText = `[Visual Elements Description: ${pageDescription}]`;

    // Prepend title and page number, and append image descriptions
    const chunkWithMetadata = `[Title: ${pdfTitle}, Page: ${pageNumber}] ${chunk}\n${imageDescriptionsText}`;
    chunksWithMetadata.push(chunkWithMetadata);
  });

  logger.info(`Generated ${chunksWithMetadata.length} chunks`);

  // Normalize and embed chunks
  logger.info('Processing chunks...');
  const normalizedChunks = await processTextBatch(chunksWithMetadata);
  const embeddedChunks = await Promise.all(
    normalizedChunks.map(async (text, index) => {
      logger.info(`Processing chunk ${index + 1}/${normalizedChunks.length}`);
      const embedding = await generateEmbedding(text, apiKey);
      return { text, embedding, document: document._id };
    }),
  );
  logger.info('All chunks processed successfully');

  logger.info('Inserting document chunks into the database...');
  await Chunk.insertMany(embeddedChunks);
  logger.info('Document chunks inserted successfully');

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
