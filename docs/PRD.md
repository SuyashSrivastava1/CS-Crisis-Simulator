# PRD: CS Crisis Simulator

## 1. Overview
A scenario-based learning platform that teaches computer science concepts through realistic software engineering crises. Instead of asking textbook questions, the platform generates a production-style problem tied to a user-chosen subject, asks the user to diagnose/fix it, and gives instant feedback from an LLM-powered "Senior Engineer" persona.

## 2. Problem Statement
Students learn CS theory (normalization, OS paging, networking protocols, etc.) in the abstract and struggle to connect it to real engineering work. Existing practice tools (quizzes, flashcards) test recall, not application. There is no lightweight way to practice "diagnosing a real bug using concept X" with immediate, contextual feedback.

## 3. Goals
- Let a user pick any CS subject and receive a realistic, concrete engineering scenario built around that subject.
- Let the user submit free-form diagnostic reasoning or pseudo-code.
- Evaluate the response against the underlying concept and return a verdict, feedback, and a hint if needed.
- Make the loop fast, replayable, and motivating (gamified scoring/streaks).

## 4. Non-Goals (for this build)
- No user accounts, persistence, or login.
- No support for multi-turn debugging conversations (single submit → single evaluation, with retry).
- No grading of code execution/correctness (LLM-based conceptual evaluation only, not a compiler/sandbox).
- No mobile app — web only.

## 5. Target User
CS students, bootcamp learners, or interview-prep candidates who know definitions but want to practice applying them to realistic problems.

## 6. User Flow
1. User lands on home screen, sees a subject input (curated dropdown + free-text option).
2. User selects/enters a subject (e.g. "Database Normalization").
3. System generates a scenario: title, narrative (company name, symptom, optional log/error snippet), and an internal target concept + rubric (hidden from user).
4. User reads scenario and submits their diagnosis/fix in a text area.
5. System evaluates the response against the rubric and returns: verdict (correct / partial / incorrect), matched concepts, feedback in "Senior Engineer" voice, and a hint (if not fully correct).
6. User can retry the same scenario using the hint, or request a new scenario for the same/different subject.
7. Score and streak update based on verdict.

## 7. Functional Requirements

### 7.1 Scenario Generation
- Input: subject (string).
- Output (JSON): `title`, `narrative`, `context` (optional supporting detail like logs/metrics), `targetConcept`, `rubricPoints` (array of expected elements in a correct answer).
- Scenario must be concrete: real-sounding product/company names, specific symptoms, no abstract textbook phrasing.
- `targetConcept` and `rubricPoints` are not shown to the user.

### 7.2 User Response Submission
- Free-text input (supports prose and/or pseudo-code).
- Minimum length validation (e.g. reject empty/trivial input with a friendly prompt to elaborate).

### 7.3 Evaluation
- Input: scenario data (narrative, targetConcept, rubricPoints) + user response.
- Output (JSON): `verdict` (correct / partial / incorrect), `matchedConcepts` (array), `feedback` (2-3 sentences, in-character as a senior engineer), `hint` (present only if verdict ≠ correct).
- Feedback tone: constructive, realistic senior-engineer voice — not robotic grading language.

### 7.4 Retry & New Scenario
- "Try again" re-submits against the same scenario/rubric.
- "New scenario" re-triggers generation for the same subject (or a newly chosen one).

### 7.5 Gamification
- Points awarded per verdict (e.g. correct = 10, partial = 5, incorrect = 0).
- Streak counter for consecutive correct answers.
- Simple "Senior Engineer Approved ✅" badge/animation on correct verdicts.

### 7.6 Subject Selection
- Curated list of 8-10 pre-tested subjects (e.g. DB normalization, OS paging, TCP vs UDP, indexing, hashing, caching, recursion, deadlocks).
- Optional free-text field for any other subject (stretch goal — may produce lower-quality scenarios).

## 8. Technical Requirements

### 8.1 Architecture
- Frontend: React (or plain HTML/JS) single-page app.
- Backend: thin API (Node/Express or FastAPI) acting as a proxy to the LLM, with two endpoints.
- No database required; scenario state passed back to backend on evaluation (stateless).

### 8.2 API Endpoints

**POST /generate-scenario**
- Request: `{ subject: string }`
- Response: `{ scenarioId, title, narrative, context, targetConcept, rubricPoints }`

**POST /evaluate**
- Request: `{ scenarioId, narrative, targetConcept, rubricPoints, userResponse }`
- Response: `{ verdict, matchedConcepts, feedback, hint }`

### 8.3 LLM Prompting
- Both endpoints use structured JSON output (forced/validated) for reliable frontend rendering.
- Scenario generation prompt enforces concreteness and ties narrative tightly to a single core concept.
- Evaluation prompt anchors grading to the rubric and adopts a "Senior Engineer reviewing a diagnosis" persona.

### 8.4 Error Handling
- Handle malformed/empty LLM JSON responses with a retry or fallback message.
- Handle empty/trivial user submissions client-side before calling /evaluate.

## 9. Success Metrics (Demo-Level)
- End-to-end loop works reliably for all curated subjects: generate → submit → evaluate → feedback → retry/new.
- At least one subject (e.g. DB normalization/Swiggy-style scenario) is fully polished for live demo.
- Average response time per LLM call is acceptable for a live demo (no long unexplained waits — use loading states).

## 10. Risks
- Scenario quality varies by subject; algorithmic/theoretical subjects (recursion, Big-O) are harder to frame as "production crises" than systems subjects (DB, OS, networking). Mitigate by curating and testing subjects in advance.
- LLM may return non-JSON or inconsistent verdicts; mitigate with strict prompt formatting, JSON validation, and fallback retry logic.
- Free-text subject input may produce low-quality scenarios live; keep as stretch/optional and default to curated list for demo.

## 11. 24-Hour Build Plan
- Hours 0-2: Finalize curated subject list, write and test both system prompts manually.
- Hours 2-6: Backend skeleton, two endpoints wired to LLM API, JSON validation.
- Hours 6-12: Frontend — subject selection, scenario display, response input, feedback display.
- Hours 12-18: End-to-end integration across all curated subjects; refine prompts based on output quality.
- Hours 18-22: Gamification layer (points/streak/badge), styling pass, error/empty-state handling.
- Hours 22-24: Demo rehearsal, deploy, bug buffer.

## 12. Stretch Goals
- Difficulty levels per subject (junior → senior scenarios).
- Free-text subject input with quality safeguards.
- Multi-turn follow-up questions from the Senior Engineer before final verdict.
- Leaderboard (local/session-based, no auth).
