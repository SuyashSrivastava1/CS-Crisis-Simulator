import express from 'express';
import { generateScenario } from '../services/llm.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return res.status(400).json({ error: 'Subject is required and must be a non-empty string.' });
    }

    const trimmedSubject = subject.trim();
    const scenarioData = await generateScenario(trimmedSubject);

    // Attach scenarioId
    const responseData = {
      scenarioId: crypto.randomUUID(),
      ...scenarioData
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error generating scenario:', error);
    res.status(500).json({ error: error.message || 'Failed to generate scenario due to an internal server error.' });
  }
});

export default router;
