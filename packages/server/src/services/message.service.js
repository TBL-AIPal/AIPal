const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');

const Course = require('../models/course.model');
const ChatMessage = require('../models/chatMessage.model'); // ✅ Import ChatMessage model
const logger = require('../config/logger');
const { generateContextualizedQuery } = require('./RAG/vector.search.service');

const { getApiKeyById } = require('./course.service');
const { getTemplateById } = require('./template.service');
const { getDocumentById } = require('./document.service');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// **🔹 Function to save messages to the database**
const saveMessage = async ({ roomId, sender, content, modelUsed }) => {
  try {
    const message = new ChatMessage({ roomId, sender, content, modelUsed });
    await message.save();
  } catch (error) {
    logger.error('Error saving message:', error);
  }
};

// **🔹 Function to call OpenAI API**
const callOpenAI = async (messages, apiKey) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      { model: 'gpt-4', messages },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `OpenAI API Error: ${error.response.data.error.message}`,
    );
  }
};

// **🔹 Function to call Groq LLaMA 3 API**
const callGroqLLaMA = async (messages, apiKey) => {
  return axios.post(
    GROQ_API_URL,
    { model: 'llama-3.3-70b-versatile', messages },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

// **🔹 Function to call Gemini API**
const callGemini = async (messages, apiKey) => {
  return axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: messages[messages.length - 1].content }],
        },
      ],
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

// Function to process chunks sequentially
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

    const conversationWithChunk = [
      { role: 'system', content: systemMessageContent },
      ...conversation,
    ];

    // Call the OpenAI API with the constructed conversation
    const primaryResponse = await callOpenAI(conversationWithChunk, apiKey);
    finalSummary = primaryResponse.choices[0].message.content; // Update the final summary with the latest response
  }, Promise.resolve()); // Start with a resolved promise

  return finalSummary; // Return the final summary after processing all chunks
};

// **🔹 Function to process document summaries for multi-agent RAG**
const processDocuments = async (documents, conversation, apiKey) => {
  const summaryPromises = documents.map(async (doc) => {
    const chunks = Array.from(
      { length: Math.ceil(doc.text.length / 2048) },
      (_, i) => doc.text.slice(i * 2048, i * 2048 + 2048),
    );
    return processChunksSequentially(chunks, conversation, apiKey);
  });
  return Promise.all(summaryPromises);
};

function generateMarkdownPrompt(
  contextualizedQuery = 'NONE',
  constraints = [],
) {
  return `
You are an assistant that provides answers strictly in Markdown format. Ensure all responses are properly formatted using Markdown syntax. Do not include any plain text outside of Markdown formatting.
You are designed to provide accurate and concise answers based on the context provided below. While you may incorporate external knowledge if necessary, prioritize using the details from the provided documents to ensure relevance and accuracy.

Context: "${contextualizedQuery}"
Constraints: ${constraints.join(', ')}

Instructions:
1. Use headings (\`# H1\`, \`## H2\`, etc.) for organizing information hierarchically.
2. Use bullet points (\`-\` or \`*\`) or numbered lists for enumerations.
3. Format code snippets using backticks (\` \` \`) for inline code or triple backticks (\`\`\`) for blocks.
4. Use bold (\`**bold**\`) and italics (\`*italics*\`) for emphasis where appropriate.
5. Include links as \`[text](url)\` and images as \`![alt text](url)\`.
6. Ensure tables are formatted with proper Markdown table syntax if needed.
`;
}

// **🔹 Direct ChatGPT Message**
const createDirectReply = async (courseId, messageBody) => {
  const { conversation, roomId, userId } = messageBody;
  const { apiKey } = await getApiKeyById(courseId, 'chatgpt');

  const response = await callOpenAI(conversation, apiKey);
  const assistantResponse = response.choices[0].message.content;

  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'chatgpt-direct',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'chatgpt-direct',
  });

  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'chatgpt-direct',
      },
    ],
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
  const { conversation, roomId, userId } = messageBody;

  // Get the most recent query by user
  const currentQuery = conversation[conversation.length - 1].content;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const { apiKey } = await getApiKeyById(courseId, 'chatgpt');

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }

  const constraints = template.constraints;

  const documentIds = template.documents;
  const contextualizedQuery = documentIds.length
    ? await generateContextualizedQuery(currentQuery, apiKey, documentIds)
    : 'No relevant context was found in the database';

  logger.info(contextualizedQuery);

  const managerConversation = [
    {
      role: 'system',
      content: generateMarkdownPrompt(contextualizedQuery, constraints),
    },
    { role: 'user', content: conversation[conversation.length - 1].content },
  ];

  const response = await callOpenAI(managerConversation, apiKey);

  const assistantResponse = response.choices[0].message.content;

  // ✅ Save messages to the database
  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'rag',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'rag',
  });

  // Return the updated conversation history
  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'rag',
      },
    ],
  };
};

// **🔹 Multi-Agent Reply**
const createMultiAgentReply = async (courseId, templateId, messageBody) => {
  const { conversation, roomId, userId } = messageBody;
  const { apiKey } = await getApiKeyById(courseId, 'chatgpt');

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }

  const constraints = template.constraints;

  const documentIds = template.documents;
  const documents = await Promise.all(
    documentIds.map((id) => getDocumentById(id)),
  );

  const summaries = documents.length
    ? await processDocuments(documents, conversation, apiKey)
    : ['No relevant content was found in the database'];
  const finalSummary = summaries.join(' ');

  const managerConversation = [
    {
      role: 'system',
      content: generateMarkdownPrompt(finalSummary, constraints),
    },
    { role: 'user', content: conversation[conversation.length - 1].content },
  ];

  const response = await callOpenAI(managerConversation, apiKey);
  const assistantResponse = response.choices[0].message.content;

  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'multi-agent',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'multi-agent',
  });

  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'multi-agent',
      },
    ],
  };
};

// **🔹 Combined (RAG + Multi-Agent) Reply**
const createContextualizedAndMultiAgentReply = async (
  courseId,
  templateId,
  messageBody,
) => {
  const { conversation, roomId, userId } = messageBody;
  const { apiKey } = await getApiKeyById(courseId, 'chatgpt');

  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }

  const constraints = template.constraints;

  const documentIds = template.documents;

  const currentQuery = conversation[conversation.length - 1].content;
  const contextualizedQuery = documentIds.length
    ? await generateContextualizedQuery(currentQuery, apiKey, documentIds)
    : 'No relevant context was found in the database';

  const documents = await Promise.all(
    documentIds.map((id) => getDocumentById(id)),
  );

  const summaries = documents.length
    ? await processDocuments(documents, conversation, apiKey)
    : ['No relevant content was found in the database'];
  const finalSummary = summaries.join(' ');

  const managerConversation = [
    {
      role: 'system',
      content: generateMarkdownPrompt(
        finalSummary + contextualizedQuery,
        constraints,
      ),
    },
    { role: 'user', content: conversation[conversation.length - 1].content },
  ];

  const response = await callOpenAI(managerConversation, apiKey);
  const assistantResponse = response.choices[0].message.content;

  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'rag+multi-agent',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'rag+multi-agent',
  });

  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'rag+multi-agent',
      },
    ],
  };
};

// **🔹 Gemini Reply**
const createGeminiReply = async (courseId, templateId, messageBody) => {
  const { conversation, roomId, userId } = messageBody;
  const { apiKey } = await getApiKeyById(courseId, 'gemini');

  const response = await callGemini(conversation, apiKey);
  const assistantResponse =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'No response from Gemini';

  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'gemini',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'gemini',
  });

  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'gemini',
      },
    ],
  };
};

// **🔹 LLaMA 3 Reply**
const createLlama3Reply = async (courseId, templateId, messageBody) => {
  const { conversation, roomId, userId } = messageBody;
  const { apiKey } = await getApiKeyById(courseId, 'llama');

  const response = await callGroqLLaMA(conversation, apiKey);
  const assistantResponse =
    response?.data?.choices?.[0]?.message?.content ||
    'No response from LLaMA 3';

  await saveMessage({
    roomId,
    sender: userId,
    content: conversation[conversation.length - 1].content,
    modelUsed: 'llama3',
  });
  await saveMessage({
    roomId,
    sender: 'assistant',
    content: assistantResponse,
    modelUsed: 'llama3',
  });

  return {
    responses: [
      ...conversation,
      {
        role: 'assistant',
        content: assistantResponse,
        sender: 'assistant',
        modelUsed: 'llama3',
      },
    ],
  };
};

module.exports = {
  createDirectReply,
  createMultiAgentReply,
  createContextualizedReply,
  createContextualizedAndMultiAgentReply,
  createGeminiReply,
  createLlama3Reply,
};
