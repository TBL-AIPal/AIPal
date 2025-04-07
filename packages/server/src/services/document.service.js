const { createCanvas } = require("canvas");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
const httpStatus = require("http-status");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { Document, Course, Chunk } = require("../models");
const ApiError = require("../utils/ApiError");
const {
  generateEmbedding,
  describePageVisualElements,
} = require("./RAG/embedding.service");
const { processTextBatch } = require("./RAG/preprocessing.service");
const { decrypt } = require("../utils/cryptoUtils");
const logger = require("../config/logger");
const config = require("../config/config");

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
    text: "",
  };

  let pdfTitle = "";
  let pagesText = [];
  let pageImages = [];

  if (file.mimetype === "application/pdf") {
    // Extract text and metadata
    const pdfData = await pdfParse(file.buffer);
    documentData.text = pdfData.text;

    // Extract the title from metadata if available
    if (pdfData.metadata && pdfData.metadata.Title) {
      pdfTitle = pdfData.metadata.Title;
    }

    // Load the PDF document
    const pdfDoc = await pdfjsLib.getDocument({ data: file.buffer }).promise;

    // Render pages and extract text/images
    pageImages = [];
    for (let pageIndex = 0; pageIndex < pdfDoc.numPages; pageIndex++) {
      const pageNumber = pageIndex + 1;
      const page = await pdfDoc.getPage(pageNumber);

      // Get the viewport for rendering
      const viewport = page.getViewport({ scale: 1.0 });

      // Create a canvas to render the page
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");

      // Render the page onto the canvas
      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      }).promise;

      // Convert the canvas to an image data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);

      // Extract text from the image
      logger.verbose(`Performing OCR on page ${pageNumber}`);
      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(imageDataUrl);
      logger.verbose(`Finish performing OCR on page ${pageNumber}`);
      logger.verbose(`Extracted Text: ${ocrText}`);

      // Store the extracted text for chunking
      pagesText.push(ocrText?.trim() || "");

      pageImages.push({
        page: pageNumber,
        imageData: imageDataUrl,
        text: ocrText?.trim() || "",
      });
    }
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
    throw new Error("Course not found");
  }

  //TODO: https://github.com/TBL-AIPal/AIPal/issues/44
  logger.verbose("Attempt to retrieve API Key for embeddings");
  const apiKey = decrypt(course.apiKeys.chatgpt, config.encryption.key);
  logger.verbose("API Key retrieved for embeddings");

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

  // Create overlapping chunks
  logger.verbose("Creating overlapping chunks...");
  const chunks = [];
  for (let i = 0; i < pageImages.length; i++) {
    const currentPageText = pageImages[i].text;

    const nextPageText = pageImages[i + 1]?.text || "";
    const nextPageWords = nextPageText.split(/\s+/); // Split into words
    const overlapWords = nextPageWords.slice(
      0,
      Math.ceil(nextPageWords.length * 0.25),
    ); // 25% of next page
    const overlapText = overlapWords.join(" ");

    // Combine the current page text with 25% of the next page's text
    const chunk = `${currentPageText}${overlapText ? " " + overlapText : ""}`;

    // Add image descriptions for the current page
    const pageDescription =
      imageDescriptions.find((img) => img.page === pageImages[i].page)
        ?.description || "";
    const imageDescriptionsText = `[Additional Description]: ${pageDescription}`;

    // Append the image description to the chunk before normalization
    const chunkWithImageDescription = `${chunk}\n${imageDescriptionsText}`;
    chunks.push(chunkWithImageDescription);
  }

  logger.verbose(`Generated ${chunks.length} chunks`);

  // Normalize chunks
  logger.verbose("Normalizing chunks...");
  const normalizedChunks = await processTextBatch(chunks);

  // Add remaining metadata after normalization
  logger.verbose("Adding remaining metadata to normalized chunks...");
  const chunksWithMetadata = normalizedChunks.map((normalizedChunk, index) => {
    const pageNumber = pageImages[index].page;

    return {
      normalized: `[Title: ${pdfTitle}, Page: ${pageNumber}] ${normalizedChunk}`,
      actual: `[Title: ${pdfTitle}, Page: ${pageNumber}] ${chunks[index]}`,
    };
  });
  logger.verbose(`Added metadata to ${chunksWithMetadata.length} chunks`);

  // Generate embeddings
  logger.verbose("Generating embeddings for chunks...");
  const embeddedChunks = await Promise.all(
    chunksWithMetadata.map(async (chunkWithMetadata, index) => {
      logger.verbose(
        `Processing chunk ${index + 1}/${chunksWithMetadata.length}`,
      );
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

  logger.verbose("All chunks processed successfully");

  logger.verbose("Inserting document chunks into the database...");
  await Chunk.insertMany(embeddedChunks);
  logger.verbose("Document chunks inserted successfully");

  return document;
};

/**
 * Get documents' metadata by course ID
 * @param {ObjectId} courseId
 * @returns {Promise<Document[]>}
 */
const getDocumentsByCourseId = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "documents",
    select: "-data -text",
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Document not found");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Document not found");
  }

  // Update the course to remove the document ID in the documents array
  await Course.updateOne(
    { _id: courseId },
    { $pull: { documents: document._id } },
  );

  // Delete the associated chunks using the document ID
  await Chunk.deleteMany({ document: document._id });

  await document.remove();
  return document;
};

module.exports = {
  createDocument,
  getDocumentsByCourseId,
  getDocumentById,
  deleteDocumentById,
};
