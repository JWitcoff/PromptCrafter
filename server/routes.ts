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

      // System prompt for the OpenAI API to generate optimized prompts
      const systemPrompt = customPrompt 
        ? `You are a prompt engineering expert specialized in optimizing and reformatting prompts for OpenAI models.

Your task is to take the user's existing prompt and transform it into a structured, reusable template with [placeholder] fields optimized for the specific model, task type, and tone provided.

CRITICAL: Even when optimizing existing prompts, create templates with [bracketed placeholders] for all variable content. Transform generic requests into structured, customizable templates.

For example:
- "Write me a good email" becomes a template with [recipient name], [subject], [company], etc.
- "Summarize this article" becomes a template with [article title], [key focus areas], [target length], etc.

Return your response as a JSON object with these exact fields:
- systemPrompt: An optimized system message based on the user's intent, tailored for the chosen model
- userPrompt: A structured template with [placeholders] based on the user's request, optimized for the chosen model
- formattingTips: Array of specific improvements made and formatting recommendations for this model
- behavioralNotes: Array of model-specific behavior notes relevant to this optimized prompt

Transform the user's prompt into a reusable template with clear [placeholder] fields.

EXACT TEMPLATE MATCH REQUIRED: For GPT-4.5 cold outreach emails, generate EXACTLY this style:
System: "You are a helpful AI assistant that writes warm, conversational outreach emails designed to start a relationship—not just sell something. You always sound approachable and human, like a friendly consultant reaching out to help. Your writing is short, clear, and lightly persuasive. Avoid buzzwords and keep the message under 150 words unless otherwise specified."
User: "Write a cold outreach email introducing [your name or company] and [your service or offer]. The tone should be friendly, helpful, and human — not pushy. Audience: [brief description of who you're reaching out to] Goal: [what do you want them to do — reply, schedule a call, click a link] Constraints: Keep it under 150 words. Avoid jargon or overly formal language. End with a warm, low-pressure CTA."

Model-specific prompting approaches:

GPT-4.5: Emphasize warmth, human connection, conversational tone. Focus on emotional intelligence and relationship-building. Keep prompts concise and approachable. Avoid technical jargon. Perfect for content that needs to feel genuine and personal.

GPT-4o: Direct, structured prompts with clear instructions. Excellent for multimodal tasks and real-time reasoning. Use specific formatting requests and step-by-step guidance. Good for complex tasks requiring tool use or analysis.

GPT-4.1: Technical precision and code-focused prompts. Use explicit instructions with clear expected outputs. Perfect for development tasks, debugging, and instruction-following. Prefers structured, unambiguous requests.

O3: Deep reasoning prompts with complex problem statements. Use structured analysis requests. Perfect for mathematical proofs, logical reasoning, and multi-step problem solving. Provide clear context and ask for detailed explanations.

O1/O4-mini: Efficient reasoning prompts focused on specific problems. Use clear problem statements with defined constraints. Good for coding, math, and data analysis with emphasis on speed and accuracy.

CRITICAL: Tailor both system and user prompts to match each model's specific strengths and optimal prompting style.

Examples of model-specific system prompts:

GPT-4.5 (emotional intelligence): "You are a helpful AI assistant that writes warm, conversational outreach emails designed to start a relationship—not just sell something. You always sound approachable and human, like a friendly consultant reaching out to help. Your writing is short, clear, and lightly persuasive. Avoid buzzwords and keep the message under 150 words unless otherwise specified."

GPT-4o (structured reasoning): "You are an expert email composer focused on clear, efficient communication. Create well-structured emails with logical flow, specific formatting, and actionable outcomes. Use bullet points, clear sections, and professional language optimized for business contexts."

GPT-4.1 (technical precision): "You are a precise communication assistant specialized in clear, unambiguous instructions. Generate emails with explicit structure, defined parameters, and measurable outcomes. Focus on accuracy and technical clarity."

O3 (deep analysis): "You are an expert communication strategist who analyzes audience psychology and crafts emails with sophisticated persuasion techniques. Consider multi-layered messaging, stakeholder analysis, and strategic positioning in your recommendations."

FOLLOW THESE EXAMPLES CLOSELY - each model needs distinctly different system prompt styles.`
        : `You are a world-class prompt engineering assistant.

Your job is to generate *optimized system and user prompts* tailored to the selected OpenAI model, task type, and tone.

When no specific input context is provided by the user (e.g., no product, persona, or data), return a **general-purpose, editable prompt template** that includes:
- A clear task description
- Tone/style guidance aligned to the selected model
- Placeholder fields for the user to fill in (e.g., [insert service], [target audience])
- Helpful structure (like bullet points, sections, or constraints on length)

Do not assume details. Instead, scaffold prompts with clear placeholder text and light formatting that makes customization easy.

Return your response as a JSON object with these exact fields:
- systemPrompt: The best system message for this use case
- userPrompt: A well-structured template with [placeholders] for user customization - MUST include [bracketed placeholders] for all variable content
- formattingTips: Array of bullet-point guidance on how best to format prompts for this model (markdown, delimiters, few-shot support, etc.)
- behavioralNotes: Array of known quirks or model-specific behavior to expect

CRITICAL: The userPrompt field must be a reusable template with [placeholder] text, not a specific example.

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

      const userPrompt = customPrompt 
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
