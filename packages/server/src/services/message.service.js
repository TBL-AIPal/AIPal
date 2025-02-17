const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');

const Course = require('../models/course.model');
const logger = require('../config/logger');
const { generateContextualizedQuery } = require('./RAG/vector.search.service');

const { getApiKeyById } = require('./course.service');
const { getTemplateById } = require('./template.service');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

const callGroqLLaMA = async (messages, apiKey) => {
  return axios.post(
    GROQ_API_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

const callGemini = async (messages, apiKey) => {
  return axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    { contents: [{ role: 'user', parts: [{ text: messages[messages.length - 1].content }] }] },
    { headers: { 'Content-Type': 'application/json' } }
  );
};

// Helper function to segment text into chunks
const segmentText = (text, chunkSize) => {
  return Array.from({ length: Math.ceil(text.length / chunkSize) }, (_, i) =>
    text.slice(i * chunkSize, i * chunkSize + chunkSize)
  ); // Use Array.from to create chunks
};

// Helper function to process chunks sequentially
const processChunksSequentially = async (chunks, conversation, apiKey) => {
  let finalSummary = ''; // Initialize the final summary

  // Process each chunk sequentially using reduce
  await chunks.reduce(async (previousPromise, chunk) => {
    await previousPromise; // Wait for the previous promise to resolve

    // Create the system message
    let systemMessageContent = `You need to read the current source text and summary of previous source text (if any) and generate a summary to include them both.`;
    // Include the previous summary if it exists
    if (finalSummary) {
      systemMessageContent += ` Summary of previous source text: "${finalSummary}".`;
    }

    // Append the current chunk to the system message
    systemMessageContent += ` Current source text: "${chunk}"`;

    const conversationWithChunk = [{ role: 'system', content: systemMessageContent }, ...conversation];

    // Call the OpenAI API with the constructed conversation
    const primaryResponse = await callOpenAI(conversationWithChunk, apiKey);
    finalSummary = primaryResponse.choices[0].message.content; // Update the final summary with the latest response
  }, Promise.resolve()); // Start with a resolved promise

  return finalSummary; // Return the final summary after processing all chunks
};

// Helper function to process documents into summaries
const processDocuments = async (documents, conversation, apiKey) => {
  const summaryPromises = documents.map(async (doc) => {
    const chunks = segmentText(doc.text, 2048); // Segment document text into 2048-character chunks
    return processChunksSequentially(chunks, conversation, apiKey); // Process chunks sequentially
  });
  return Promise.all(summaryPromises); // Wait for all document processing to complete
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

  const { apiKey } = await getApiKeyById(courseId);

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
 * @param {ObjectId} templateId
 * @param {Object} messageBody
 * @returns {Promise<Object>}
 */
const createContextualizedReply = async (courseId, templateId, messageBody) => {
  const { conversation } = messageBody;

  // Get the most recent query by user
  const currentQuery = conversation[conversation.length - 1].content;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const { apiKey } = await getApiKeyById(courseId);

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }

  const documentIds = template.documents;

  const contextualizedQuery = await generateContextualizedQuery(currentQuery, apiKey, documentIds);

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

/**
 * Create a multi-agent reply associated with a message
 * @param {ObjectId} courseId
 * @param {Object} messageBody
 * @returns {Promise<Object>}
 */
const createMultiAgentReply = async (courseId, messageBody) => {
  const { conversation, documents, constraints } = messageBody;

  const { apiKey } = await getApiKeyById(courseId);

  // Process documents into summaries
  const summaries = await processDocuments(documents, conversation, apiKey);
  const finalSummary = summaries.join(' ');

  // Prepare the manager agent conversation
  const constraintsString = constraints.join(', ');
  const managerConversation = [
    {
      role: 'system',
      content: `This source is too long and has been summarized. You need to answer based on the summary: "${finalSummary}". Please ensure your response satisfies the following constraints: ${constraintsString}.`,
    },
    {
      role: 'user',
      content: conversation[conversation.length - 1].content,
    },
  ];

  const response = await callOpenAI(managerConversation, apiKey);
  const assistantResponse = response.choices[0].message.content;

  return {
    responses: [...conversation, { role: 'assistant', content: assistantResponse }],
  };
};

/**
 * Create a contextualized and multi-agent reply associated with a message
 * @param {ObjectId} courseId
 * @param {ObjectId} templateId
 * @param {Object} messageBody
 * @returns {Promise<Object>}
 */
const createContextualizedAndMultiAgentReply = async (courseId, templateId, messageBody) => {
  const { conversation, documents, constraints } = messageBody;

  const { apiKey } = await getApiKeyById(courseId);

  // Generate a contextualized query
  const currentQuery = conversation[conversation.length - 1].content;
  const documentIds = getTemplateById(templateId).documents;
  const contextualizedQuery = await generateContextualizedQuery(currentQuery, apiKey, documentIds);
  logger.info(contextualizedQuery);

  // Process documents into summaries
  const summaries = await processDocuments(documents, conversation, apiKey);
  const finalSummary = summaries.join(' ');

  // Prepare the manager agent conversation
  const constraintsString = constraints.join(', ');
  const managerConversation = [
    {
      role: 'system',
      content: `This source is too long and has been summarized. You need to answer based on the summary: "${finalSummary}". Please ensure your response satisfies the following constraints: ${constraintsString}.`,
    },
    {
      role: 'user',
      content: contextualizedQuery,
    },
  ];

  const response = await callOpenAI(managerConversation, apiKey);
  const assistantResponse = response.choices[0].message.content;

  return {
    responses: [...conversation, { role: 'assistant', content: assistantResponse }],
  };
};

const createGeminiReply = async (courseId, templateId, messageBody) => {
  const { conversation } = messageBody;
  const { apiKey } = await getApiKeyById(courseId);
  const response = await callGemini(conversation, apiKey);
  const assistantResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
  return { responses: [...conversation, { role: 'assistant', content: assistantResponse }] };
};

const createLlama3Reply = async (courseId, templateId, messageBody) => {
  const { conversation } = messageBody;
  const { apiKey } = await getApiKeyById(courseId);
  const response = await callGroqLLaMA(conversation, apiKey);
  const assistantResponse = response?.data?.choices?.[0]?.message?.content || 'No response from LLaMA 3';
  return { responses: [...conversation, { role: 'assistant', content: assistantResponse }] };
};

module.exports = {
  createDirectReply,
  createContextualizedReply,
  createMultiAgentReply,
  createContextualizedAndMultiAgentReply,
  createGeminiReply,
  createLlama3Reply,
};
