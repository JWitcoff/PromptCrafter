import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { taskAnalysisSchema, taskFirstPromptSchema, type TaskAnalysisRequest, type TaskFirstPromptRequest, type ModelRecommendation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Cpu, Target, CheckCircle, ArrowRight, Lightbulb, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@/lib/types";
import ResultsDisplay from "./results-display";

type WorkflowStep = "task-input" | "model-selection" | "prompt-generation";

const tones = [
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "technical", label: "Technical" },
  { value: "direct", label: "Direct" },
  { value: "playful", label: "Playful" },
];

const modelDisplayNames: Record<string, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4.5": "GPT-4.5", 
  "gpt-4.1": "GPT-4.1",
  "gpt-4.1-mini": "GPT-4.1 Mini",
  "o3": "o3",
  "o4-mini": "o4-mini",
  "o1": "o1",
  "o1-mini": "o1 Mini"
};

export default function TaskFirstGenerator() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("task-input");
  const [taskDescription, setTaskDescription] = useState("");
  const [recommendation, setRecommendation] = useState<ModelRecommendation | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [results, setResults] = useState<PromptResponse | null>(null);
  const { toast } = useToast();

  // Form for task input
  const taskForm = useForm<TaskAnalysisRequest>({
    resolver: zodResolver(taskAnalysisSchema),
    defaultValues: {
      taskDescription: ""
    }
  });

  // Form for final prompt generation
  const promptForm = useForm<TaskFirstPromptRequest>({
    resolver: zodResolver(taskFirstPromptSchema),
    defaultValues: {
      taskDescription: "",
      selectedModel: "",
      tone: ""
    }
  });

  // Mutation for task analysis
  const analyzeTaskMutation = useMutation({
    mutationFn: async (data: TaskAnalysisRequest) => {
      const response = await apiRequest("/api/analyze-task", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to analyze task");
      }
      return response.json() as Promise<ModelRecommendation>;
    },
    onSuccess: (data: ModelRecommendation) => {
      setRecommendation(data);
      setSelectedModel(data.recommendedModel);
      setCurrentStep("model-selection");
      toast({
        title: "Task analyzed successfully",
        description: `Recommended model: ${modelDisplayNames[data.recommendedModel]}`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation for prompt generation
  const generatePromptMutation = useMutation({
    mutationFn: async (data: TaskFirstPromptRequest) => {
      const response = await apiRequest("/api/generate-task-prompt", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate prompt");
      }
      return response.json() as Promise<PromptResponse>;
    },
    onSuccess: (data: PromptResponse) => {
      setResults(data);
      setCurrentStep("prompt-generation");
      toast({
        title: "Prompt generated successfully",
        description: "Your optimized prompts are ready!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleTaskSubmit = (data: TaskAnalysisRequest) => {
    setTaskDescription(data.taskDescription);
    analyzeTaskMutation.mutate(data);
  };

  const handleModelConfirmation = () => {
    if (!selectedTone) {
      toast({
        title: "Select tone",
        description: "Please select a tone before proceeding",
        variant: "destructive"
      });
      return;
    }

    generatePromptMutation.mutate({
      taskDescription,
      selectedModel,
      tone: selectedTone as any
    });
  };

  const handleStartOver = () => {
    setCurrentStep("task-input");
    setTaskDescription("");
    setRecommendation(null);
    setSelectedModel("");
    setSelectedTone("");
    setResults(null);
    taskForm.reset();
    promptForm.reset();
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "moderate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "complex": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (currentStep === "prompt-generation" && results) {
    return (
      <ResultsDisplay 
        results={results}
        selectedModel={selectedModel}
        selectedTone={selectedTone}
        onGenerateNew={handleStartOver}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className={`flex items-center space-x-2 ${currentStep === "task-input" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "task-input" ? "bg-blue-600 text-white" : currentStep === "model-selection" || currentStep === "prompt-generation" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>
            {currentStep === "task-input" ? "1" : <CheckCircle className="h-4 w-4" />}
          </div>
          <span>Describe Task</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400" />
        <div className={`flex items-center space-x-2 ${currentStep === "model-selection" ? "text-blue-600 dark:text-blue-400" : currentStep === "prompt-generation" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "model-selection" ? "bg-blue-600 text-white" : currentStep === "prompt-generation" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>
            {currentStep === "prompt-generation" ? <CheckCircle className="h-4 w-4" /> : "2"}
          </div>
          <span>Select Model</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400" />
        <div className={`flex items-center space-x-2 ${currentStep === "prompt-generation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "prompt-generation" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}>
            3
          </div>
          <span>Generate Prompts</span>
        </div>
      </div>

      {/* Step 1: Task Input */}
      {currentStep === "task-input" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              What do you want the AI to do?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...taskForm}>
              <form onSubmit={taskForm.handleSubmit(handleTaskSubmit)} className="space-y-4">
                <FormField
                  control={taskForm.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you want the AI to help you with. For example: 'Summarize lengthy legal contracts clearly and concisely' or 'Write engaging social media posts for my coffee shop' or 'Debug and explain complex Python code'"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={analyzeTaskMutation.isPending}
                  className="w-full"
                >
                  {analyzeTaskMutation.isPending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Analyzing task...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Get Model Recommendation
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Model Selection */}
      {currentStep === "model-selection" && recommendation && (
        <div className="space-y-6">
          {/* Recommended Model */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Recommended Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{modelDisplayNames[recommendation.recommendedModel]}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{recommendation.reasoning}</p>
                </div>
                <div className="text-right">
                  <Badge className={getComplexityColor(recommendation.taskComplexity)}>
                    {recommendation.taskComplexity} task
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(recommendation.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Models */}
          {recommendation.alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Other Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendation.alternatives.map((alt, index) => (
                  <div 
                    key={alt.model}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedModel === alt.model 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedModel(alt.model)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{modelDisplayNames[alt.model]}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alt.reason}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-green-600 dark:text-green-400">Pros:</span>
                            {alt.pros.map((pro, i) => (
                              <span key={i} className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                                {pro}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-red-600 dark:text-red-400">Cons:</span>
                            {alt.cons.map((con, i) => (
                              <span key={i} className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded">
                                {con}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {selectedModel === alt.model && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tone Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Select Tone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose the tone for your prompts" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleStartOver} className="flex-1">
              Start Over
            </Button>
            <Button 
              onClick={handleModelConfirmation}
              disabled={generatePromptMutation.isPending || !selectedTone}
              className="flex-1"
            >
              {generatePromptMutation.isPending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating prompts...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Optimized Prompts
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}