const mockScenarios = [
  {
    scenarioId: "demo-db-1",
    title: "Database CPU Spike during Batch Jobs",
    narrative: "It's 2 AM. PagerDuty goes off. The primary PostgreSQL database CPU is pinned at 100%. The application is experiencing high latency, and timeouts are cascading. Looking at the logs, a nightly batch job just started running, executing a massive UPDATE query on the 'users' table based on a 'last_login' timestamp filter.",
    context: "EXPLAIN ANALYZE UPDATE users SET status = 'inactive' WHERE last_login < NOW() - INTERVAL '1 year';\nSeq Scan on users  (cost=0.00..500000.00 rows=500000 width=14) (actual time=0.012..1500.000 rows=500000 loops=1)",
    targetConcept: "Missing Indexes on Filter Columns",
    rubricPoints: [
      "Identify that a Sequential Scan is happening.",
      "Explain that missing an index on 'last_login' forces the database to scan the entire table.",
      "Suggest creating an index on 'last_login'."
    ]
  },
  {
    scenarioId: "demo-mem-2",
    title: "Node.js Container OOMKills",
    narrative: "You notice an alert that the main Node.js backend pods are frequently restarting. The orchestration dashboard shows 'OOMKilled' (Out Of Memory) exit codes. You pull up the memory metrics for the containers and see memory usage steadily climbing linearly over a 4-hour period before hitting the container limit and crashing.",
    context: "Node.js Heap Snapshot analysis reveals millions of detached DOM nodes and unresolved closures in an array called 'requestCache' that is never cleared.",
    targetConcept: "Memory Leaks via Unbounded Caching",
    rubricPoints: [
      "Identify the issue as a Memory Leak.",
      "Point out that the 'requestCache' array is unbounded and holds references indefinitely.",
      "Propose implementing an eviction policy (like LRU) or using a standard caching library with TTL."
    ]
  },
  {
    scenarioId: "demo-net-3",
    title: "Random 502 Bad Gateway Errors",
    narrative: "Users are reporting intermittent 502 Bad Gateway errors during peak traffic. The architecture consists of an Nginx reverse proxy load-balancing requests to several upstream backend services. The backend services themselves report normal CPU/Memory and no errors in their logs.",
    context: "Nginx error log snippet:\n[error] 1234#0: *5678 upstream prematurely closed connection while reading response header from upstream, client: 192.168.1.100, server: example.com, request: 'GET /api/data HTTP/1.1'",
    targetConcept: "Keep-Alive Timeout Mismatch",
    rubricPoints: [
      "Identify that the backend is closing the connection before Nginx expects it.",
      "Explain Keep-Alive timeout mismatches between a load balancer/proxy and upstream servers.",
      "Propose configuring the upstream server's Keep-Alive timeout to be longer than Nginx's Keep-Alive timeout."
    ]
  }
];

// Helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockGenerateScenario(subject, difficulty = 'Medium') {
  await delay(1500); // simulate 1.5s delay
  // Pick a scenario randomly, but loosely based on subject if possible
  const lowerSubject = (subject || "").toLowerCase();
  
  let baseScenario;
  if (lowerSubject.includes('database') || lowerSubject.includes('sql') || lowerSubject.includes('index')) {
    baseScenario = mockScenarios[0];
  } else if (lowerSubject.includes('memory') || lowerSubject.includes('node') || lowerSubject.includes('leak')) {
    baseScenario = mockScenarios[1];
  } else if (lowerSubject.includes('network') || lowerSubject.includes('502') || lowerSubject.includes('proxy')) {
    baseScenario = mockScenarios[2];
  } else {
    // Return random scenario
    baseScenario = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
  }

  const scenario = { ...baseScenario };

  if (difficulty === 'Easy') {
    scenario.context = `[EASY MODE HINT] The exact root cause is visible below:\n\n${scenario.context}`;
  } else if (difficulty === 'Hard') {
    scenario.narrative = `[HARD MODE] Users are complaining about things being broken. Some recent frontend commits were pushed, maybe that's it? Oh, and here are some logs:\n\n` + scenario.narrative;
    scenario.context = `[WARN] Free space on /dev/sda1 is 42%\n[INFO] Starting cron job...\n` + scenario.context + `\n[ERROR] Connection reset by peer`;
  }

  return scenario;
}

export async function mockEvaluateResponse(scenarioData, userResponse) {
  await delay(2000); // simulate 2s delay
  
  const lowerResponse = userResponse.toLowerCase();
  let isCorrect = false;

  // Simple keyword matching for demo purposes
  if (scenarioData.scenarioId === "demo-db-1") {
    isCorrect = lowerResponse.includes("index") || lowerResponse.includes("sequential scan");
  } else if (scenarioData.scenarioId === "demo-mem-2") {
    isCorrect = lowerResponse.includes("leak") || lowerResponse.includes("lru") || lowerResponse.includes("clear") || lowerResponse.includes("cache");
  } else if (scenarioData.scenarioId === "demo-net-3") {
    isCorrect = lowerResponse.includes("keep-alive") || lowerResponse.includes("timeout") || lowerResponse.includes("connection");
  }

  if (isCorrect) {
    return {
      verdict: "correct",
      matchedConcepts: scenarioData.rubricPoints,
      feedback: "Great job! You correctly identified the root cause and proposed a solid fix. This is exactly what I would expect from a Senior Engineer.",
      hint: null
    };
  } else {
    return {
      verdict: "incorrect",
      matchedConcepts: [],
      feedback: "Your analysis misses the mark. You didn't address the core issue shown in the context. Read the logs carefully and try again.",
      hint: "Look closely at the metrics or logs provided in the context."
    };
  }
}

export async function mockGetHint(scenarioData) {
  await delay(1000); // simulate 1s delay
  if (scenarioData.scenarioId === "demo-db-1") {
    return { hints: [
      "The query planner is doing a Sequential Scan.",
      "Think about why a database would scan an entire table instead of doing a fast lookup.",
      "You need to add a data structure to the 'last_login' column to speed up filtering. (Hint: It starts with an 'I')"
    ]};
  } else if (scenarioData.scenarioId === "demo-mem-2") {
    return { hints: [
      "The 'requestCache' array keeps growing.",
      "What happens in a garbage-collected language when object references are never removed?",
      "You have a memory leak. You should implement a cache eviction policy, like LRU, to clear old items."
    ]};
  } else if (scenarioData.scenarioId === "demo-net-3") {
    return { hints: [
      "The proxy thinks the connection is open, but the upstream backend just closed it.",
      "This is a classic timeout mismatch between two network components.",
      "Configure the upstream server's Keep-Alive timeout to be slightly longer than Nginx's Keep-Alive timeout."
    ]};
  }
  return { hints: [
    "Focus on the fundamental principles at play.",
    "Look closely at the metrics or logs provided.",
    "Identify the root cause and propose a standard architectural fix."
  ]};
}
