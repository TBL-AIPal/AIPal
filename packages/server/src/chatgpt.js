const express = require('express');
const axios = require('axios');
const logger = require('./config/logger');
const { generateContextualizedQuery } = require('./services/RAG/vector.search.service');
const ChatMessage = require('./models/chatMessage.model'); // Import the schema
const mongoose = require('mongoose');

const router = express.Router();
require('dotenv').config({ path: '../.env' });

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Function to send a conversation to the OpenAI API
const callOpenAI = async (messages) => {
  return axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4',
      messages, // Use property shorthand
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

// Function to segment text into chunks
const segmentText = (text, chunkSize) => {
  return Array.from({ length: Math.ceil(text.length / chunkSize) }, (_, i) =>
    text.slice(i * chunkSize, i * chunkSize + chunkSize)
  ); // Use Array.from to create chunks
};

// Function to process chunks sequentially
const processChunksSequentially = async (chunks, conversation) => {
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
    const primaryResponse = await callOpenAI(conversationWithChunk);
    finalSummary = primaryResponse.data.choices[0].message.content; // Update the final summary with the latest response
  }, Promise.resolve()); // Start with a resolved promise

  return finalSummary; // Return the final summary after processing all chunks
};

// Multi-Agent Endpoint
router.post('/multi-agent', async (req, res) => {
  const { conversation, documents, constraints } = req.body; // Full conversation history and documents

  try {
    // Step 1: Process each document and its chunks
    const summaryPromises = documents.map(async (doc) => {
      const chunks = segmentText(doc.text, 2048); // Segment document text into 2048-character chunks
      const finalSummary = await processChunksSequentially(chunks, conversation); // Process chunks sequentially
      return finalSummary; // Return the final summary for this document
    });

    // Wait for all document processing to complete
    const summaries = await Promise.all(summaryPromises);
    const finalSummary = summaries.join(' '); // Combine summaries if needed

    // Step 3: Call the manager agent with the final summary and constraints
    const constraintsString = constraints.join(', '); // Convert constraints array to a string

    const managerConversation = [
      {
        role: 'system',
        content: `This source is too long and has been summarized. You need to answer based on the summary: "${finalSummary}". Please ensure your response satisfies the following constraints: ${constraintsString}.`,
      },
      {
        role: 'user',
        content: conversation[conversation.length - 1].content,
      }, // Last user query
    ];

    const managerResponse = await callOpenAI(managerConversation);

    // Step 4: Return the final response to the client
    res.json({
      responses: [...conversation, { role: 'assistant', content: managerResponse.data.choices[0].message.content }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interacting with OpenAI API', details: error.message });
  }
});

// RAG Endpoint
router.post('/rag', async (req, res) => {
  const { conversation } = req.body; // Full conversation history

  // Get the most recent query by user
  const currentQuery = conversation[conversation.length - 1].content;

  // Query with context appended on top of it
  const contextualizedQuery = await generateContextualizedQuery(currentQuery);

  logger.info(contextualizedQuery);

  // Updated conversation with context
  const contextualizedConversation = [
    ...conversation.slice(0, conversation.length - 1),
    {
      role: 'user',
      content: contextualizedQuery,
    },
  ];

  try {
    const response = await callOpenAI(contextualizedConversation);
    res.json({ responses: [...conversation, { role: 'assistant', content: response.data.choices[0].message.content }] });
  } catch (error) {
    res.status(500).json({ error: 'Error interacting with OpenAI API', details: error.message });
  }
});

// RAG and Multi-Agent Endpoint
router.post('/rag+multi-agent', async (req, res) => {
  const { conversation, documents, constraints } = req.body; // Full conversation history and documents

  // Get the most recent query by user
  const currentQuery = conversation[conversation.length - 1].content;

  // Query with context appended on top of it
  const contextualizedQuery = await generateContextualizedQuery(currentQuery);

  try {
    // Step 1: Process each document and its chunks
    const summaryPromises = documents.map(async (doc) => {
      const chunks = segmentText(doc.text, 2048); // Segment document text into 2048-character chunks
      const finalSummary = await processChunksSequentially(chunks, conversation); // Process chunks sequentially
      return finalSummary; // Return the final summary for this document
    });

    // Wait for all document processing to complete
    const summaries = await Promise.all(summaryPromises);
    const finalSummary = summaries.join(' '); // Combine summaries if needed

    // Step 3: Call the manager agent with the final summary and constraints
    const constraintsString = constraints.join(', '); // Convert constraints array to a string

    const managerConversation = [
      {
        role: 'system',
        content: `This source is too long and has been summarized. You need to answer based on the summary: "${finalSummary}". Please ensure your response satisfies the following constraints: ${constraintsString}.`,
      },
      {
        role: 'user',
        content: contextualizedQuery,
      }, // Last user query
    ];

    const managerResponse = await callOpenAI(managerConversation);

    // Step 4: Return the final response to the client
    res.json({
      responses: [...conversation, { role: 'assistant', content: managerResponse.data.choices[0].message.content }],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interacting with OpenAI API', details: error.message });
  }
});

router.post('/chatgpt-direct', async (req, res) => {
  try {
    const { conversation, roomId, userId } = req.body;

    if (!roomId || !userId) {
      console.error('Missing required parameters:', { roomId, userId });
      return res.status(400).json({ error: 'Missing roomId or userId' });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid roomId or userId format' });
    }

    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Conversation history cannot be empty' });
    }

    // Convert sender → role for OpenAI
    const openAIConversation = conversation.map(msg => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    console.log('Sending to OpenAI:', JSON.stringify(openAIConversation, null, 2));

    // Call OpenAI
    const response = await callOpenAI(openAIConversation);
    const assistantReply = response?.data?.choices?.[0]?.message?.content || 'No response from AI';

    console.log('OpenAI API response:', assistantReply);

    // Save messages with `sender` for database
    const userMessage = {
      roomId,
      sender: userId, // Store userId as sender in MongoDB
      content: conversation[conversation.length - 1].content,
    };

    const assistantMessage = {
      roomId,
      sender: 'assistant',
      content: assistantReply,
    };

    await ChatMessage.insertMany([userMessage, assistantMessage]);

    // Send response back with correct format
    res.json({ responses: [...conversation, { sender: 'assistant', content: assistantReply }] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error interacting with OpenAI API', details: error.message });
  }
});

module.exports = router;
