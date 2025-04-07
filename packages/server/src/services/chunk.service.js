const { createCanvas } = require('canvas');
const Tesseract = require('tesseract.js');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const logger = require('../config/logger');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const {
  processTextBatch,
  describePageVisualElements,
  generateEmbedding,
  getDocumentById,
} = require('../services');
const { getApiKeyById } = require('./course.service');
const { Chunk } = require('../models');

/**
 * Create document chunks and generate its embedding
 * @param {ObjectId} courseId
 * @param {ObjectId} documentId
 * @returns {Promise<Document>}
 */
const createChunksFromDocumentId = async (courseId, documentId) => {
  try {
    const document = await getDocumentById(documentId);
    //TODO: https://github.com/TBL-AIPal/AIPal/issues/44
    const apiKey = getApiKeyById(courseId, 'openai');

    let pageImages = [];

    if (document.mimetype == 'application/pdf') {
      pageImages = await processPdfWithOCR(document.data);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document type');
    }

    // Generate image descriptions
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

    const chunks = createOverlappingChunks(pageImages, imageDescriptions);

    // Normalize chunks
    const normalizedChunks = await processTextBatch(chunks);

    // Add remaining metadata after normalization
    const chunksWithMetadata = normalizedChunks.map(
      (normalizedChunk, index) => {
        const pageNumber = pageImages[index].page;
        return {
          normalized: `[Title: ${document.filename}, Page: ${pageNumber}] ${normalizedChunk}`,
          actual: `[Title: ${document.filename}, Page: ${pageNumber}] ${chunks[index]}`,
        };
      },
    );

    // Generate embeddings
    const embeddedChunks = await Promise.all(
      chunksWithMetadata.map(async (chunkWithMetadata, _) => {
        const embedding = await generateEmbedding(
          chunkWithMetadata.normalized,
          apiKey,
        );
        return {
          text: chunkWithMetadata.actual,
          embedding,
          document: document._id,
        };
      }),
    );

    await Chunk.insertMany(embeddedChunks);
    logger.verbose('All chunks processed successfully');

    await Document.findOneAndUpdate(
      { _id: document._id },
      { status: 'completed' },
    );
    logger.verbose('Document status updated');
  } catch (error) {
    // Update document status to failed
    await Document.findOneAndUpdate(
      { _id: document._id },
      { status: 'failed' },
    );
    // Cleanup relevant chunks (if any)
    await deleteChunksByDocumentId(document._id);
    logger.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to process document chunks',
    );
  }
};

/**
 * Delete a document by ID
 * @param {ObjectId} courseId
 * @param {ObjectId} documentId
 * @returns {Promise<Document>}
 */
const deleteChunksByDocumentId = async (documentId) => {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
  }

  // Delete the associated chunks using the document ID
  await Chunk.deleteMany({ document: document._id });
  return;
};

const processPdfWithOCR = async ({
  buffer,
  scale = 1.0,
  ocrLanguage = 'eng',
}) => {
  try {
    const pdfDoc = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pageImages = [];

    for (let pageIndex = 0; pageIndex < pdfDoc.numPages; pageIndex++) {
      const pageNumber = pageIndex + 1;
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);

      logger.verbose(`Performing OCR on page ${pageNumber}`);
      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(imageDataUrl, ocrLanguage);
      logger.verbose(`Finished OCR on page ${pageNumber}`);
      logger.verbose(`Extracted Text: ${ocrText}`);
      pageImages.push({
        page: pageNumber,
        imageData: imageDataUrl,
        text: ocrText?.trim() || '',
      });
    }

    return pageImages;
  } catch (error) {
    logger.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'processPdfWithOCR did not complete successfully',
    );
  }
};

function createOverlappingChunks(pageImages, imageDescriptions) {
  try {
    const chunks = [];

    for (let i = 0; i < pageImages.length; i++) {
      const currentPageText = pageImages[i].text;

      // Get the text of the next page (if it exists)
      const nextPageText = pageImages[i + 1]?.text || '';
      const nextPageWords = nextPageText.split(/\s+/); // Split into words
      const overlapWords = nextPageWords.slice(
        0,
        Math.ceil(nextPageWords.length * 0.25), // Take 25% of the next page's words
      );
      const overlapText = overlapWords.join(' ');

      // Combine the current page text with 25% of the next page's text
      const chunk = `${currentPageText}${overlapText ? ' ' + overlapText : ''}`;

      // Add image descriptions for the current page
      const pageDescription =
        imageDescriptions.find((img) => img.page === pageImages[i].page)
          ?.description || '';
      const imageDescriptionsText = `[Additional Description]: ${pageDescription}`;

      const chunkWithImageDescription = `${chunk}\n${imageDescriptionsText}`;
      chunks.push(chunkWithImageDescription);

      logger.verbose(`Generated ${chunks.length}/${pageImages.length} chunks`);
      logger.verbose(`${chunkWithImageDescription}`);
    }

    return chunks;
  } catch (error) {
    logger.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'createOverlappingChunks did not complete successfully',
    );
  }
}

module.exports = {
  createChunksFromDocumentId,
  deleteChunksByDocumentId,
};
