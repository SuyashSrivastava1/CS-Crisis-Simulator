import express from 'express';
import { generateText } from '../services/llm.js';
import { hintPrompt } from '../prompts/hint.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Missing required field: scenario' });
    }

    const prompt = hintPrompt(
      scenario.narrative,
      scenario.targetConcept,
      scenario.rubricPoints
    );

    const hintText = await generateText(prompt);

    res.json({ hint: hintText });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

export default router;
