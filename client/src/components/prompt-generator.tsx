import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { generatePromptSchema, generatePromptFormSchema, type GeneratePromptRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Cpu, ListTodo, Palette, Lightbulb, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@/lib/types";
import ResultsDisplay from "./results-display";
import { FieldSelectorHoverCard } from "@/components/Tooltips";
import { getModelGuidance } from "@/lib/modelPromptGuidance";

const models = [
  { 
    value: "gpt-4o", 
    label: "GPT-4o", 
    description: "Best all-purpose model: excels at real-time reasoning across text, vision, and audio. Ideal for multimodal tasks, fast response, and tool use in ChatGPT."
  },
  { 
    value: "gpt-4.5", 
    label: "GPT-4.5", 
    description: "Best for natural, emotionally intelligent chat and creative insights. Strong at writing, intent-following, and reduced hallucinations. Less focused on reasoning."
  },
  { 
    value: "gpt-4.1", 
    label: "GPT-4.1", 
    description: "Specialized for coding and instruction-following. Stronger than GPT-4o for precise dev work and web tasks."
  },
  { 
    value: "gpt-4.1-mini", 
    label: "GPT-4.1 Mini", 
    description: "A lightweight, fast instruction-following model for general-purpose use and coding. Fallback for free-tier users."
  },
  { 
    value: "o3", 
    label: "o3", 
    description: "State-of-the-art reasoning model. Ideal for deep analysis in math, science, programming, consulting, and visual problem-solving (charts, images, etc)."
  },
  { 
    value: "o4-mini", 
    label: "o4-mini", 
    description: "High-performance, cost-efficient reasoning model. Excels in math, data science, and coding with fast throughput; strong at non-STEM too."
  },
  { 
    value: "o1", 
    label: "o1", 
    description: "Solid reasoning models for complex problem-solving across coding, math, and research. Less capable than o3/o4-mini and lacks tool access in ChatGPT."
  },
  { 
    value: "o1-mini", 
    label: "o1 Mini", 
    description: "Solid reasoning models for complex problem-solving across coding, math, and research. Less capable than o3/o4-mini and lacks tool access in ChatGPT."
  },
];

const taskTypes = [
  { value: "summarization", label: "Summarization" },
  { value: "code-explanation", label: "Code Explanation" },
  { value: "email-writing", label: "Email Writing" },
  { value: "legal-reasoning", label: "Legal Reasoning" },
  { value: "data-extraction", label: "Data Extraction" },
  { value: "multimodal-reasoning", label: "Multimodal Reasoning" },
  { value: "creative-writing", label: "Creative Writing" },
  { value: "sql-generation", label: "SQL Generation" },
  { value: "json-formatting", label: "JSON Formatting" },
  { value: "math-logic-proofs", label: "Math/Logic Proofs" },
  { value: "chatbot-conversations", label: "Chatbot Conversations" },
];

const tones = [
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "technical", label: "Technical" },
  { value: "direct", label: "Direct" },
  { value: "playful", label: "Playful" },
];

export default function PromptGenerator() {
  const [results, setResults] = useState<PromptResponse | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(generatePromptFormSchema),
    defaultValues: {
      model: undefined,
      taskType: undefined,
      tone: undefined,
      customPrompt: "",
    },
  });

  const selectedModel = form.watch("model");

  const generateMutation = useMutation({
    mutationFn: async (data: GeneratePromptRequest) => {
      const response = await apiRequest("POST", "/api/generate-prompt", data);
      return response.json();
    },
    onSuccess: (data: PromptResponse) => {
      setResults(data);
      toast({
        title: "Prompt Generated Successfully",
        description: "Your optimized prompt template has been generated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    // Validate the data with the full schema before submitting
    const validationResult = generatePromptSchema.safeParse(data);
    if (validationResult.success) {
      generateMutation.mutate(validationResult.data);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateNew = () => {
    setResults(null);
    form.reset({
      model: undefined,
      taskType: undefined,
      tone: undefined,
      customPrompt: "",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-slate-900">Generate Optimized Prompts</h2>
                <FieldSelectorHoverCard />
              </div>
              <p className="text-sm text-slate-600">Configure your requirements to get model-specific prompt templates</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Model Selection */}
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <Cpu className="mr-2 h-4 w-4 text-blue-500" />
                        OpenAI Model
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-md">
                          {models.map((model) => (
                            <SelectItem key={model.value} value={model.value} className="py-3">
                              <div className="flex flex-col space-y-1">
                                <span className="font-medium text-sm">{model.label}</span>
                                <span className="text-xs text-slate-500 leading-relaxed">
                                  {model.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Type Selection */}
                <FormField
                  control={form.control}
                  name="taskType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <ListTodo className="mr-2 h-4 w-4 text-emerald-500" />
                        Task Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a task..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taskTypes.map((task) => (
                            <SelectItem key={task.value} value={task.value}>
                              {task.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tone Selection */}
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <Palette className="mr-2 h-4 w-4 text-amber-500" />
                        Tone
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom Prompt Input */}
                <FormField
                  control={form.control}
                  name="customPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <FileText className="mr-2 h-4 w-4 text-purple-500" />
                        Custom Prompt (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            selectedModel 
                              ? `Example for ${selectedModel}: ${getModelGuidance(selectedModel).idealUserPromptExample.split('\n')[0]}...`
                              : "Enter your existing prompt here to optimize it for the selected model..."
                          }
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500 mt-1">
                        Leave empty to generate a new template, or paste your prompt to optimize it
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {form.watch("customPrompt") ? "Optimizing..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      {form.watch("customPrompt") ? "Optimize Prompt" : "Generate Prompt"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            Quick Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <CheckCircle className="mr-2 mt-0.5 h-3 w-3 text-blue-500 flex-shrink-0" />
              Each model has unique strengths - choose based on your specific needs
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 mt-0.5 h-3 w-3 text-blue-500 flex-shrink-0" />
              Tone affects how the model interprets and responds to prompts
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 mt-0.5 h-3 w-3 text-blue-500 flex-shrink-0" />
              Generated prompts include model-specific formatting guidance
            </li>
          </ul>
        </div>
      </div>

      {/* Results Display */}
      <ResultsDisplay 
        results={results} 
        selectedModel={form.watch("model") || ""}
        onGenerateNew={handleGenerateNew}
      />
    </div>
  );
}
