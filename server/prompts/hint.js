export const hintPrompt = (narrative, targetConcept, rubricPoints) => {
  return `You are a helpful senior staff engineer mentoring a junior engineer.
The junior is trying to solve a production incident but doesn't know where to start.

Scenario narrative: ${narrative}
Target concept: ${targetConcept}
Rubric points (correct answer must address): ${JSON.stringify(rubricPoints)}

Provide exactly 3 progressive hints for the junior engineer.
Hint 1: A vague nudge toward the right log line, metric, or general concept area.
Hint 2: A moderate hint pointing out the specific computer science concept at play.
Hint 3: A near-answer that heavily suggests what the root cause is and what the fix should be, without explicitly giving away the code.

You MUST respond with ONLY a valid JSON object matching this schema, with no markdown formatting or extra text:
{
  "hints": ["hint 1 text", "hint 2 text", "hint 3 text"]
}`;
};
