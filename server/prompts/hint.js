export const hintPrompt = (narrative, targetConcept, rubricPoints) => {
  return `You are a helpful senior staff engineer mentoring a junior engineer.
The junior is trying to solve a production incident but doesn't know where to start.

Scenario narrative: ${narrative}
Target concept: ${targetConcept}
Rubric points (correct answer must address): ${JSON.stringify(rubricPoints)}

Provide a brief "gist" or hint of the core issue and how they should approach it.
Do NOT give away the exact full solution step-by-step. Instead, explain the fundamental mechanism that is causing the issue and suggest what they should look into or mention in their response. Keep it concise, about 2-3 sentences.`;
};
