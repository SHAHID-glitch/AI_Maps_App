const express = require('express');
const axios = require('axios');

const router = express.Router();

const buildSystemPrompt = (context) => {
  const base =
    'You are a helpful AI assistant for a maps app with memory. ' +
    'You remember previous conversations and use that context to provide better answers. ' +
    'You can help with: locations, routes, traffic, nearby places, and weather. ' +
    'When user asks about weather: respond with weather info and include intent "weather" in your response. ' +
    'Be concise, action-oriented, and refer to previous context when relevant. If you do not know, say so.';

  if (!context) return base;

  const { lat, lng, trafficEnabled, weatherEnabled } = context;
  const locLine =
    lat && lng ? `User location: lat ${lat}, lng ${lng}. ` : '';
  const trafficLine =
    typeof trafficEnabled === 'boolean'
      ? `Traffic heatmap is ${trafficEnabled ? 'on' : 'off'}. `
      : '';
  const weatherLine =
    typeof weatherEnabled === 'boolean'
      ? `Weather display is ${weatherEnabled ? 'enabled' : 'disabled'}. `
      : '';

  return base + ' ' + locLine + trafficLine + weatherLine;
};

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not set' });
    }

    const { messages = [], context = {} } = req.body || {};

    const systemPrompt = buildSystemPrompt(context);
    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.3,
    };

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response.';

    // Detect intents from user message and AI response
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const isWeatherQuery =
      userMessage.includes('weather') ||
      userMessage.includes('temperature') ||
      userMessage.includes('forecast') ||
      userMessage.includes('rain') ||
      userMessage.includes('climate' );

    const actions = [];
    if (isWeatherQuery) {
      actions.push({ type: 'show_weather' });
    }

    res.json({ message: content, actions });
  } catch (error) {
    console.error('Groq chat error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Chat request failed' });
  }
});

module.exports = router;
