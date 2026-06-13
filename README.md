# CS Crisis Simulator

A scenario-based learning platform that teaches computer science concepts through realistic software engineering crises. Instead of asking textbook questions, the platform generates a production-style problem tied to a user-chosen subject, asks the user to diagnose/fix it, and gives instant feedback from an LLM-powered "Senior Engineer" persona.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Gemini API Key

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd Santa
   ```

2. Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```
   *Also copy this `.env` file into the `server/` directory.*

3. Install all dependencies:
   ```bash
   npm run install:all
   ```

### Running the App Locally

Start both the backend server and frontend client in development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
The backend runs at `http://localhost:3001`.
