export const generateScenarioPrompt = (subject, difficulty = 'Medium') => {
  let difficultyInstructions = '';
  
  if (difficulty === 'Easy') {
    difficultyInstructions = `
- **DIFFICULTY: EASY**
- Provide a very clear and obvious context clue (e.g., a log line that explicitly names the error or exception).
- The narrative should clearly outline what just happened and point the user directly toward the target concept.`;
  } else if (difficulty === 'Hard') {
    difficultyInstructions = `
- **DIFFICULTY: HARD**
- Provide noisy, messy, or unhelpful logs in the context.
- The narrative should contain red herrings (e.g., "we just deployed frontend changes" when it's a DB issue).
- Symptoms should be vague (e.g., "users complaining about slowness" instead of "database CPU is at 100%").`;
  } else {
    difficultyInstructions = `
- **DIFFICULTY: MEDIUM**
- Provide a standard, realistic production crisis with moderate clues.`;
  }

  return `You are a scenario designer for a CS crisis simulator used by computer science students.

Given a CS subject, generate a REALISTIC production engineering crisis scenario 
that tests understanding of that subject.

Rules:
- Invent a fictional but real-sounding company name (e.g., "StreamPulse", "VaultDB", "NexaCloud")
- Describe specific, concrete symptoms: error messages, metrics, user complaints
- Optionally include a log snippet, stack trace, or metrics dashboard excerpt in the "context" field
- The narrative should read like a real Slack #incidents channel message, email, or alert notification
- The targetConcept must be a single, precise CS concept (not a broad topic)
- rubricPoints should contain 3-5 specific elements a correct diagnosis must address
- NEVER use textbook/academic phrasing in the narrative — this should feel like a real incident
${difficultyInstructions}

Subject: ${subject}`;
};
