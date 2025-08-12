import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import type { QuizQuestion } from "@/types/quiz";
import { isQuizArray } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onTextLoaded: (text: string) => void;
  onQuizImported: (quiz: QuizQuestion[]) => void;
}

export const FileUploader = ({ onTextLoaded, onQuizImported }: Props) => {
  const { toast } = useToast();

  const handleTextFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.toLowerCase().split(".").pop();
    if (!ext || !["txt", "md"].includes(ext)) {
      toast({ title: "Unsupported file", description: "Please upload a .txt or .md file." });
      return;
    }
    const text = await file.text();
    onTextLoaded(text);
    toast({ title: "Loaded", description: `Loaded ${file.name}` });
    e.target.value = "";
  };

  const handleImportJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.toLowerCase().split(".").pop();
    if (ext !== "json") {
      toast({ title: "Unsupported file", description: "Please upload a .json file exported by the app." });
      return;
    }
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!isQuizArray(json)) throw new Error("Invalid quiz JSON format");
      onQuizImported(json);
      toast({ title: "Imported", description: `Imported ${json.length} questions from ${file.name}` });
    } catch (err: any) {
      toast({ title: "Import failed", description: err?.message ?? "Invalid JSON" });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm mb-1 block">Upload .txt or .md</label>
        <Input type="file" accept=".txt,.md" onChange={handleTextFiles} />
      </div>
      <div>
        <label className="text-sm mb-1 block">Import quiz (.json)</label>
        <Input type="file" accept=".json" onChange={handleImportJson} />
      </div>
    </div>
  );
};
