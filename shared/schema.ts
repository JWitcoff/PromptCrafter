import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Prompt generation schemas
export const generatePromptSchema = z.object({
  model: z.enum([
    "gpt-4o",
    "gpt-4.5",
    "gpt-4.1",
    "gpt-4.1-mini",
    "o3",
    "o4-mini",
    "o1",
    "o1-mini"
  ]),
  taskType: z.enum([
    "summarization",
    "code-explanation",
    "email-writing",
    "legal-reasoning",
    "data-extraction",
    "multimodal-reasoning",
    "creative-writing",
    "sql-generation",
    "json-formatting",
    "math-logic-proofs",
    "chatbot-conversations",
    "other"
  ]),
  tone: z.enum([
    "friendly",
    "formal",
    "technical",
    "direct",
    "playful"
  ]),
  customPrompt: z.string().optional()
});

// Form schema with optional fields for initial state
export const generatePromptFormSchema = generatePromptSchema.partial();

export type GeneratePromptRequest = z.infer<typeof generatePromptSchema>;

export const promptResponseSchema = z.object({
  systemPrompt: z.string(),
  userPrompt: z.string(),
  formattingTips: z.array(z.string()),
  behavioralNotes: z.array(z.string())
});

export type PromptResponse = z.infer<typeof promptResponseSchema>;

// New schemas for task-first workflow
export const taskAnalysisSchema = z.object({
  taskDescription: z.string().min(10, "Please provide a detailed task description (at least 10 characters)")
});

export type TaskAnalysisRequest = z.infer<typeof taskAnalysisSchema>;

export const modelRecommendationSchema = z.object({
  recommendedModel: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  taskComplexity: z.enum(["simple", "moderate", "complex"]),
  alternatives: z.array(z.object({
    model: z.string(),
    reason: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string())
  }))
});

export type ModelRecommendation = z.infer<typeof modelRecommendationSchema>;

// Updated prompt generation schema for task-first flow
export const taskFirstPromptSchema = z.object({
  taskDescription: z.string().min(1),
  selectedModel: z.string(),
  tone: z.enum([
    "friendly",
    "formal", 
    "technical",
    "direct",
    "playful"
  ])
});

export type TaskFirstPromptRequest = z.infer<typeof taskFirstPromptSchema>;
