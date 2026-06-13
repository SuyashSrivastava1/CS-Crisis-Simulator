export const generateScenarioPrompt = (subject) => {
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

Subject: ${subject}`;
};
