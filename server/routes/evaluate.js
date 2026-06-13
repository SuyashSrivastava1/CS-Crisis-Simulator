import express from 'express';
import { evaluateResponse } from '../services/llm.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { scenarioId, title, narrative, context, targetConcept, rubricPoints, userResponse } = req.body;

    // Validate inputs
    if (!scenarioId) {
      return res.status(400).json({ error: 'scenarioId is required.' });
    }
    if (!narrative || typeof narrative !== 'string') {
      return res.status(400).json({ error: 'narrative is required and must be a string.' });
    }
    if (!targetConcept || typeof targetConcept !== 'string') {
      return res.status(400).json({ error: 'targetConcept is required and must be a string.' });
    }
    if (!Array.isArray(rubricPoints) || rubricPoints.length === 0) {
      return res.status(400).json({ error: 'rubricPoints is required and must be a non-empty array.' });
    }
    if (!userResponse || typeof userResponse !== 'string') {
      return res.status(400).json({ error: 'userResponse is required and must be a string.' });
    }

    if (userResponse.trim().length < 20) {
      return res.status(400).json({ error: 'Your diagnosis is too short. Please provide at least 20 characters of detail.' });
    }

    const evaluation = await evaluateResponse(
      { title, narrative, context, targetConcept, rubricPoints },
      userResponse.trim()
    );

    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating response:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate response due to an internal server error.' });
  }
});

export default router;
