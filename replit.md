# PerfectPrompt - AI Prompt Generator

## Overview

PerfectPrompt is a modern web application that serves as an intelligent prompt engineering assistant for OpenAI models. The application features a **task-first workflow** where users describe what they want to accomplish in natural language, receive intelligent model recommendations with detailed reasoning, and then generate optimized system and user prompts tailored to their specific needs and selected model. It provides a user-friendly interface with step-by-step guidance through the entire prompt optimization process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider with dark/light mode support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API with structured error handling
- **External Services**: OpenAI API integration for prompt generation
- **Middleware**: Express JSON parsing, CORS handling, request logging

### Component Structure
- **UI Components**: Modular shadcn/ui components in `/components/ui/`
- **Business Components**: Custom components like `PromptGenerator` and `ResultsDisplay`
- **Layout**: Responsive design with mobile-first approach
- **Accessibility**: ARIA-compliant components with keyboard navigation

## Key Components

### Prompt Generation Engine
- **Input Processing**: Form validation using Zod schemas
- **Model Support**: 8 OpenAI models (GPT-4o, GPT-4.5, GPT-4.1, o3, o1, etc.)
- **Task Types**: 12 predefined task types plus custom option
- **Tone Variations**: 6 tone options with dynamic system prompt modifications
- **AI Integration**: OpenAI API calls for intelligent prompt optimization

### User Interface
- **Form Management**: React Hook Form with TypeScript validation
- **Real-time Feedback**: Loading states, error handling, and success notifications
- **Copy Functionality**: One-click copying of generated prompts
- **Responsive Design**: Mobile-optimized with collapsible sections
- **Tooltips**: Contextual help for first-time users

### Data Structures
- **Schemas**: Shared TypeScript types between client and server
- **Validation**: Zod schemas for runtime type checking
- **Model Guidance**: Static configuration for model-specific formatting tips

## Data Flow

**New Task-First Workflow (Implemented December 2024):**

1. **Task Description Input**: User describes what they want the AI to do in natural language
2. **Task Analysis**: Backend analyzes task complexity, keywords, and requirements
3. **Model Recommendation**: Rule-based engine recommends optimal model with reasoning and alternatives
4. **Model Selection**: User reviews recommendation and can select alternative models with pros/cons
5. **Tone Selection**: User chooses desired tone for the prompts
6. **Prompt Generation**: AI generates optimized system and user prompts for selected model and task
7. **Results Display**: Structured prompts with model-specific formatting tips and behavioral notes

### API Endpoints
```typescript
// Task Analysis
POST /api/analyze-task
Request: { taskDescription: string }
Response: {
  recommendedModel: string,
  confidence: number,
  reasoning: string,
  taskComplexity: "simple" | "moderate" | "complex",
  alternatives: Array<{model, reason, pros, cons}>
}

// Task-First Prompt Generation  
POST /api/generate-task-prompt
Request: { taskDescription: string, selectedModel: string, tone: string }
Response: {
  systemPrompt: string,
  userPrompt: string, 
  formattingTips: string[],
  behavioralNotes: string[]
}
```

### Model Recommendation Logic
- **Legal/Contract tasks** → o3 (complex reasoning)
- **Coding/Development** → GPT-4.1 (instruction-following)  
- **Creative/Marketing** → GPT-4.5 (emotional intelligence)
- **Simple/Fast tasks** → GPT-4.1 Mini (efficiency)
- **Multimodal tasks** → GPT-4o (vision capabilities)
- **Math/Logic** → o3 (deep reasoning)
- **Default** → GPT-4o (general purpose)

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with TanStack Query
- **Icons**: Lucide React icons

### Backend Dependencies
- **Server**: Express.js, Node.js
- **AI Integration**: OpenAI SDK
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build Tools**: Vite, esbuild
- **TypeScript**: Full TypeScript configuration with path mapping
- **Linting/Formatting**: ESLint, Prettier (implied by modern React setup)
- **Replit Integration**: Development mode banner, cartographer plugin

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **API Proxy**: Vite proxy configuration for API routes
- **Environment Variables**: OpenAI API key configuration
- **Replit Integration**: Special handling for Replit development environment

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Assets**: Served by Express in production
- **Database**: PostgreSQL with Drizzle ORM migrations

### Configuration Management
- **Environment Variables**: Database URL, OpenAI API key
- **Build Scripts**: Separate dev/build/start commands
- **Database Management**: Drizzle migration system with `db:push` command

### Performance Considerations
- **Code Splitting**: Vite handles automatic code splitting
- **Asset Optimization**: Tailwind CSS purging, Vite asset optimization
- **Caching**: TanStack Query for client-side caching
- **Bundle Size**: Tree-shaking enabled, minimal dependencies