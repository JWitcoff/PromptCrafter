export const modelPromptGuidance = {
  "gpt-4o": {
    formattingTips: [
      "Supports markdown, bullet points, and code blocks",
      "Use clear instructions but natural language is fine",
      "Specify desired length (it may default to short answers)",
    ],
    userPromptNotes: [
      "Tends to be more conversational unless constrained",
      "Responds quickly but may compress info unless told to expand",
    ],
    idealUserPromptExample: `Summarize the following article using bullet points and simple language. Keep the core ideas but avoid repetition.\n\n[Paste text here]`,
  },

  "gpt-4-turbo": {
    formattingTips: [
      "Prefers clear step-by-step or numbered instructions",
      "Works well with few-shot formatting (e.g., Input/Output pairs)",
      "Handles large context windows — great for long prompts",
    ],
    userPromptNotes: [
      "Can be verbose unless told to keep it short",
      "Respects formatting and tone constraints reliably",
    ],
    idealUserPromptExample: `Explain the following code in plain English. Use bullet points and include code snippets for reference.\n\n[Insert code here]`,
  },

  "gpt-4": {
    formattingTips: [
      "Use delimiters like --- or ``` to separate sections",
      "Be explicit in instructions — prefers structured prompts",
      "Markdown support is strong, but slower output",
    ],
    userPromptNotes: [
      "Most deliberate reasoning, but also the slowest",
      "Needs clear scoping to avoid vague responses",
    ],
    idealUserPromptExample: `Write a one-paragraph summary of the following legal text. Focus on the constitutional arguments made by each side.\n\n---\n[Insert legal passage here]`,
  },

  "gpt-3.5": {
    formattingTips: [
      "Keep prompts short and literal — no ambiguity",
      "Use plain instructions and define expected output format",
      "Wrap examples in delimiters like ``` or === for clarity",
    ],
    userPromptNotes: [
      "Can hallucinate or make confident errors",
      "Not good at open-ended or abstract tasks",
    ],
    idealUserPromptExample: `Extract all email addresses from the following text and return them as a list:\n\n===\n[Paste text here]\n===`,
  },

  "gpt-3.5-turbo-instruct": {
    formattingTips: [
      "Treat like CLI input — concise and directive",
      "Avoid chatty language — just tell it what to do",
    ],
    userPromptNotes: [
      "Ideal for tools, scripts, or single-turn commands",
      "No chat history or memory — stateless interaction",
    ],
    idealUserPromptExample: `Rewrite this sentence to sound more professional:\n"Hey, I need that report ASAP or we're gonna be in trouble."`,
  },

  "gpt-4o-mini": {
    formattingTips: [
      "Use simple, rule-based language (like a tagger or classifier)",
      "Avoid creative or open-ended tasks",
    ],
    userPromptNotes: [
      "Optimized for deterministic, fast responses",
      "Lower quality for nuanced writing or reasoning",
    ],
    idealUserPromptExample: `Classify this support request into one of the following categories: Billing, Technical, or Account Access.\n\n[Paste request here]`,
  },

  // New models with appropriate guidance
  "gpt-4.5": {
    formattingTips: [
      "Supports markdown, bullet points, and code blocks",
      "Use clear instructions but natural language is fine",
      "Specify desired length (it may default to short answers)",
    ],
    userPromptNotes: [
      "Enhanced emotional intelligence and creativity",
      "Strong at following intent with reduced hallucinations",
    ],
    idealUserPromptExample: `Summarize the following article using bullet points and simple language. Keep the core ideas but avoid repetition.\n\n[Paste text here]`,
  },

  "gpt-4.1": {
    formattingTips: [
      "Prefers clear step-by-step or numbered instructions",
      "Excellent for code-related tasks and debugging",
      "Handles technical documentation very well",
    ],
    userPromptNotes: [
      "Specialized for coding and instruction-following",
      "More precise than GPT-4o for development tasks",
    ],
    idealUserPromptExample: `Explain the following code in plain English. Use bullet points and include code snippets for reference.\n\n[Insert code here]`,
  },

  "gpt-4.1-mini": {
    formattingTips: [
      "Use simple, rule-based language (like a tagger or classifier)",
      "Good for lightweight coding tasks",
      "Keep instructions clear and concise",
    ],
    userPromptNotes: [
      "Lightweight version optimized for speed",
      "Best for simple, well-defined tasks",
    ],
    idealUserPromptExample: `Fix the syntax error in this code and explain what was wrong:\n\n[Insert code here]`,
  },

  "o3": {
    formattingTips: [
      "Excellent for complex reasoning and analysis",
      "Use structured problem statements",
      "Great for mathematical and logical proofs",
    ],
    userPromptNotes: [
      "State-of-the-art reasoning capabilities",
      "Ideal for deep analysis and problem-solving",
    ],
    idealUserPromptExample: `Analyze the following problem step-by-step and provide a detailed solution with your reasoning:\n\n[Insert problem here]`,
  },

  "o4-mini": {
    formattingTips: [
      "Efficient for reasoning tasks with good performance",
      "Use clear problem statements",
      "Great for math, data science, and coding",
    ],
    userPromptNotes: [
      "High-performance reasoning model",
      "Cost-efficient with fast throughput",
    ],
    idealUserPromptExample: `Solve this step-by-step and show your work:\n\n[Insert problem here]`,
  },

  "o1": {
    formattingTips: [
      "Good for complex problem-solving",
      "Use structured reasoning prompts",
      "Works well with coding and math problems",
    ],
    userPromptNotes: [
      "Solid reasoning capabilities",
      "Less advanced than o3/o4-mini models",
    ],
    idealUserPromptExample: `Break down this problem and solve it step-by-step:\n\n[Insert problem here]`,
  },

  "o1-mini": {
    formattingTips: [
      "Compact reasoning model",
      "Use clear, direct problem statements",
      "Good for moderate complexity tasks",
    ],
    userPromptNotes: [
      "Lightweight reasoning model",
      "Best for simpler analytical tasks",
    ],
    idealUserPromptExample: `Solve this problem and explain your approach:\n\n[Insert problem here]`,
  },
};

// Helper function to get model guidance with fallback
export function getModelGuidance(modelName: string) {
  return modelPromptGuidance[modelName as keyof typeof modelPromptGuidance] || modelPromptGuidance["gpt-4o"];
}