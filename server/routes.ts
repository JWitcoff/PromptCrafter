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
- gpt-4o: Latest model, excellent multimodal reasoning, maintains context well, fast and efficient
- gpt-4-turbo: Strong reasoning, good for complex tasks, handles long contexts
- gpt-4: Legacy but reliable, excellent for complex reasoning tasks
- gpt-3.5: Fast and cost-effective, good for simple to moderate tasks
- gpt-4o-mini: Lightweight version of gpt-4o, efficient for simple tasks
- gpt-3.5-turbo-instruct: Completion model, different behavior than chat models

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
