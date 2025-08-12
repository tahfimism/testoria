import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizQuestion } from "@/types/quiz";

interface Props {
  questions: QuizQuestion[];
  answers: Record<number, string>;
  onRestart: () => void;
  onHome: () => void;
}

function formatTxt(questions: QuizQuestion[], answers: Record<number, string>) {
  const lines: string[] = [];
  questions.forEach((q, idx) => {
    lines.push(`${idx + 1}. ${q.question}`);
    q.options.forEach((o, i) => {
      const label = String.fromCharCode(65 + i);
      lines.push(`   ${label}) ${o}`);
    });
    const user = answers[idx] ?? "(no answer)";
    lines.push(`   Your answer: ${user}`);
    lines.push(`   Correct: ${q.answer}`);
    lines.push(`   Explanation: ${q.explanation}`);
    lines.push("");
  });
  return lines.join("\n");
}

export const ResultsView = ({ questions, answers, onRestart, onHome }: Props) => {
  const correct = questions.reduce((acc, q, i) => acc + ((answers[i] ?? "") === q.answer ? 1 : 0), 0);
  const accuracy = Math.round((correct / questions.length) * 100);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTxt = () => {
    const blob = new Blob([formatTxt(questions, answers)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <Card className="border border-border/50 bg-card/60 backdrop-blur-md shadow-elegant">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">Results</h2>
          <p className="text-muted-foreground mb-6">Accuracy: {accuracy}% • {correct}/{questions.length} correct</p>
          <div className="space-y-6">
            {questions.map((q, i) => {
              const user = answers[i] ?? "(no answer)";
              const isCorrect = user === q.answer;
              return (
                <div key={i} className="rounded-md border p-4">
                  <div className="font-medium mb-2">{i + 1}. {q.question}</div>
                  <div className="text-sm mb-1">Your answer: <span className={isCorrect ? 'text-primary' : 'text-destructive'}>{user}</span></div>
                  {!isCorrect && (
                    <div className="text-sm mb-1">Correct: <span className="text-primary">{q.answer}</span></div>
                  )}
                  <div className="text-sm text-muted-foreground">Explanation: {q.explanation}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-6 justify-between">
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportJson}>Export JSON</Button>
              <Button variant="outline" onClick={exportTxt}>Export TXT</Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onHome}>Home</Button>
              <Button variant="hero" onClick={onRestart} className="hover-scale">Restart (randomize)</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
