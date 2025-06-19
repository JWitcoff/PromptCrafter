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

      const { model, taskType, tone } = validation.data;

      // System prompt for the OpenAI API to generate optimized prompts
      const systemPrompt = `You are a prompt engineering expert specialized in creating optimal system and user prompts for OpenAI models.

Your task is to generate a perfectly formatted system + user prompt template optimized for the specific model, task, and tone provided.

Return your response as a JSON object with these exact fields:
- systemPrompt: The best system message for this use case
- userPrompt: A well-structured, real example of how the user should phrase their query
- formattingTips: Array of bullet-point guidance on how best to format prompts for this model (markdown, delimiters, few-shot support, etc.)
- behavioralNotes: Array of known quirks or model-specific behavior to expect

Be concise. Avoid generic tips. Tailor the output precisely to the chosen model and task type.

Model capabilities and behaviors:
- gpt-4o: Best all-purpose model, excels at real-time reasoning across text, vision, and audio. Ideal for multimodal tasks, fast response, and tool use
- gpt-4.5: Best for natural, emotionally intelligent chat and creative insights. Strong at writing, intent-following, and reduced hallucinations. Less focused on reasoning
- gpt-4.1: Specialized for coding and instruction-following. Stronger than GPT-4o for precise dev work and web tasks
- gpt-4.1-mini: A lightweight, fast instruction-following model for general-purpose use and coding. Fallback for free-tier users
- o3: State-of-the-art reasoning model. Ideal for deep analysis in math, science, programming, consulting, and visual problem-solving
- o4-mini: High-performance, cost-efficient reasoning model. Excels in math, data science, and coding with fast throughput; strong at non-STEM too
- o1: Solid reasoning models for complex problem-solving across coding, math, and research. Less capable than o3/o4-mini and lacks tool access
- o1-mini: Solid reasoning models for complex problem-solving across coding, math, and research. Less capable than o3/o4-mini and lacks tool access

Task-specific considerations:
- summarization: Focus on key points, structure, length control
- code-explanation: Technical accuracy, step-by-step breakdown
- email-writing: Professional tone, clear structure, appropriate formality
- legal-reasoning: Precision, citations, careful language
- data-extraction: Structured output, accuracy, format specification
- multimodal-reasoning: Image/text analysis, comprehensive understanding
- creative-writing: Inspiration, style guidance, creativity prompts
- sql-generation: Database schema awareness, query optimization
- json-formatting: Strict structure, validation, error handling
- math-logic-proofs: Step-by-step reasoning, verification
- chatbot-conversations: Natural flow, personality, context maintenance`;

      const userPrompt = `Generate an optimized prompt template for:
- Model: ${model}
- Task: ${taskType}
- Tone: ${tone}

Include specific formatting recommendations and behavioral notes for this exact combination.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI API");
      }

      let result;
      try {
        result = JSON.parse(content);
      } catch (parseError) {
        throw new Error("Invalid JSON response from OpenAI API");
      }

      // Validate the response structure
      if (!result.systemPrompt || !result.userPrompt || !Array.isArray(result.formattingTips) || !Array.isArray(result.behavioralNotes)) {
        throw new Error("Invalid response structure from OpenAI API");
      }

      res.json(result);

    } catch (error) {
      console.error("Error generating prompt:", error);
      
      if (error.message?.includes("API key")) {
        return res.status(401).json({ 
          message: "OpenAI API key not configured or invalid" 
        });
      }
      
      if (error.message?.includes("quota") || error.message?.includes("billing")) {
        return res.status(402).json({ 
          message: "OpenAI API quota exceeded or billing issue" 
        });
      }

      res.status(500).json({ 
        message: "Failed to generate prompt. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
