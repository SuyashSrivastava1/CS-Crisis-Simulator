// API client for CS Crisis Simulator

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generates a scenario for a given subject
 * @param {string} subject 
 * @returns {Promise<object>} scenario data
 */
export async function generateScenario(subject) {
  try {
    const response = await fetch(`${BASE_URL}/api/generate-scenario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API generateScenario failed:', error);
    throw new Error(error.message || 'Network error: could not connect to server.');
  }
}

/**
 * Evaluates the user response against the scenario rubric
 * @param {object} scenarioData 
 * @param {string} userResponse 
 * @returns {Promise<object>} evaluation feedback
 */
export async function evaluateResponse(scenarioData, userResponse) {
  try {
    const response = await fetch(`${BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenarioId: scenarioData.scenarioId,
        title: scenarioData.title,
        narrative: scenarioData.narrative,
        context: scenarioData.context,
        targetConcept: scenarioData.targetConcept,
        rubricPoints: scenarioData.rubricPoints,
        userResponse,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API evaluateResponse failed:', error);
    throw new Error(error.message || 'Network error: could not connect to server.');
  }
}

/**
 * Gets a hint for the given scenario
 * @param {object} scenarioData 
 * @returns {Promise<object>} hint string
 */
export async function getHint(scenarioData) {
  try {
    const response = await fetch(`${BASE_URL}/api/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenario: scenarioData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API getHint failed:', error);
    throw new Error(error.message || 'Network error: could not connect to server.');
  }
}
