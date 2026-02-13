# AI Quiz Maker

AI Quiz Maker is a 100% frontend, privacy-focused application that generates multiple-choice and true/false quizzes from your study notes, articles, or any text source using the Gemini API.

## Features

- **Text-to-Quiz Generation**: Paste any text or upload `.txt`/`.md` files to generate a quiz instantly.
- **Customizable**: Choose the number of questions (up to 50) and the type (Multiple Choice, True/False, or Mixed).
- **Privacy First**: Your API key and data are stored locally in your browser. The API key is sent directly to Google's Gemini API and nowhere else.
- **Import/Export**: Save your generated quizzes as JSON or export text versions to share or study later.
- **Responsive Design**: Works on desktop and mobile devices.

## Setup & Usage

Since this repository contains the **built artifacts** of the application (static HTML/CSS/JS), you do not need to build it. You can simply serve the files using any static file server.

### Prerequisites

- A **Gemini API Key** from Google AI Studio. You can get one [here](https://aistudio.google.com/app/apikey).

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Serve the files:**
    You can use any static server. For example, using Python (which is pre-installed on most systems):
    ```bash
    python3 -m http.server 8000
    ```
    Or using `serve` with Node.js:
    ```bash
    npx serve .
    ```

3.  **Open in Browser:**
    Navigate to `http://localhost:8000` (or whatever port your server uses).

4.  **Configure API Key:**
    - Click on the "Settings" button in the top right corner.
    - Paste your Gemini API Key.
    - Click "Save".

5.  **Generate a Quiz:**
    - Paste your text into the "Paste text" area OR upload a file.
    - Select the number of questions and type.
    - Click "Generate Quiz".

## Technical Details

This project is built with:
- **React**: Frontend framework.
- **Vite**: Build tool (evidenced by the asset structure).
- **Tailwind CSS**: Styling.
- **Radix UI**: Accessible UI primitives.
- **Gemini API**: AI model for generating questions.

## Repository Structure

- `index.html`: The entry point of the application.
- `assets/`: Contains the minified JavaScript and CSS files.

**Note:** This repository contains the production build (`dist` output) of the application. Source code is not included in this tree.
