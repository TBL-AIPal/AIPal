const { OpenAI } = require('openai');
const logger = require('../../config/logger');
const fs = require('fs');

/**
 * Generates an embedding for a given text using OpenAI API
 * @param {string} text - Text to generate embedding for
 * @param {string} apiKey - apiKey to use LLM service
 * @returns {Promise<number[]>} - Embedding vector
 */
const generateEmbedding = async (text, apiKey) => {
  try {
    const client = new OpenAI({ apiKey });
    logger.info('Starting embedding generation for text...');
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    logger.info('Embedding generated successfully');
    return response.data[0].embedding;
  } catch (error) {
    logger.info(error);
    throw new Error('Failed to generate embedding');
  }
};

/**
 * Describes visual elements in a page
 * @param {string} imagePath - Path to the image file
 * @param {string} apiKey - API key to use LLM service
 * @returns {Promise<string>} - Description of visual elements
 */
const describePageVisualElements = async (imagePath, apiKey) => {
  try {
    const client = new OpenAI({ apiKey });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    logger.info('Sending image to LLM for analysis...');
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `
                Analyze this page carefully for any visual elements such as diagrams, charts, graphs, tables, images, or other graphical content. 
                
                For each visual element:
                - Describe its structure and layout.
                - Summarize the key information it conveys.
                - Highlight any trends, patterns, relationships, or notable data points.
                - If applicable, explain how the visual supports the surrounding text or enhances understanding of the topic.
                
                If there are no visual elements, state "No visual elements detected."
                
                Ensure your description is concise, clear, and provides sufficient context for someone asking questions about the content of this page.
              `,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    logger.info('Image description received successfully');
    const description =
      response.choices[0]?.message?.content || 'No visual elements detected';
    return description;
  } catch (error) {
    logger.error('Error describing page:', error);
    throw new Error('Failed to describe page');
  }
};

module.exports = {
  generateEmbedding,
  describePageVisualElements,
};
