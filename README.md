# PerfectPrompt - AI Prompt Generator

A modern web application that serves as an intelligent prompt engineering assistant for OpenAI models. PerfectPrompt features a **task-first workflow** where users describe what they want to accomplish in natural language, receive intelligent model recommendations with detailed reasoning, and then generate optimized system and user prompts tailored to their specific needs.

## Features

### 🎯 Task-First Workflow
- **Natural Language Input**: Describe what you want the AI to do in plain English
- **Intelligent Model Recommendations**: Get AI-powered suggestions for the best OpenAI model for your task
- **Confidence Scoring**: See how confident the system is in its recommendations
- **Alternative Options**: Review other suitable models with detailed pros and cons

### 🤖 Smart Model Selection
- **8 OpenAI Models Supported**: GPT-4o, GPT-4.5, GPT-4.1, GPT-4.1 Mini, o3, o1, o1 Mini, o4 Mini
- **Intelligent Matching**: 
  - Legal/Contract tasks → o3 (complex reasoning)
  - Coding/Development → GPT-4.1 (instruction-following)
  - Creative/Marketing → GPT-4.5 (emotional intelligence)
  - Simple/Fast tasks → GPT-4.1 Mini (efficiency)
  - Multimodal tasks → GPT-4o (vision capabilities)
  - Math/Logic → o3 (deep reasoning)

### 🎨 Tone Customization
- **6 Tone Options**: Friendly, Formal, Technical, Direct, Playful, and more
- **Dynamic Prompt Adaptation**: System prompts automatically adjust based on selected tone
- **Behavioral Modifications**: Tone selection influences AI behavior and response style

### 📋 Optimized Output
- **Dual Prompt Generation**: Separate system and user prompts for optimal results
- **Model-Specific Formatting**: Tips tailored to each model's unique strengths
- **Behavioral Notes**: Guidance on how the selected model performs best
- **One-Click Copy**: Easy copying of generated prompts for immediate use

## Screenshots

### Task Input
Users start by describing their task in natural language:
![Task Input Step](docs/task-input.png)

### Model Recommendation
The app analyzes the task and recommends the optimal model:
![Model Recommendation](docs/model-recommendation.png)

### Generated Prompts
Finally, users receive optimized system and user prompts:
![Generated Prompts](docs/generated-prompts.png)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom design system
- **React Hook Form** for form handling
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **OpenAI API** integration for prompt generation
- **Zod** for schema validation
- **Node.js** with ES modules

### Development Tools
- **TypeScript** with strict configuration
- **ESLint** and **Prettier** for code quality
- **Drizzle ORM** for database operations
- **Replit** integration for seamless deployment

## Getting Started

### Prerequisites
- Node.js 18 or higher
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd perfectprompt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Add your OpenAI API key
export OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Task Analysis
```typescript
POST /api/analyze-task
Request: { taskDescription: string }
Response: {
  recommendedModel: string,
  confidence: number,
  reasoning: string,
  taskComplexity: "simple" | "moderate" | "complex",
  alternatives: Array<{model, reason, pros, cons}>
}
```

### Prompt Generation
```typescript
POST /api/generate-task-prompt
Request: { 
  taskDescription: string, 
  selectedModel: string, 
  tone: string 
}
Response: {
  systemPrompt: string,
  userPrompt: string,
  formattingTips: string[],
  behavioralNotes: string[]
}
```

## Usage Examples

### Example 1: Content Creation
1. **Task**: "Write engaging blog posts about technology trends"
2. **Recommendation**: GPT-4.5 (85% confidence) - Best for creative writing
3. **Generated Prompts**: Optimized for engaging, trend-focused content

### Example 2: Code Debugging
1. **Task**: "Debug complex Python algorithms and explain the logic"
2. **Recommendation**: GPT-4.1 (85% confidence) - Superior for development work
3. **Generated Prompts**: Technical prompts with step-by-step debugging focus

### Example 3: Legal Analysis
1. **Task**: "Review and analyze legal contracts for potential issues"
2. **Recommendation**: o3 (88% confidence) - Complex reasoning required
3. **Generated Prompts**: Detailed analysis prompts with legal focus

## Project Structure

```
perfectprompt/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── lib/          # Utilities and configurations
│   │   └── pages/        # Page components
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared TypeScript types
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, TypeScript, and the OpenAI API
