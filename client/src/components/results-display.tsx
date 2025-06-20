import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Wand2, FileCode, Settings, User, List, Brain, Copy, RefreshCw, CheckCircle2, ChevronDown, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@/lib/types";
import { SystemPromptTooltip, UserPromptTooltip } from "@/components/Tooltips";
import { getModelGuidance } from "@/lib/modelPromptGuidance";
import { getToneAdjustment } from "@/lib/toneAdjustments";

interface ResultsDisplayProps {
  results: PromptResponse | null;
  selectedModel: string;
  selectedTone: string;
  onGenerateNew: () => void;
}

export default function ResultsDisplay({ results, selectedModel, selectedTone, onGenerateNew }: ResultsDisplayProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isFormattingTipsOpen, setIsFormattingTipsOpen] = useState(false);
  const { toast } = useToast();
  
  const modelGuidance = getModelGuidance(selectedModel);
  const toneAdjustment = getToneAdjustment(selectedTone);
  
  // Generate dynamic system prompt incorporating tone
  const getDynamicSystemPrompt = () => {
    // Always use the generated system prompt from the API response first
    // Only fall back to static model guidance if no generated prompt exists
    return results?.systemPrompt || (modelGuidance as any).systemPrompt || "";
  };

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
    
    const systemPromptText = getDynamicSystemPrompt();
    const allText = `System Prompt:\n${systemPromptText}\n\nUser Prompt:\n${results.userPrompt}`;
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
        <div className="border-b border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <FileCode className="mr-2 h-5 w-5 text-green-500" />
            Generated Prompts
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Optimized for <span className="font-medium">{selectedModel || "your chosen model"}</span>
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* System Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-500" />
                System Prompt
                {selectedTone && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full font-medium">
                    {selectedTone} tone
                  </span>
                )}
                <SystemPromptTooltip />
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(getDynamicSystemPrompt(), "System prompt")}
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
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <pre className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono">
                {getDynamicSystemPrompt()}
              </pre>
            </div>
          </div>

          {/* User Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                User Prompt Template
                <UserPromptTooltip />
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
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <pre className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono">
                {results.userPrompt}
              </pre>
            </div>
            
            {/* Model-specific User Prompt Notes */}
            {modelGuidance.userPromptNotes.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Model Behavior Notes</p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      {modelGuidance.userPromptNotes.map((note, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model-Specific Formatting Tips Section */}
          <div className="space-y-3">
            <Collapsible open={isFormattingTipsOpen} onOpenChange={setIsFormattingTipsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-semibold text-sm text-slate-900 dark:text-slate-100 hover:bg-transparent">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-violet-500" />
                    Formatting Tips for {selectedModel}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform ${isFormattingTipsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
                  <ul className="text-sm text-violet-800 dark:text-violet-200 space-y-1.5">
                    {modelGuidance.formattingTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1 h-1 bg-violet-600 dark:bg-violet-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Behavioral Notes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Brain className="mr-2 h-4 w-4 text-purple-500" />
              Behavioral Notes
            </h3>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                {results.behavioralNotes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
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
