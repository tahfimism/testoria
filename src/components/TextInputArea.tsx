import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const TextInputArea = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-2">
      <label className="text-sm">Paste text</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your study notes, article, or any source text here..."
        className="min-h-[10rem]"
      />
    </div>
  );
};
