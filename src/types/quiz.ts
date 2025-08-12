export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type QuestionType = "multiple-choice" | "true-false" | "mixed";

export type QuizProgress = {
  currentIndex: number;
  answers: Record<number, string>;
};

export function isQuizArray(data: unknown): data is QuizQuestion[] {
  return (
    Array.isArray(data) &&
    data.every(
      (q) =>
        q &&
        typeof q === "object" &&
        typeof (q as any).question === "string" &&
        Array.isArray((q as any).options) &&
        (q as any).options.length >= 2 &&
        typeof (q as any).answer === "string" &&
        typeof (q as any).explanation === "string"
    )
  );
}
