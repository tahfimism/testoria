import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/FileUploader";
import { TextInputArea } from "@/components/TextInputArea";
import { SettingsModal } from "@/components/SettingsModal";
import { QuestionView } from "@/components/QuestionView";
import { ResultsView } from "@/components/ResultsView";
import type { QuestionType, QuizQuestion } from "@/types/quiz";
import { storage } from "@/lib/storage";
import { generateQuizFromText } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Index = () => {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState("");
  const [numQuestions, setNumQuestions] = useState(8);
  const [qType, setQType] = useState<QuestionType>("mixed");

  const savedQuiz = useMemo(() => storage.getQuiz(), []);
  const savedProgress = useMemo(() => storage.getProgress(), []);

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(savedQuiz);
  const [answers, setAnswers] = useState<Record<number, string>>(savedProgress?.answers ?? {});
  const [currentIndex, setCurrentIndex] = useState<number>(savedProgress?.currentIndex ?? 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (questions) storage.setQuiz(questions);
    if (questions) storage.setProgress({ currentIndex, answers });
  }, [questions, currentIndex, answers]);

  const onSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const onPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const onNext = () => {
    if (!questions) return;
    if (currentIndex >= questions.length - 1) return;
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
  };

  const startNewSessionWith = (q: QuizQuestion[]) => {
    storage.clearSession(); // clear any previous session data
    const randomized = shuffle(q);
    setQuestions(randomized);
    setAnswers({});
    setCurrentIndex(0);
    storage.setQuiz(randomized);
    storage.setProgress({ currentIndex: 0, answers: {} });
  };

  const quitToHome = () => {
    storage.clearSession();
    setQuestions(null);
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      toast({ title: "No input", description: "Paste text or upload a file first." });
      return;
    }
    const apiKey = storage.getApiKey();
    if (!apiKey) {
      toast({ title: "Missing API key", description: "Open Settings and add your Gemini API key." });
      return;
    }
    try {
      setLoading(true);
      const raw = await generateQuizFromText(sourceText, numQuestions, qType, apiKey);
      // Ensure each question has 4 options; if true/false, standardize options
      const normalized = raw.map((q) => {
        const isTF = q.options.length === 2 && q.options.every((o) => ["True", "False"].includes(o));
        return isTF
          ? { ...q, options: ["True", "False"] }
          : { ...q, options: q.options.slice(0, 4) };
      });
      startNewSessionWith(normalized);
      toast({ title: "Quiz ready", description: `Generated ${normalized.length} questions.` });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e?.message ?? "Unknown error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (quiz: QuizQuestion[]) => {
    startNewSessionWith(quiz);
  };

  const handleRestart = () => {
    if (!questions) return;
    startNewSessionWith(questions);
  };

  // Determine if we're done when user presses Finish
  const finish = () => {
    if (!questions) return;
    setCurrentIndex(questions.length); // move past last to show results
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/60 backdrop-blur border-b">
        <div className="container relative py-4">
          <div className="flex justify-center">
            <button type="button" onClick={quitToHome} className="group">
              <Card className="border border-border/50 bg-card/60 backdrop-blur-md shadow-elegant px-4 py-2 hover-scale">
                <CardTitle className="text-xl font-bold tracking-tight">AI Quiz Maker</CardTitle>
              </Card>
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {questions && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Quit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Quit quiz?</AlertDialogTitle>
                    <AlertDialogDescription>This will clear your current progress and return to the home screen.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={quitToHome}>Quit</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <SettingsModal />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {!questions ? (
          <section className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextInputArea value={sourceText} onChange={setSourceText} />
                <FileUploader onTextLoaded={setSourceText} onQuizImported={handleImport} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Quiz Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm">Number of questions</label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.max(1, Math.min(50, Number(e.target.value))))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Question types</label>
                  <Select value={qType} onValueChange={(v) => setQType(v as QuestionType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple-choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button variant="hero" className="hover-scale" onClick={handleGenerate} disabled={loading}>
                    {loading ? "Generating..." : "Generate Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : currentIndex < questions.length ? (
          <section className="max-w-3xl mx-auto">
            <QuestionView
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              selected={answers[currentIndex]}
              onSelect={onSelect}
              onPrev={onPrev}
              onNext={() => {
                if (currentIndex === questions.length - 1) finish();
                else onNext();
              }}
            />
          </section>
        ) : (
          <section className="max-w-4xl mx-auto">
            <ResultsView questions={questions} answers={answers} onRestart={handleRestart} onHome={quitToHome} />
          </section>
        )}
      </main>

      <footer className="container py-8 text-center text-xs text-muted-foreground">
        <a className="story-link" href="#">Privacy-first • Runs in your browser</a>
      </footer>
    </div>
  );
};

export default Index;
