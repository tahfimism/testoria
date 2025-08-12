import type { QuizQuestion, QuestionType } from "@/types/quiz";

function stripJson(text: string): string {
  // Remove Markdown code fences if present
  const fence = /```(json)?([\s\S]*?)```/i;
  const m = text.match(fence);
  const payload = m ? m[2] : text;
  // Remove stray trailing commas and BOM
  return payload.replace(/^\uFEFF/, "").trim();
}

function safeParseJsonArray(text: string): QuizQuestion[] {
  const cleaned = stripJson(text);
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("Response was not an array");
  return parsed.map((q) => ({
    question: String((q as any).question ?? "").trim(),
    options: (Array.isArray((q as any).options) ? (q as any).options : [])
      .map((o: any) => String(o))
      .slice(0, 4),
    answer: String((q as any).answer ?? "").trim(),
    explanation: String((q as any).explanation ?? "").trim(),
  }));
}

export async function generateQuizFromText(
  content: string,
  numQuestions: number,
  type: QuestionType,
  apiKey: string
): Promise<QuizQuestion[]> {
  if (!apiKey) throw new Error("Missing Gemini API key");

  const model = "gemini-1.5-flash";

const system = `You are an expert quiz generator. Create engaging, accurate questions that test understanding without being trivial.`;

const typeGuidance =
  type === "multiple-choice"
    ? `All questions MUST be multiple-choice with exactly 4 plausible options. Do NOT include any true/false questions.`
    : type === "true-false"
    ? `All questions MUST be true/false with options ["True","False"] only. Do NOT include any multiple-choice questions.`
    : `Include both multiple-choice and true/false questions (balanced mix).`;

const instructions = `Generate ${numQuestions} quiz questions from the provided material.
- Difficulty: mix easy, medium, and hard (do not label difficulty)
- ${typeGuidance}
- Multiple-choice questions MUST have exactly 4 plausible options; avoid obviously irrelevant distractors.
- True/false MUST use options ["True","False"], and the answer must be exactly one of these strings.
- Answers must be unambiguous and derived strictly from the material.
- Include a short explanation for each answer.

Return ONLY strict JSON in this exact format with no extra text or markdown fences:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string",
    "explanation": "string"
  }
]`;


  const prompt = `${system}\n\nMATERIAL:\n${content}\n\nTASK:\n${instructions}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          topK: 32,
          maxOutputTokens: 2048,
          // response_mime_type may not be supported in REST everywhere; the prompt enforces JSON
        },
        safetySettings: [],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Empty response from Gemini");

  return safeParseJsonArray(text);
}
