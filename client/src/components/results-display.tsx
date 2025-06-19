import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, FileCode, Settings, User, List, Brain, Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@/lib/types";

interface ResultsDisplayProps {
  results: PromptResponse | null;
  selectedModel: string;
  onGenerateNew: () => void;
}

export default function ResultsDisplay({ results, selectedModel, onGenerateNew }: ResultsDisplayProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${itemName} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyAllPrompts = () => {
    if (!results) return;
    
    const allText = `System Prompt:\n${results.systemPrompt}\n\nUser Prompt:\n${results.userPrompt}`;
    copyToClipboard(allText, "All prompts");
  };

  if (!results) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 className="text-slate-400 text-xl h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Generate</h3>
          <p className="text-slate-600 mb-6">Select your model, task type, and tone to get started with optimized prompt templates.</p>
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                Model-specific
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                Task-optimized
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                Tone-aware
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Container */}
      <Card className="shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <FileCode className="mr-2 h-5 w-5 text-green-500" />
            Generated Prompts
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Optimized for <span className="font-medium">{selectedModel || "your chosen model"}</span>
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* System Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center">
                <Settings className="mr-2 h-4 w-4 text-blue-500" />
                System Prompt
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(results.systemPrompt, "System prompt")}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {copiedItem === "System prompt" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : (
                  <Copy className="mr-1 h-3 w-3" />
                )}
                Copy
              </Button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                {results.systemPrompt}
              </pre>
            </div>
          </div>

          {/* User Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center">
                <User className="mr-2 h-4 w-4 text-emerald-500" />
                User Prompt Template
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(results.userPrompt, "User prompt")}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {copiedItem === "User prompt" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : (
                  <Copy className="mr-1 h-3 w-3" />
                )}
                Copy
              </Button>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                {results.userPrompt}
              </pre>
            </div>
          </div>

          {/* Formatting Tips Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center">
              <List className="mr-2 h-4 w-4 text-amber-500" />
              Formatting Tips
            </h3>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <ul className="text-sm text-amber-800 space-y-2">
                {results.formattingTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Behavioral Notes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center">
              <Brain className="mr-2 h-4 w-4 text-purple-500" />
              Behavioral Notes
            </h3>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <ul className="text-sm text-purple-800 space-y-2">
                {results.behavioralNotes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button
              onClick={copyAllPrompts}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
            <Button
              onClick={onGenerateNew}
              variant="secondary"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
