# PerfectPrompt - AI Prompt Generator

## Overview

PerfectPrompt is a modern web application that serves as a prompt engineering assistant for OpenAI models. The application helps users generate optimized system and user prompts tailored to specific models, task types, and tones. It provides a user-friendly interface for creating professional prompts with contextual guidance and formatting tips.

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

1. **User Input**: Form submission with model, task type, tone selections
2. **Validation**: Client-side validation using Zod schemas
3. **API Request**: POST to `/api/generate-prompt` endpoint
4. **AI Processing**: OpenAI API call with specialized system prompts
5. **Response Processing**: Structured JSON response with prompts and tips
6. **UI Update**: Results display with copy functionality and formatting tips

### Request/Response Structure
```typescript
// Request
{
  model: string,
  taskType: string,
  tone: string,
  customPrompt?: string
}

// Response
{
  systemPrompt: string,
  userPrompt: string,
  formattingTips: string[],
  behavioralNotes: string[]
}
```

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