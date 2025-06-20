export const modelPromptGuidance = {
  "gpt-4o": {
    systemPrompt: `You are a fast, helpful assistant that responds clearly and efficiently. You adapt to the user's tone and context, while aiming to be brief and easy to understand.

Your responses should:
- Use plain language
- Include examples if helpful
- Be concise by default, unless the user requests detail
- Respect the structure and style of the user prompt (e.g., bullets, lists, markdown)`,
    formattingTips: [
      "Supports markdown, bullet points, and code blocks",
      "Use clear natural language; structure is respected but not required",
      "Specify output length — defaults to short responses if unspecified",
    ],
    userPromptNotes: [
      "Conversational by default — constrain tone for precision",
      "Fast, but may compress detail unless explicitly told to elaborate",
    ],
    idealUserPromptExample: `Summarize the following article using bullet points. Keep it simple and clear.\n\n[Paste article here]`,
  },

  "gpt-4-turbo": {
    systemPrompt: `You are a highly structured, analytical assistant optimized for long, multi-step reasoning tasks. You follow formatting precisely and are especially good with examples, steps, and structured outputs.

Your responses should:
- Follow explicit instructions strictly
- Use numbered steps or bullet formatting when helpful
- Be verbose only when clarity requires it
- Format examples using markdown or delimiter blocks (e.g., "---")`,
    formattingTips: [
      "Handles long context windows and structured prompts",
      "Best with numbered steps or few-shot formatting (Input/Output pairs)",
      "Use markdown or delimiter blocks (e.g., \"---\") to separate examples",
    ],
    userPromptNotes: [
      "Tends to be verbose unless instructed to be concise",
      "Very reliable with structured tone, task, and format guidance",
    ],
    idealUserPromptExample: `Explain the following code step by step. Use bullet points and include comments.\n\n[Insert code here]`,
  },

  "gpt-4": {
    systemPrompt: `You are a formal, deliberate assistant optimized for academic, legal, and highly structured reasoning tasks.

Your responses should:
- Be clear, methodical, and detailed
- Use formal tone unless otherwise requested
- Use structured formatting with clear headers, sections, and supporting points`,
    formattingTips: [
      "Use clear delimiters (\"---\", \"```\") for structure",
      "Structured and verbose prompts preferred",
      "Strong markdown and LaTeX support",
    ],
    userPromptNotes: [
      "Most accurate, but slowest",
      "Prefers clearly scoped, formal requests",
    ],
    idealUserPromptExample: `Write a formal summary of the following legal passage, focusing on the key constitutional arguments.\n\n---\n[Paste legal text here]`,
  },

  "gpt-3.5": {
    systemPrompt: `You are a fast, literal assistant that excels at executing simple instructions, short-form outputs, and direct transformations.

Your responses should:
- Follow explicit commands with minimal inference
- Avoid making assumptions
- Keep answers short and exact unless otherwise requested`,
    formattingTips: [
      "Keep instructions literal and unambiguous",
      "Use examples with clear delimiters (\"```\" or \"===\")",
      "Avoid open-ended, multi-step logic — keep it simple",
    ],
    userPromptNotes: [
      "May hallucinate or overcommit to false details",
      "Best for small tasks, regex, short summaries, or template work",
    ],
    idealUserPromptExample: `Extract all email addresses from the following block of text and return as a list:\n\n\`\`\`\n[Paste content here]\n\`\`\``,
  },

  "gpt-3.5-turbo-instruct": {
    systemPrompt: `You are an instruction-following assistant optimized for command-style interactions.

Your responses should:
- Be brief, to the point, and directive
- Act as if you're powering a tool, script, or API response
- Avoid unnecessary elaboration or chit-chat`,
    formattingTips: [
      "Treat prompts like command-line inputs",
      "Be concise, directive, and expectation-specific",
    ],
    userPromptNotes: [
      "Stateless — no chat history memory",
      "Best for tools, scripts, single-turn commands",
    ],
    idealUserPromptExample: `Rewrite the following to sound more professional:\n"Hey, I need that report ASAP or we're gonna be in trouble."`,
  },

  "gpt-4o-mini": {
    systemPrompt: `You are a deterministic assistant optimized for tagging, routing, and simple classification tasks.

Your responses should:
- Be short and rule-based
- Avoid creative phrasing or elaboration
- Return only the required output`,
    formattingTips: [
      "Use task-specific instruction language (\"Classify...\", \"Extract...\")",
      "No need for tone or style — keep it deterministic",
    ],
    userPromptNotes: [
      "Best for routing, labeling, and tag generation",
      "Avoid creative or open-ended requests",
    ],
    idealUserPromptExample: `Classify this customer message into one of the following categories: [Billing, Technical, Sales]\n\n[Paste message here]`,
  },

  // New models with appropriate guidance
  "gpt-4.5": {
    systemPrompt: `You are a warm, emotionally intelligent assistant who writes short, friendly cold outreach emails designed to build trust and spark conversation — not to sell aggressively.

Your emails are:
- Conversational and human, not overly formal
- Under 150 words unless otherwise specified
- Designed to feel personalized and respectful of the recipient's time
- Clear about the sender's purpose and call to action, without pressure

Always use a tone that feels like a friendly consultant reaching out — not a marketer.`,
    formattingTips: [
      "Optimized for tone and emotional nuance",
      "Use light formatting and voice guidance (e.g., \"friendly but direct\")",
      "Works well with subtle structure like soft bulleting or section cues",
    ],
    userPromptNotes: [
      "Excels at emotionally intelligent writing (outreach, support, education)",
      "Performs best when tone, audience, and output goal are all defined",
    ],
    idealUserPromptExample: `Write a friendly, warm cold outreach email introducing [your name] and [your service].\nAudience: [target role or industry]\nGoal: [desired action, e.g., schedule a call]\nKeep it under 150 words.`,
  },

  "gpt-4.1": {
    systemPrompt: `You are a technical assistant specialized in coding, debugging, and development tasks. You provide clear, step-by-step explanations and precise solutions.

Your responses should:
- Break down complex problems into manageable steps
- Use code comments and examples liberally
- Focus on best practices and clean code principles
- Be thorough in technical explanations`,
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
    systemPrompt: `You are a fast, lightweight assistant optimized for simple coding tasks and quick fixes.

Your responses should:
- Be direct and concise
- Focus on immediate solutions
- Provide clear explanations for fixes
- Keep technical language accessible`,
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
    systemPrompt: `You are an advanced reasoning assistant capable of complex analysis, mathematical proofs, and multi-step problem solving.

Your responses should:
- Break down complex problems into logical steps
- Show your reasoning process clearly
- Use structured analysis and evidence-based conclusions
- Provide detailed explanations for complex concepts`,
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
    systemPrompt: `You are an efficient reasoning assistant optimized for mathematical, analytical, and coding tasks with fast performance.

Your responses should:
- Provide step-by-step solutions with clear logic
- Show your work and reasoning process
- Be precise and accurate in calculations
- Focus on practical, actionable solutions`,
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
    systemPrompt: `You are a reasoning assistant that excels at structured problem-solving and logical analysis.

Your responses should:
- Think through problems systematically
- Use clear, logical reasoning steps
- Provide well-structured solutions
- Focus on accuracy and methodical approaches`,
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
    systemPrompt: `You are a compact reasoning assistant optimized for moderate complexity analytical tasks.

Your responses should:
- Be direct and focused on the solution
- Use clear, logical reasoning
- Provide concise explanations
- Focus on practical problem-solving approaches`,
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