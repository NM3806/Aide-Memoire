"use client";

import { useState } from "react";
import { generateEditorTemplate } from "@/config/GoogleAIModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/context/LoaderContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const promptSuggestions = [
  "Blog post about the future of AI",
  "List of pros and cons for learning React",,
];

export default function GenerateAITemplate({ setGenerateAIOutput }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { showLoader, hideLoader } = useLoader();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    showLoader("Generating with AI...");
    setOpen(false);
    try {
      const result = await generateEditorTemplate(prompt);
      if (result) {
        setGenerateAIOutput(result);
        toast.success("Content generated successfully!");
      } else {
        throw new Error("AI did not return a result.");
      }
    } catch (error) {
      console.error("Error generating AI template:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      hideLoader();
      setPrompt("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            variant="default"
            className="rounded-full h-12 w-12 p-3 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles />
          </Button>
        </motion.div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 mb-2" side="top" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Generate Content</h4>
            <p className="text-sm text-muted-foreground">
              What do you want to create?
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="e.g., A blog post about AI"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">SUGGESTIONS</p>
              {promptSuggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto"
                  onClick={() => setPrompt(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={!prompt.trim()}>
            Generate
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}