const express = require('express');

const axios = require('axios');

const router = express.Router();
require('dotenv').config({ path: '../.env' }); // Load environment variables

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Define the agents with different instructions
const agents = [
  { role: 'system', content: 'You are a helpful assistant who answers only in psuedocode.' },
  { role: 'system', content: 'You are an helpful assistant who links the question to another related concept.' },
  { role: 'system', content: 'You are a helpful assistant that gives examples and code blocks.' },
];

// Function to send a prompt to a specific agent
const callOpenAI = async (conversation, agentInstruction) => {
  return axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4', // Use GPT-4 or GPT-3.5 based on your needs
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
    // Call the primary agent
    const primaryResponse = await callOpenAI(conversation, agents[0]);

    // Update conversation history with the primary response
    const updatedConversation = [
      ...conversation,
      {
        role: 'assistant',
        content: primaryResponse.data.choices[0].message.content,
      },
    ];

    // Call the secondary agents (Mistake Maker, Guide/Hints)
    const secondaryResponses = await Promise.all(agents.slice(1).map((agent) => callOpenAI(updatedConversation, agent)));

    // Combine all agent responses into a structured format
    const allResponses = [
      {
        role: 'Primary (Correct)',
        content: primaryResponse.data.choices[0].message.content,
      },
      ...secondaryResponses.map((resA, i) => ({
        role: i === 0 ? 'Mistake Maker' : 'Guide/Hints', // Assign appropriate role
        content: resA.data.choices[0].message.content,
      })),
    ];

    // Send the combined responses back to the client
    res.json({ responses: allResponses });
  } catch (error) {
    // console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error interacting with OpenAI API' });
  }
});

module.exports = router;
