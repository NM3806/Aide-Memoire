"use client";

import { useState } from "react";
import { generateEditorTemplate } from "@/config/GoogleAIModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/context/LoaderContext";
import { toast } from "sonner";

export default function GenerateAITemplate({ setGenerateAIOutput }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { showLoader, hideLoader } = useLoader();
  // const [loading, setLoading] = useState(false); // Remove local loading state

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    showLoader("Generating with AI...");
    try {
      const result = await generateEditorTemplate(prompt);
      if (result) {
        setGenerateAIOutput(result);
        toast.success("Content generated successfully!");
        setOpen(false); 
      } else {
        throw new Error("AI did not return a result.");
      }
    } catch(error) {
        console.error("Error generating AI template:", error);
        toast.error("Failed to generate content. Please try again.");
    } finally {
        hideLoader(); 
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className={"cursor-pointer"}>Generate with AI</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Template Generator</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-4 pt-4">
                <Input
                  placeholder="e.g., A blog post about the future of AI"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

                  <Button onClick={handleGenerate} disabled={!prompt.trim()}>
                    Generate
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}