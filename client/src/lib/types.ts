export interface GeneratePromptRequest {
  model: string;
  taskType: string;
  tone: string;
}

export interface PromptResponse {
  systemPrompt: string;
  userPrompt: string;
  formattingTips: string[];
  behavioralNotes: string[];
}
