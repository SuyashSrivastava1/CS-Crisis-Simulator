import express from 'express';
import { generateHints } from '../services/llm.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Missing required field: scenario' });
    }

    const hints = await generateHints(scenario);

    res.json({ hints });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

export default router;
