const express = require('express');

const axios = require('axios');

const router = express.Router();
require('dotenv').config({ path: '../.env' });

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Define agents with specific instructions
const agents = [
  { role: 'system', content: 'You are a helpful assistant.' }, // Primary agent
  {
    role: 'system',
    content:
      'You will receive a conversation with two messages. Respond to the first message using the second message as a template, ensuring that the user is referred to as "cadet.",',
  }, // Secondary agent 1 (Cadet Check)
  {
    role: 'system',
    content:
      'You will receive a conversation with two messages. Respond to the first message using the second message as a template, but speak in Chinese',
  }, // Secondary agent 2 (Pseudocode Check)
];

// Function to send a conversation to a specific agent
const callOpenAI = async (conversation, agentInstruction) => {
  return axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4',
      messages: [...conversation, agentInstruction], // Include conversation history and agent instructions
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

router.post('/chatgpt', async (req, res) => {
  const { conversation } = req.body; // Full conversation history

  try {
    // Step 1: Call the primary agent to generate the initial response
    const primaryResponse = await callOpenAI(conversation, agents[0]);

    // Update conversation with the primary response
    const updatedConversation = [
      ...conversation,
      {
        role: 'assistant',
        content: primaryResponse.data.choices[0].message.content,
      },
    ];

    // Step 2: Loop through secondary agents to replace and edit the response
    for (let i = 1; i < agents.length; i += 1) {
      // Get a reference to the last assistant's response
      const lastResponse = updatedConversation[updatedConversation.length - 1];

      // Create the conversation template using the original user message and the last response
      const conversationWithTemplate = [
        conversation[0], // Original user message
        {
          role: 'user', // Treat the previous agent's response as a "template"
          content: lastResponse.content,
        },
      ];

      // Get the modified response from the current agent
      const secondaryResponse = callOpenAI(conversationWithTemplate, agents[i]);

      // Remove the last assistant's response
      updatedConversation.pop();

      // Update conversation by replacing the previous agent's response with the current agent's response
      updatedConversation.push({
        role: 'assistant',
        content: secondaryResponse.data.choices[0].message.content,
      });
    }

    // Step 3: Return the modified conversation to the client
    res.json({ responses: updatedConversation });
  } catch (error) {
    // console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error interacting with OpenAI API' });
  }
});

module.exports = router;
