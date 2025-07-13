import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { generatePromptSchema, taskAnalysisSchema, taskFirstPromptSchema, type ModelRecommendation } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY 
});

// Model recommendation logic based on task analysis
function analyzeTaskAndRecommendModel(taskDescription: string): ModelRecommendation {
  const task = taskDescription.toLowerCase();
  
  // Keywords for task complexity and type analysis
  const complexKeywords = ["legal", "reasoning", "complex", "analysis", "research", "math", "logic", "proof", "algorithm", "deep"];
  const codingKeywords = ["code", "programming", "debug", "function", "api", "database", "sql", "web", "development"];
  const creativeKeywords = ["creative", "writing", "story", "blog", "content", "marketing", "email", "social"];
  const multimodalKeywords = ["image", "visual", "chart", "graph", "picture", "audio", "video", "multimodal"];
  const speedKeywords = ["quick", "fast", "simple", "summary", "brief", "extract", "format"];
  
  const hasComplexKeywords = complexKeywords.some(keyword => task.includes(keyword));
  const hasCodingKeywords = codingKeywords.some(keyword => task.includes(keyword));
  const hasCreativeKeywords = creativeKeywords.some(keyword => task.includes(keyword));
  const hasMultimodalKeywords = multimodalKeywords.some(keyword => task.includes(keyword));
  const hasSpeedKeywords = speedKeywords.some(keyword => task.includes(keyword));
  
  // Determine task complexity
  let taskComplexity: "simple" | "moderate" | "complex" = "simple";
  if (hasComplexKeywords || (hasCodingKeywords && task.length > 100)) {
    taskComplexity = "complex";
  } else if (hasCodingKeywords || hasCreativeKeywords || task.length > 50) {
    taskComplexity = "moderate";
  }
  
  // Model recommendation logic
  let recommendedModel = "gpt-4o";
  let reasoning = "";
  let confidence = 0.8;
  
  if (hasComplexKeywords && (task.includes("math") || task.includes("logic") || task.includes("proof"))) {
    recommendedModel = "o3";
    reasoning = "Complex reasoning task requiring deep analysis. o3 excels at math, science, and logical problem-solving.";
    confidence = 0.9;
  } else if (task.includes("legal") || task.includes("contract")) {
    recommendedModel = "o3";
    reasoning = "Legal task requiring careful analysis and reasoning. o3 excels at complex document analysis and legal reasoning.";
    confidence = 0.88;
  } else if (hasCodingKeywords && !hasSpeedKeywords) {
    recommendedModel = "gpt-4.1";
    reasoning = "Coding task detected. GPT-4.1 specializes in precise development work and instruction-following.";
    confidence = 0.85;
  } else if (hasCreativeKeywords || task.includes("emotion") || task.includes("empathy")) {
    recommendedModel = "gpt-4.5";
    reasoning = "Creative or emotionally intelligent task. GPT-4.5 excels at natural, engaging writing with emotional nuance.";
    confidence = 0.85;
  } else if (hasMultimodalKeywords) {
    recommendedModel = "gpt-4o";
    reasoning = "Multimodal task requiring vision capabilities. GPT-4o handles text, images, and audio effectively.";
    confidence = 0.9;
  } else if (hasSpeedKeywords || taskComplexity === "simple") {
    recommendedModel = "gpt-4.1-mini";
    reasoning = "Simple, fast task. GPT-4.1 Mini provides efficient performance for lightweight operations.";
    confidence = 0.8;
  } else {
    recommendedModel = "gpt-4o";
    reasoning = "General-purpose task. GPT-4o offers excellent all-around performance for most use cases.";
    confidence = 0.75;
  }
  
  // Generate alternatives
  const allModels = ["gpt-4o", "gpt-4.5", "gpt-4.1", "gpt-4.1-mini", "o3", "o4-mini", "o1", "o1-mini"];
  const alternatives = allModels
    .filter(model => model !== recommendedModel)
    .slice(0, 3)
    .map(model => {
      const modelInfo = getModelInfo(model);
      return {
        model,
        reason: modelInfo.reason,
        pros: modelInfo.pros,
        cons: modelInfo.cons
      };
    });
  
  return {
    recommendedModel,
    confidence,
    reasoning,
    taskComplexity,
    alternatives
  };
}

function getModelInfo(model: string) {
  const modelMap: Record<string, { reason: string; pros: string[]; cons: string[] }> = {
    "gpt-4o": {
      reason: "Best all-purpose model with multimodal capabilities",
      pros: ["Fast response", "Handles text, images, audio", "Excellent for real-time tasks"],
      cons: ["May compress detail unless specified", "Higher cost than mini models"]
    },
    "gpt-4.5": {
      reason: "Optimized for emotional intelligence and natural conversation",
      pros: ["Excellent tone control", "Reduced hallucinations", "Great for creative writing"],
      cons: ["Less focused on pure reasoning", "May be too conversational for technical tasks"]
    },
    "gpt-4.1": {
      reason: "Specialized for coding and precise instruction-following",
      pros: ["Superior for development work", "Precise code generation", "Strong instruction adherence"],
      cons: ["Less creative than other models", "Optimized for technical tasks"]
    },
    "gpt-4.1-mini": {
      reason: "Lightweight, fast model for simple tasks",
      pros: ["Cost-efficient", "Fast response", "Good for basic operations"],
      cons: ["Limited complexity handling", "Less capable for nuanced tasks"]
    },
    "o3": {
      reason: "State-of-the-art reasoning for complex problem-solving",
      pros: ["Superior reasoning", "Excellent for math/science", "Deep analysis capabilities"],
      cons: ["Slower response", "Higher cost", "May be overkill for simple tasks"]
    },
    "o4-mini": {
      reason: "High-performance reasoning with cost efficiency",
      pros: ["Strong reasoning", "Fast throughput", "Cost-efficient"],
      cons: ["Less capable than o3", "Still slower than GPT models"]
    },
    "o1": {
      reason: "Solid reasoning model for complex tasks",
      pros: ["Good reasoning capability", "Handles complex problems", "Balanced performance"],
      cons: ["Less capable than o3/o4-mini", "No tool access in ChatGPT"]
    },
    "o1-mini": {
      reason: "Compact reasoning model",
      pros: ["Decent reasoning", "More affordable", "Suitable for moderate complexity"],
      cons: ["Limited compared to full o1", "Less reasoning power than o3/o4-mini"]
    }
  };
  
  return modelMap[model] || modelMap["gpt-4o"];
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // New endpoint for task analysis and model recommendation
  app.post("/api/analyze-task", async (req, res) => {
    try {
      const validation = taskAnalysisSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid task description",
          errors: validation.error.errors 
        });
      }
      
      const { taskDescription } = validation.data;
      const recommendation = analyzeTaskAndRecommendModel(taskDescription);
      
      res.json(recommendation);
      
    } catch (error: any) {
      console.error("Error analyzing task:", error);
      res.status(500).json({ 
        message: "Failed to analyze task", 
        error: error.message 
      });
    }
  });

  // New endpoint for task-first prompt generation
  app.post("/api/generate-task-prompt", async (req, res) => {
    try {
      const validation = taskFirstPromptSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input parameters",
          errors: validation.error.errors 
        });
      }
      
      const { taskDescription, selectedModel, tone } = validation.data;
      
      // System prompt for task-first prompt generation
      const systemPrompt = `You are a prompt engineering expert specialized in creating optimal prompts for OpenAI models based on user task descriptions.

Your task is to:
1. Analyze the user's task: "${taskDescription}"
2. Create optimized system and user prompts tailored specifically for ${selectedModel} with ${tone} tone
3. Ensure the prompts address the specific task requirements effectively

CRITICAL: Create prompts that directly address the user's task description while being optimized for ${selectedModel} and ${tone} tone.

Return your response as a JSON object with these exact fields:
- systemPrompt: A system message specifically optimized for ${selectedModel} to handle this task with ${tone} tone
- userPrompt: A structured template with [placeholders] that addresses the specific task while remaining reusable
- formattingTips: Array of model-specific formatting recommendations for this type of task
- behavioralNotes: Array of model-specific behavior notes relevant to this task

Model-specific guidance for ${selectedModel}:

GPT-4o: Supports markdown, bullet points, and code blocks. Use clear natural language; structure is respected but not required. Specify output length — defaults to short responses if unspecified. Conversational by default — constrain tone for precision. Fast, but may compress detail unless explicitly told to elaborate.

GPT-4.5: Optimized for tone and emotional nuance. Use light formatting and voice guidance. Works well with subtle structure like soft bulleting or section cues. Excels at emotionally intelligent writing. Performs best when tone, audience, and output goal are all defined.

GPT-4.1: Specialized for coding and instruction-following. Stronger for precise development work and web tasks. Benefits from clear, structured instructions.

O3/O1: State-of-the-art reasoning models. Ideal for deep analysis, complex problem-solving, math, science, programming, and visual problem-solving.

O4-mini/O1-mini: High-performance, cost-efficient reasoning models. Excel in math, data science, and coding with fast throughput.

CRITICAL: Create prompts that directly address the user's specific task while being optimized for ${selectedModel} and ${tone} tone.`;

      const userPrompt = `Create optimized prompts for this task:

Task Description: "${taskDescription}"
Target Model: ${selectedModel}
Desired Tone: ${tone}

Generate prompts that help the user accomplish this specific task effectively with the selected model.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response content from OpenAI");
      }

      const result = JSON.parse(content);
      
      res.json(result);

    } catch (error: any) {
      console.error("Error generating task-first prompt:", error);
      res.status(500).json({ 
        message: "Failed to generate prompt", 
        error: error.message 
      });
    }
  });
  
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const validation = generatePromptSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input parameters",
          errors: validation.error.errors 
        });
      }

      const { model, taskType, tone, customPrompt } = validation.data;

      // Validate that customPrompt is provided when taskType is "other"
      if (taskType === "other" && (!customPrompt || customPrompt.trim().length === 0)) {
        return res.status(400).json({ 
          message: "Custom description is required when task type is 'Other'",
          errors: [{ 
            path: ["customPrompt"], 
            message: "Custom description is required for 'Other' task type" 
          }] 
        });
      }

      // Special handling for "other" task type - analyze the custom prompt to determine optimal approach
      const effectiveTaskType = taskType === "other" && customPrompt 
        ? "custom-analysis" 
        : taskType;

      // System prompt for the OpenAI API to generate optimized prompts
      const systemPrompt = taskType === "other" && customPrompt
        ? `You are a prompt engineering expert specialized in analyzing user requests and creating optimal prompts for OpenAI models.

Your task is to:
1. Analyze the user's custom request: "${customPrompt}"
2. Determine the most appropriate prompt structure and approach
3. Create optimized system and user prompts tailored specifically for ${model} with ${tone} tone

CRITICAL: Based on the user's request, intelligently determine the best prompt engineering approach. This could involve:
- Content generation (if they want to create something)
- Analysis tasks (if they want to analyze or understand something) 
- Problem-solving (if they want help with a specific challenge)
- Automation/tools (if they want to build something functional)
- Communication (if they want help with writing/messaging)

Return your response as a JSON object with these exact fields:
- systemPrompt: A system message specifically optimized for ${model} to handle the user's request with ${tone} tone
- userPrompt: A structured template with [placeholders] that addresses the user's specific need while remaining reusable
- formattingTips: Array of model-specific formatting recommendations for this type of request
- behavioralNotes: Array of model-specific behavior notes relevant to this use case

Model-specific guidance for ${model}:

GPT-4o: Supports markdown, bullet points, and code blocks. Use clear natural language; structure is respected but not required. Specify output length — defaults to short responses if unspecified. Conversational by default — constrain tone for precision. Fast, but may compress detail unless explicitly told to elaborate.

GPT-4.5: Optimized for tone and emotional nuance. Use light formatting and voice guidance. Works well with subtle structure like soft bulleting or section cues. Excels at emotionally intelligent writing. Performs best when tone, audience, and output goal are all defined.

GPT-4.1: Specialized for coding and instruction-following. Stronger for precise development work and web tasks. Benefits from clear, structured instructions.

O3/O1: State-of-the-art reasoning models. Ideal for deep analysis, complex problem-solving, math, science, programming, and visual problem-solving.

O4-mini/O1-mini: High-performance, cost-efficient reasoning models. Excel in math, data science, and coding with fast throughput.

CRITICAL: Create prompts that directly address the user's specific request while being optimized for ${model} and ${tone} tone.`
        : customPrompt 
        ? `You are a prompt engineering expert specialized in optimizing and reformatting prompts for OpenAI models.

Your task is to take the user's existing prompt and transform it into a structured, reusable template with [placeholder] fields optimized for the specific model, task type, and tone provided.

CRITICAL: Even when optimizing existing prompts, create templates with [bracketed placeholders] for all variable content. Transform generic requests into structured, customizable templates.

For example:
- "Write me a good email" becomes a template with [recipient name], [subject], [company], etc.
- "Summarize this article" becomes a template with [article title], [key focus areas], [target length], etc.

Return your response as a JSON object with these exact fields:
- systemPrompt: An optimized system message specifically designed for ${model} performing ${taskType} tasks with ${tone} tone
- userPrompt: A structured template with [placeholders] based on the user's request, optimized for the chosen model
- formattingTips: Array of specific improvements made and formatting recommendations for this model
- behavioralNotes: Array of model-specific behavior notes relevant to this optimized prompt

Transform the user's prompt into a reusable template with clear [placeholder] fields.

Model-specific prompting guidance:

GPT-4o: Supports markdown, bullet points, and code blocks. Use clear natural language; structure is respected but not required. Specify output length — defaults to short responses if unspecified. Conversational by default — constrain tone for precision. Fast, but may compress detail unless explicitly told to elaborate. Best for: Conversational tasks, image or audio reasoning, fast text generation.

GPT-4.5: Optimized for tone and emotional nuance. Use light formatting and voice guidance (e.g., "friendly but direct"). Works well with subtle structure like soft bulleting or section cues. Excels at emotionally intelligent writing (outreach, support, education). Performs best when tone, audience, and output goal are all defined. Best for: Cold outreach, empathetic messaging, conversational writing.

GPT-3.5: Keep instructions literal and unambiguous. Use examples with clear delimiters. Avoid open-ended, multi-step logic — keep it simple. May hallucinate or overcommit to false details. Best for small tasks, regex, short summaries, or template work.

GPT-4o-mini: Use task-specific instruction language ("Classify...", "Extract..."). No need for tone or style — keep it deterministic. Best for routing, labeling, and tag generation. Avoid creative or open-ended requests.

CRITICAL: The systemPrompt must be specifically crafted for ${model} model performing ${taskType} tasks with ${tone} tone. Do not use generic system prompts.`
        : `You are a world-class prompt engineering assistant.

Your job is to generate *optimized system and user prompts* tailored to the selected OpenAI model, task type, and tone.

CRITICAL: Create a systemPrompt specifically designed for ${model} performing ${taskType} tasks with ${tone} tone. Each combination should produce a unique, optimized system prompt.

When no specific input context is provided by the user (e.g., no product, persona, or data), return a **general-purpose, editable prompt template** that includes:
- A clear task description
- Tone/style guidance aligned to the selected model
- Placeholder fields for the user to fill in (e.g., [insert service], [target audience])
- Helpful structure (like bullet points, sections, or constraints on length)

Do not assume details. Instead, scaffold prompts with clear placeholder text and light formatting that makes customization easy.

Return your response as a JSON object with these exact fields:
- systemPrompt: A system message specifically optimized for ${model} performing ${taskType} tasks with ${tone} tone
- userPrompt: A well-structured template with [placeholders] for user customization - MUST include [bracketed placeholders] for all variable content
- formattingTips: Array of bullet-point guidance on how best to format prompts for this model (markdown, delimiters, few-shot support, etc.)
- behavioralNotes: Array of known quirks or model-specific behavior to expect

CRITICAL: The userPrompt field must be a reusable template with [placeholder] text, not a specific example.

Be concise. Avoid generic tips. Tailor the output precisely to the chosen model and task type.

Model-specific prompting guidance:

GPT-4o: Supports markdown, bullet points, and code blocks. Use clear natural language; structure is respected but not required. Specify output length — defaults to short responses if unspecified. Conversational by default — constrain tone for precision. Fast, but may compress detail unless explicitly told to elaborate. Best for: Conversational tasks, image or audio reasoning, fast text generation.

GPT-4.5: Optimized for tone and emotional nuance. Use light formatting and voice guidance (e.g., "friendly but direct"). Works well with subtle structure like soft bulleting or section cues. Excels at emotionally intelligent writing (outreach, support, education). Performs best when tone, audience, and output goal are all defined. Best for: Cold outreach, empathetic messaging, conversational writing.

GPT-3.5: Keep instructions literal and unambiguous. Use examples with clear delimiters. Avoid open-ended, multi-step logic — keep it simple. May hallucinate or overcommit to false details. Best for small tasks, regex, short summaries, or template work.

GPT-4o-mini: Use task-specific instruction language ("Classify...", "Extract..."). No need for tone or style — keep it deterministic. Best for routing, labeling, and tag generation. Avoid creative or open-ended requests.

CRITICAL: Tailor both system and user prompts to match each model's specific strengths and optimal prompting style.`;

      const userPrompt = taskType === "other" && customPrompt
        ? `Analyze this custom request and create the perfect prompt structure:

User's Request: "${customPrompt}"

Requirements:
- Target Model: ${model}
- Desired Tone: ${tone}
- Must be reusable with [placeholders]

Based on this request, determine the optimal prompt engineering approach and create both system and user prompts that will help the user achieve their goal effectively.`
        : customPrompt 
        ? `Please optimize and reformat this user prompt for the ${model} model:

Original prompt: "${customPrompt}"

Requirements:
- Model: ${model}
- Task: ${taskType}
- Tone: ${tone}

Provide an optimized version with specific improvements and model-specific recommendations.`
        : `Generate an optimized prompt template for:
- Model: ${model}
- Task: ${taskType}
- Tone: ${tone}

IMPORTANT: Create a template with [placeholder] fields that users can customize. DO NOT include specific examples or assume details about the user's context.

For example:
- Instead of "Write about climate change", use "Write about [your topic]"
- Instead of "Email to John Smith about project updates", use "Email to [recipient name] about [subject]"
- Include [bracketed placeholders] for: company names, products, audiences, specific content, etc.

The userPrompt should be a reusable template with clear [placeholders] for customization.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response content from OpenAI");
      }

      const result = JSON.parse(content);
      
      res.json(result);

    } catch (error: any) {
      console.error("Error generating prompt:", error);
      res.status(500).json({ 
        message: "Failed to generate prompt", 
        error: error.message 
      });
    }
  });

  return createServer(app);
}