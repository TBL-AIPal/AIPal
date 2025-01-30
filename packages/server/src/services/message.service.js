const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { decrypt } = require('../utils/cryptoUtils');
const config = require('../config/config');
const Course = require('../models/course.model');
const logger = require('../config/logger');
const { generateContextualizedQuery } = require('./RAG/vector.search.service');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Function to send a conversation to the OpenAI API
const callOpenAI = async (messages, apiKey) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // If the error is from the API (e.g., invalid API key, rate limit)
      throw new ApiError(httpStatus.BAD_REQUEST, `OpenAI API Error: ${error.response.data.error.message}`);
    } else if (error.request) {
      // If no response was received (e.g., network issue)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'No response received from OpenAI API');
    } else {
      // Other errors
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error calling OpenAI API: ${error.message}`);
    }
  }
};

/**
 * Create a reply associated with a message
 * @param {ObjectId} courseId
 * @param {Object} messageBody
 * @returns {Promise<Object>}
 */
const createDirectReply = async (courseId, messageBody) => {
  const { conversation } = messageBody; // Full conversation history

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const apiKey = decrypt(course.apiKey, config.encryption.key);

  const response = await callOpenAI(conversation, apiKey);

  const assistantResponse = response.choices[0].message.content;

  // Return the updated conversation history
  return {
    responses: [...conversation, { role: 'assistant', content: assistantResponse }],
  };
};

/**
 * Create a contextualized reply associated with a message
 * @param {ObjectId} courseId
 * @param {Object} messageBody
 * @returns {Promise<Object>}
 */
const createContextualizedReply = async (courseId, messageBody) => {
  const { conversation } = messageBody; // Full conversation history

  // Get the most recent query by user
  const currentQuery = conversation[conversation.length - 1].content;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const apiKey = decrypt(course.apiKey, config.encryption.key);

  // Query with context appended on top of it
  const contextualizedQuery = await generateContextualizedQuery(currentQuery, apiKey);

  logger.info(contextualizedQuery);

  // Updated conversation with context
  const contextualizedConversation = [
    ...conversation.slice(0, conversation.length - 1),
    {
      role: 'user',
      content: contextualizedQuery,
    },
  ];

  const response = await callOpenAI(contextualizedConversation, apiKey);

  const assistantResponse = response.choices[0].message.content;

  // Return the updated conversation history
  return {
    responses: [...conversation, { role: 'assistant', content: assistantResponse }],
  };
};

module.exports = {
  createDirectReply,
  createContextualizedReply,
  // TODO:
  //   createMultiAgentReply,
  //   createContextualizedAndMultiAgentReply,
};
