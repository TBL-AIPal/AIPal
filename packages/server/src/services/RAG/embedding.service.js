const { OpenAI } = require("openai");
const logger = require("../../config/logger");
const LLMError = require("../../utils/LLMError");

/**
 * Generates an embedding for a given text using OpenAI API
 * @param {string} text - Text to generate embedding for
 * @param {string} apiKey - apiKey to use LLM service
 * @returns {Promise<number[]>} - Embedding vector
 */
const generateEmbedding = async (text, apiKey) => {
  try {
    const client = new OpenAI({ apiKey });
    logger.info("Starting embedding generation for text...");
    const response = await client.embeddings.create(
      {
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      },
      {
        maxRetries: 5,
      },
    );
    logger.info("Embedding generated successfully");
    return response.data[0].embedding;
  } catch (error) {
    throw new LLMError("OpenAI", `${error.error.message}`);
  }
};

/**
 * Describes visual elements in a page
 * @param {string} imageData - Base64-encoded image data
 * @param {string} apiKey - API key to use LLM service
 * @returns {Promise<string>} - Description of visual elements
 */
const describePageVisualElements = async (imageData, apiKey) => {
  try {
    const client = new OpenAI({ apiKey });

    logger.info("Sending image to LLM for analysis...");
    const response = await client.chat.completions.create(
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
              **Prompt:**
              Carefully analyze the provided image of a document page. Your task is to extract and describe *every detail*—both visual and textual—to support accurate question answering and content understanding. This includes:

              ### 1. **Full Text Extraction**
              - Transcribe **every visible word and character** on the page.
              - Include:
                - Titles, headings, subheadings, paragraphs.
                - Labels, legends, footnotes, annotations.
                - Text within diagrams, tables, charts, or figures.
              - Preserve the structure and hierarchy (e.g., section titles before content, bullet points, numbered lists).
              - Maintain the order in which the text would naturally be read.

              ### 2. **Visual Elements Description**
              For **each visual element** (e.g., tables, charts, graphs, diagrams, images, icons):

              - **Identify the type** (e.g., bar chart, flow diagram, table).
              - **Describe its structure and layout**, including axes, labels, legends, and components.
              - **Summarize the information** it conveys, including values, relationships, patterns, or key insights.
              - **Note any emphasis** (e.g., bolded items, color use, callouts).
              - **Explain how it connects** to or supports the surrounding text, if applicable.

              ### 3. **Formatting and Spatial Cues**
              - Mention any formatting that conveys meaning (e.g., bold, italics, underlining, color highlights).
              - Describe spatial relationships between text and visuals (e.g., “the diagram appears below the paragraph on X”).

              If the image contains **no visual elements**, respond:  
              **“No visual elements detected.”**
              `,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      },
      {
        maxRetries: 5,
      },
    );

    logger.info("Image description received successfully");
    const description =
      response.choices[0]?.message?.content || "No visual elements detected";
    return description;
  } catch (error) {
    throw new LLMError("OpenAI", `${error.error.message}`);
  }
};

module.exports = {
  generateEmbedding,
  describePageVisualElements,
};
