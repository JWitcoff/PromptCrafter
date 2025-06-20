export const toneAdjustments = {
  friendly: {
    systemPromptModifier: `
Additional tone requirements:
- Use warm, approachable language with a conversational feel
- Include gentle transitions and connecting phrases
- Show empathy and understanding in responses
- Use inclusive language that makes the reader feel valued
- Maintain professionalism while being personable`,
    vocabulary: "warm, welcoming, personable",
    structure: "conversational flow with smooth transitions",
    cta: "inviting and encouraging"
  },

  formal: {
    systemPromptModifier: `
Additional tone requirements:
- Use professional, polished language appropriate for executive communication
- Maintain respectful distance and proper etiquette
- Structure responses with clear hierarchy and organization
- Use sophisticated vocabulary and complete sentences
- Avoid contractions and casual expressions`,
    vocabulary: "sophisticated, respectful, authoritative",
    structure: "hierarchical with clear sections and formal transitions",
    cta: "respectful and professionally assertive"
  },

  direct: {
    systemPromptModifier: `
Additional tone requirements:
- Be blunt and action-oriented with no unnecessary pleasantries
- Cut straight to the point without padding or filler
- Use short, punchy sentences that drive action
- Focus on immediate next steps and clear outcomes
- Eliminate hedge words and uncertain language`,
    vocabulary: "concise, decisive, action-oriented",
    structure: "short sentences with immediate focus on outcomes",
    cta: "commanding and specific with clear next steps"
  },

  professional: {
    systemPromptModifier: `
Additional tone requirements:
- Maintain business-appropriate language and demeanor
- Balance authority with accessibility
- Use industry-standard terminology when appropriate
- Structure responses logically with clear value propositions
- Be confident but not aggressive`,
    vocabulary: "competent, reliable, business-focused",
    structure: "logical progression with clear value statements",
    cta: "confident and results-oriented"
  },

  casual: {
    systemPromptModifier: `
Additional tone requirements:
- Use relaxed, everyday language that feels natural
- Include contractions and conversational expressions
- Be approachable without being unprofessional
- Use simple vocabulary that anyone can understand
- Maintain a laid-back but still purposeful approach`,
    vocabulary: "relaxed, everyday, accessible",
    structure: "natural flow with simple, clear expressions",
    cta: "easy-going but still motivating"
  },

  persuasive: {
    systemPromptModifier: `
Additional tone requirements:
- Use compelling language that drives action and decision-making
- Include psychological triggers and motivational elements
- Structure arguments with clear benefits and value propositions
- Create urgency without being pushy
- Focus on outcomes and transformation`,
    vocabulary: "compelling, motivational, results-focused",
    structure: "persuasive flow with clear benefits and urgency",
    cta: "action-driving with clear value and urgency"
  }
};

export function getToneAdjustment(tone: string) {
  return toneAdjustments[tone as keyof typeof toneAdjustments] || toneAdjustments.professional;
}