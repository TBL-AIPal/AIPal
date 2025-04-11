const { createCanvas } = require("canvas");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
const logger = require("../config/logger");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const { getApiKeyById } = require("./course.service");
const { Chunk, Document } = require("../models");
const { processTextBatch } = require("./RAG/preprocessing.service");
const { getDocumentById } = require("./document.service");
const {
  describePageVisualElements,
  generateEmbedding,
} = require("./RAG/embedding.service");
const LLMError = require("../utils/LLMError");

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
    const { apiKey } = await getApiKeyById(courseId, "chatgpt");

    // Cleanup relevant chunks (if any)
    await deleteChunksByDocumentId(document._id);
    let extractedPages = [];

    if (document.contentType == "application/pdf") {
      extractedPages = await extractPdfTextAndImagesDescription(
        document.data,
        apiKey,
      );
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid document type");
    }

    const chunks = createOverlappingChunks(extractedPages);

    // Normalize chunks
    const normalizedChunks = await processTextBatch(chunks);

    // Add remaining metadata after normalization
    const chunksWithMetadata = normalizedChunks.map(
      (normalizedChunk, index) => {
        const pageNumber = extractedPages[index].page;
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
    logger.verbose("All chunks processed successfully");

    await Document.findOneAndUpdate(
      { _id: document._id },
      { status: "completed" },
    );
    logger.verbose("Document status updated");
  } catch (error) {
    await Document.findOneAndUpdate(
      { _id: documentId },
      {
        status: "failed",
        error: error.userString,
      },
    );
    await deleteChunksByDocumentId(documentId);
    logger.error(error);
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
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Document ${documentId} not found`,
    );
  }

  // Delete the associated chunks using the document ID
  await Chunk.deleteMany({ document: document._id });
  return;
};

/**
 * Process a PDF document by extracting text and description of images
 * @param {Buffer} buffer - The PDF file buffer.
 * @param {string} apiKey - API key for the visual element description service.
 * @param {number} scale - Scale factor for rendering PDF pages (default: 1.0).
 * @returns {Promise<Array>} - An array of objects containing page number, extracted text, and image descriptions (if applicable).
 */
const extractPdfTextAndImagesDescription = async (
  buffer,
  apiKey,
  scale = 1.0,
) => {
  try {
    const processedPages = [];
    const pagesForVisualProcessing = await pdfjsLib.getDocument({
      data: buffer,
      useSystemFonts: true,
    }).promise;

    for (
      let pageIndex = 0;
      pageIndex < pagesForVisualProcessing.numPages;
      pageIndex++
    ) {
      const pageNumber = pageIndex + 1;

      // Get the page
      const page = await pagesForVisualProcessing.getPage(pageNumber);

      // Extract text content
      const textContent = await page.getTextContent();
      const extractedText = textContent.items
        .map((item) => item.str)
        .join(" ")
        .trim();

      logger.verbose(`extracted text for page ${pageNumber}: ${extractedText}`);

      // Check if page has images
      const hasImage = await new Promise((resolve) => {
        page.getOperatorList().then((operatorList) => {
          resolve(
            operatorList.fnArray.some(
              (fn) => fn === pdfjsLib.OPS.paintImageXObject,
            ),
          );
        });
      });

      let description = "No description available";

      if (hasImage) {
        // Render the page
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport }).promise;

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);

        // Generate image descriptions
        logger.verbose(`Analyzing page ${pageNumber} for visual elements`);
        description = await describePageVisualElements(imageDataUrl, apiKey);
      }
      const pageResult = {
        page: pageNumber,
        text: extractedText?.trim() || "",
        imageDescription: description,
      };
      processedPages.push(pageResult);
    }
    return processedPages;
  } catch (error) {
    logger.error(error);
    if (error instanceof LLMError) {
      throw error;
    } else {
      throw new Error(
        "extractPdfTextAndImagesDescription did not complete successfully",
      );
    }
  }
};

function createOverlappingChunks(pages) {
  try {
    const chunks = [];

    for (let i = 0; i < pages.length; i++) {
      const currentPageText = pages[i].text;
      const currentPageImageDescription = pages[i].imageDescription;
      const nextPageText = pages[i + 1]?.text || "";

      // Split into words
      const nextPageWords = nextPageText.split(/\s+/);
      // Take 25% of the next page's words
      const overlapWords = nextPageWords.slice(
        0,
        Math.ceil(nextPageWords.length * 0.25),
      );
      const overlapText = overlapWords.join(" ");
      // Combine the current page text with 25% of the next page's text
      const chunk = `
      Page Text: ${currentPageText}${overlapText ? " " + overlapText : ""}
      
      Visual Description: ${currentPageImageDescription}
      `;

      chunks.push(chunk);

      logger.verbose(`Generated ${chunks.length}/${pages.length} chunks`);
      logger.verbose(`${chunk}`);
    }

    return chunks;
  } catch (error) {
    logger.error(error);
    throw new Error("createOverlappingChunks did not complete successfully");
  }
}

module.exports = {
  createChunksFromDocumentId,
  deleteChunksByDocumentId,
};
