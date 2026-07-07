# AI Quiz Maker (Testoria)

A sophisticated, privacy-focused React application that generates interactive quizzes from arbitrary text or files using Google's Gemini 1.5 Flash AI. This project operates entirely on the frontend, ensuring user data and API keys remain within the local browser environment.

## 1. Project Overview
AI Quiz Maker (internal codename **Testoria**) is a tool designed to transform learning material into active recall exercises. By leveraging Large Language Models (LLMs), it automates the creation of multiple-choice and true/false questions, providing explanations for each answer to reinforce learning. The application solves the problem of manual quiz creation, making study sessions more efficient and interactive.

## 2. Technical Architecture & Tech Stack

### High-Level Architecture
- **Frontend-Only (Serverless)**: There is no backend server. All logic, including AI orchestration, happens in the client's browser.
- **State Management**: Utilizes React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`) for localized state and `localStorage` for cross-session persistence.
- **API Orchestration**: Direct integration with the Google Generative Language API via `fetch`.
- **Styling**: Built with a "dark-first" design system using Tailwind CSS utility classes.

### Core Tech Stack
| Category | Tools |
| :--- | :--- |
| **Framework** | React 18+ |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI (Primitives for Dialog, Alert, etc.) |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **AI Engine** | Google Gemini 1.5 Flash (`gemini-1.5-flash`) |
| **Build Tool** | Vite |

## 3. Exhaustive File-by-File Analysis

The repository currently contains the **production build artifacts** of the application. Below is a granular breakdown of each file and its role in the system:

### Root Directory
- **`index.html`**: The entry point of the application. It contains the base HTML structure, defines the `root` mounting point for React, and includes critical SEO/OpenGraph metadata. It serves as the shell that loads the minified JavaScript and CSS.
- **`favicon.ico`**: The application icon displayed in browser tabs.
- **`placeholder.svg`**: A default vector asset used for UI states where images might be missing or during loading.
- **`robots.txt`**: Configuration for web crawlers, defining indexing rules for the site.
- **`CNAME`**: Defines the custom domain for GitHub Pages deployment.

### `assets/` Directory
- **`index-[hash].js`**: The consolidated application logic. This file contains:
    - The entire React component tree (Quiz Generator, Quiz Player, Settings, etc.).
    - AI prompt engineering logic and Gemini API integration.
    - Vendor libraries (React, Radix UI, Sonner, Lucide) bundled and tree-shaken.
    - Persistence logic for `localStorage`.
- **`index-[hash].css`**: The compiled and minified Tailwind CSS styles. It includes the dark-theme configuration, custom animations for transitions, and Radix UI primitive styling.

## 4. Exhaustive Feature List

### Quiz Generation
- **Text-to-Quiz Conversion**: Analyze long-form text to extract key concepts and generate relevant questions.
- **Customizable Question Volume**: Choose the number of questions to generate (configurable via UI).
- **Question Type Selection**:
    - **Multiple Choice**: Exactly 4 plausible options per question.
    - **True/False**: Binary choice questions for quick verification.
    - **Mixed Mode**: A balanced combination of both types.
- **AI Model Integration**: Uses `gemini-1.5-flash` for high-speed, cost-effective, and accurate generation.

### User Interface & Experience
- **Interactive Quiz Player**: A dedicated interface for taking the quiz with immediate feedback.
- **Progress Persistence**: Automatically saves your current quiz state and progress to `localStorage` (key: `AIQM_PROGRESS`), allowing for session resumption.
- **Dark Mode Architecture**: Built with a specialized dark theme for reduced eye strain during long study sessions.
- **Accessible Components**: Powered by Radix UI for high-quality keyboard navigation and screen reader support.
- **Toast Notifications**: Real-time feedback for actions like saving, importing, or API errors using the `sonner` library.

### Data Management
- **Local API Key Storage**: Securely store your Gemini API key in the browser (`AIQM_API_KEY`). It is never sent to a third-party server except for direct requests to Google.
- **Export Options**:
    - **JSON**: Full quiz data including questions, options, answers, and explanations.
    - **TXT**: A human-readable version of the quiz.
- **Import Functionality**: Upload previous `.json` quiz files to resume or retake them.

## 5. Under-the-Hood Optimizations
- **Privacy-by-Design**: By eliminating a backend, the application ensures that source text (which could be sensitive notes) never leaves the user's browser except to reach the Gemini API.
- **Prompt Engineering**: Uses sophisticated system instructions to enforce pedagogical quality:
    - *System Prompt*: "You are an expert quiz generator. Create engaging, accurate questions that test understanding without being trivial."
    - *Format Enforcement*: Strict JSON schema validation is used to ensure the AI returns data that can be parsed by the frontend.
- **Asset Optimization**: Build artifacts use content hashing for efficient browser caching and delivery.

## 6. Setup & Installation Instructions

### Running the Build Locally
Since this repository contains the compiled artifacts, you can run it using any static file server.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Serve the files**:
   ```bash
   # Using npx (Node.js)
   npx serve .

   # Or using Python
   python3 -m http.server 8000
   ```
3. **Access the App**:
   Open your browser to `http://localhost:3000` (for serve) or `http://localhost:8000` (for Python).

### Development Setup (Reference)
*Note: If the source code (JSX/TSX files) were present, the standard workflow would be:*
1. `npm install` to install dependencies.
2. `npm run dev` to start the Vite development server.
3. `npm run build` to generate the artifacts currently found in this repo.

### Environment Configuration
The app does not use `.env` files as it is purely frontend. Instead:
1. Open the application.
2. Click the **Settings** (gear icon).
3. Enter your **Google Gemini API Key**.
4. The key is stored in your browser's `localStorage` under `AIQM_API_KEY`.

## 7. Usage Examples

### Generating a Quiz
1. Paste your study notes into the main text area.
2. Select "Question types" and the desired number of questions.
3. Click "Generate Quiz".

### Exported JSON Schema
When you export a quiz, it follows this structure:
```json
[
  {
    "question": "What is the primary tech stack of Testoria?",
    "options": ["React", "Vue", "Angular", "Svelte"],
    "answer": "React",
    "explanation": "Testoria is built using React and Tailwind CSS for a modern, responsive UI."
  }
]
```

### Importing a Quiz
1. Click "Import quiz (.json)".
2. Select a previously exported JSON file.
3. The quiz will load instantly, allowing you to start or resume.
