import { GoogleGenAI } from '@google/genai';
import { generateScenarioPrompt } from '../prompts/scenario.js';
import { evaluatePrompt } from '../prompts/evaluate.js';
import config from '../config/index.js';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export async function generateScenario(subject, retries = 2) {
  const prompt = generateScenarioPrompt(subject);
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              narrative: { type: 'STRING' },
              context: { type: 'STRING', description: 'Log snippet, metrics, error message, or stack trace context' },
              targetConcept: { type: 'STRING' },
              rubricPoints: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['title', 'narrative', 'targetConcept', 'rubricPoints']
          }
        }
      });
      
      const text = response.text;
      if (!text) {
        throw new Error('Empty response from LLM');
      }
      
      const parsed = JSON.parse(text);
      if (!parsed.title || !parsed.narrative || !parsed.targetConcept || !Array.isArray(parsed.rubricPoints)) {
        throw new Error('Invalid response structure');
      }
      
      return parsed;
    } catch (error) {
      console.error(`Scenario generation attempt ${i + 1} failed:`, error);
      if (i === retries) {
        throw new Error(`Failed to generate a valid scenario after multiple attempts: ${error.message}`);
      }
    }
  }
}

export async function evaluateResponse(scenario, userResponse, retries = 2) {
  const prompt = evaluatePrompt(
    scenario.narrative,
    scenario.targetConcept,
    scenario.rubricPoints,
    userResponse
  );
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              verdict: { 
                type: 'STRING',
                enum: ['correct', 'partial', 'incorrect']
              },
              matchedConcepts: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              },
              feedback: { type: 'STRING' },
              hint: { type: 'STRING', description: 'Nudge for the user, only required if verdict is not correct' }
            },
            required: ['verdict', 'matchedConcepts', 'feedback']
          }
        }
      });
      
      const text = response.text;
      if (!text) {
        throw new Error('Empty response from LLM');
      }
      
      const parsed = JSON.parse(text);
      if (!parsed.verdict || !Array.isArray(parsed.matchedConcepts) || !parsed.feedback) {
        throw new Error('Invalid response structure');
      }
      
      return parsed;
    } catch (error) {
      console.error(`Evaluation attempt ${i + 1} failed:`, error);
      if (i === retries) {
        throw new Error(`Failed to evaluate user response after multiple attempts: ${error.message}`);
      }
    }
  }
}

export async function generateText(prompt, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error(`Text generation attempt ${i + 1} failed:`, error);
      if (i === retries) throw error;
    }
  }
}

import { hintPrompt } from '../prompts/hint.js';

export async function generateHints(scenario, retries = 2) {
  const prompt = hintPrompt(
    scenario.narrative,
    scenario.targetConcept,
    scenario.rubricPoints
  );
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              hints: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Exactly 3 progressive hints'
              }
            },
            required: ['hints']
          }
        }
      });
      
      const text = response.text;
      if (!text) throw new Error('Empty response from LLM');
      
      const parsed = JSON.parse(text);
      if (!parsed.hints || !Array.isArray(parsed.hints) || parsed.hints.length === 0) {
        throw new Error('Invalid response structure');
      }
      
      return parsed.hints;
    } catch (error) {
      console.error(`Hint generation attempt ${i + 1} failed:`, error);
      if (i === retries) throw new Error(`Failed to generate hints: ${error.message}`);
    }
  }
}
