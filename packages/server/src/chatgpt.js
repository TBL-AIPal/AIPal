const express = require('express');

const axios = require('axios');

const router = express.Router();
require('dotenv').config({ path: '../.env' }); // Load .env file from the server directory

// ChatGPT API setup
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

router.post('/chatgpt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    // console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error interacting with OpenAI API' });
  }
});

module.exports = router;
