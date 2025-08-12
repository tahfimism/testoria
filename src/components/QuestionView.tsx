import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizQuestion } from "@/types/quiz";

interface Props {
  question: QuizQuestion;
  index: number;
  total: number;
  selected?: string;
  onSelect: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const QuestionView = ({ question, index, total, selected, onSelect, onPrev, onNext }: Props) => {
  return (
    <div className="animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-2 text-sm text-muted-foreground">Question {index + 1} of {total}</div>
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
          <div className="grid gap-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onSelect(opt)}
                className={`w-full text-left rounded-md border px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected === opt ? 'bg-secondary' : 'bg-background hover:bg-accent'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onPrev} disabled={index === 0}>Previous</Button>
            <Button variant="default" onClick={onNext}>{index === total - 1 ? 'Finish' : 'Next'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
