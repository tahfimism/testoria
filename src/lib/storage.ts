const KEYS = {
  API_KEY: "AIQM_API_KEY",
  QUIZ: "AIQM_QUIZ_DATA",
  PROGRESS: "AIQM_PROGRESS",
} as const;

import type { QuizQuestion, QuizProgress } from "@/types/quiz";

export const storage = {
  getApiKey(): string | null {
    try {
      return localStorage.getItem(KEYS.API_KEY);
    } catch {
      return null;
    }
  },
  setApiKey(key: string) {
    try {
      localStorage.setItem(KEYS.API_KEY, key);
    } catch {}
  },
  getQuiz(): QuizQuestion[] | null {
    try {
      const raw = localStorage.getItem(KEYS.QUIZ);
      return raw ? (JSON.parse(raw) as QuizQuestion[]) : null;
    } catch {
      return null;
    }
  },
  setQuiz(quiz: QuizQuestion[]) {
    try {
      localStorage.setItem(KEYS.QUIZ, JSON.stringify(quiz));
    } catch {}
  },
  getProgress(): QuizProgress | null {
    try {
      const raw = localStorage.getItem(KEYS.PROGRESS);
      return raw ? (JSON.parse(raw) as QuizProgress) : null;
    } catch {
      return null;
    }
  },
  setProgress(progress: QuizProgress) {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch {}
  },
  clearSession() {
    try {
      localStorage.removeItem(KEYS.QUIZ);
      localStorage.removeItem(KEYS.PROGRESS);
    } catch {}
  },
};
