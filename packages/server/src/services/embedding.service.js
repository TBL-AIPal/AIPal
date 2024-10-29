const { OpenAI } = require('openai');
const logger = require('../config/logger');

require('dotenv').config({ path: '../.env' });

// OpenAI configuration with API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates an embedding for a given text using OpenAI API
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<number[]>} - Embedding vector
 */
const generateEmbedding = async (text) => {
  try {
    logger.info('Starting embedding generation for text...');
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    logger.info('Embedding generated successfully');
    return response.data[0].embedding;
  } catch (error) {
    throw new Error('Failed to generate embedding');
  }
};

module.exports = {
  generateEmbedding,
};
