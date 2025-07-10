import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { generatePromptSchema } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
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