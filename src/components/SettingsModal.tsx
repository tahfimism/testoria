import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export const SettingsModal = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const existing = storage.getApiKey();
    if (existing) setApiKey(existing);
  }, []);

  const onSave = () => {
    if (!apiKey.trim()) {
      toast({ title: "API key required", description: "Please enter your Gemini API key." });
      return;
    }
    storage.setApiKey(apiKey.trim());
    toast({ title: "Saved", description: "Gemini API key stored locally (browser only)." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Store your Gemini API key locally. It is never sent anywhere except directly to Google when you generate a quiz.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="text-sm">Gemini API Key</label>
          <Input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
