# 🚨 ConceptCraft

Step into the boots of an On-Call Engineer! **ConceptCraft** is a scenario-based learning platform that teaches computer science concepts through realistic software engineering crises. Instead of asking textbook questions, the platform generates a production-style problem tied to a user-chosen subject, asks the user to diagnose and fix it, and gives instant feedback from an AI-powered "Senior Engineer" persona.

---

## ✨ Features

- **Infinite Scenarios**: Powered by Google's Gemini 2.5 Flash, the app generates unique, realistic, and detailed production incidents based on topics like Databases, Networking, Distributed Systems, or custom inputs.
- **Role-Play as On-Call**: Read system logs, analyze metrics, and write down your diagnosis and pseudo-code fix just like a real engineer investigating an outage.
- **Get a Gist**: Not sure where to start? Ask for a hint! The system will give you the underlying conceptual gist without spoiling the full solution.
- **Senior Engineer Feedback**: Receive tailored, constructive, and realistic feedback grading your response against a dynamically generated rubric. 
- **Gamified Learning**: Keep track of your score and maintain a streak as you correctly diagnose incidents.
- **Beautiful UI**: Modern, responsive, and glassmorphic user interface built with React.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS (Glassmorphism & Modern UI)
- **Backend**: Node.js, Express
- **AI Integration**: Google Gen AI SDK (`@google/genai`), using `gemini-2.5-flash` for high-speed, structured generation.
- **Architecture**: Monorepo structure with concurrently running client and server processes.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SuyashSrivastava1/CS-Crisis-Simulator.git
   cd CS-Crisis-Simulator
   ```

2. **Environment Setup**
   Create a `.env` file in the root of the project with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```
   *(Note: The server will automatically pick up the API key from this file, but you can also place a `.env` directly in the `server/` directory).*

3. **Install Dependencies**
   Install both frontend and backend dependencies with a single command:
   ```bash
   npm run install:all
   ```

### Running the App Locally

Start both the backend server and frontend client in development mode:
```bash
npm run dev
```

- The frontend UI will be available at [http://localhost:5173](http://localhost:5173).
- The backend API runs at `http://localhost:3001`.

---

## 💡 How It Works

1. **Choose a Topic**: Enter a specific topic (e.g., "PostgreSQL Indexing", "Race Conditions", "DNS Resolution").
2. **Read the Narrative**: The LLM generates a cohesive narrative, including context like system logs or stack traces, and builds a grading rubric behind the scenes.
3. **Investigate & Submit**: Write out your diagnosis. You can toggle between Prose and Pseudo-code modes.
4. **Get Graded**: Your response is sent back to the LLM, which evaluates it strictly against the hidden rubric. You will receive a verdict (Correct, Partial, Incorrect) and feedback from your "Senior Engineer".

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SuyashSrivastava1/CS-Crisis-Simulator/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
