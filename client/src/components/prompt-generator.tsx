import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { generatePromptSchema, type GeneratePromptRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Cpu, ListTodo, Palette, Lightbulb, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@/lib/types";
import ResultsDisplay from "./results-display";

const models = [
  { value: "gpt-4o", label: "GPT-4o (Latest)" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-4", label: "GPT-4 (Legacy)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-3.5", label: "GPT-3.5" },
  { value: "gpt-3.5-turbo-instruct", label: "GPT-3.5 Turbo Instruct" },
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

  const form = useForm<GeneratePromptRequest>({
    resolver: zodResolver(generatePromptSchema),
    defaultValues: {
      model: "",
      taskType: "",
      tone: "",
    },
  });

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

  const onSubmit = (data: GeneratePromptRequest) => {
    generateMutation.mutate(data);
  };

  const handleGenerateNew = () => {
    setResults(null);
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Generate Optimized Prompts</h2>
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
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
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

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Prompt
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
        selectedModel={form.watch("model")}
        onGenerateNew={handleGenerateNew}
      />
    </div>
  );
}
