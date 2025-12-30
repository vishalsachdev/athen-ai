# Athen AI

A curated search and discovery platform for healthcare AI tools. Helps small clinics and private practices find the right AI tools for their workflows, with step-by-step setup guides.

**Live Demo:** [athen-ai-orcin.vercel.app](https://athen-ai-orcin.vercel.app/)

## Features

### AI Chat Assistant
- Conversational interface powered by OpenAI
- Describe your workflow challenges and get personalized tool recommendations
- Interactive tool cards rendered inline in chat responses

### AI Toolbox
- Build your ideal clinical workflow by adding tools to different stages
- Workflow stages: Scheduling → Intake → Documentation → Assistance → Billing
- Tools persist across sessions via localStorage
- AI assistant is aware of your toolbox and can help with integration questions

### Setup Guides
- Comprehensive setup guides for 15 healthcare AI tools
- Categories: Scribes, Intake, Chatbots, Scheduling, Billing, Specialty
- Each guide includes: overview, time estimate, prerequisites, step-by-step instructions, pro tips

### Tool Categories
- **Scribes:** Freed AI, Scribeberry, Doximity Scribe
- **Intake:** IntakeQ, Jotform, Infermedica
- **Chatbots:** Kommunicate, BastionGPT
- **Scheduling:** NexHealth, Emitrr
- **Billing:** Medical Coding AI
- **Specialty:** TouchMD, Aesthetix CRM (plastic surgery), Miiskin, FotoFinder (dermatology)

## Project Structure

This is a monorepo containing:

- `packages/frontend` - React 18 + TypeScript + Vite + Tailwind CSS
- `packages/backend` - Node.js + Express + TypeScript (local development)
- `api/` - Vercel serverless function for production chat API

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create `packages/backend/.env` with:

```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-5.2-chat-latest
PORT=3001
```

For Vercel deployment, add these same variables in your Vercel project settings.

### Development

Run both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend (runs on port 3001)
npm run dev -w @athen-ai/backend

# Frontend (runs on port 5173)
npm run dev -w @athen-ai/frontend
```

### Building

```bash
npm run build
```

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- react-markdown + remark-gfm for markdown rendering

### Backend
- Node.js 20 LTS
- Express.js with TypeScript
- OpenAI API (Responses API)
- Server-Sent Events (SSE) for streaming responses

### Deployment
- Vercel (frontend + serverless API)
- GitHub integration with preview deployments

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│  Vercel API      │────▶│  OpenAI API     │
│   (Frontend)    │     │  (Serverless)    │     │  (OpenAI)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│  localStorage   │
│  (Toolbox +     │
│   Chat State)   │
└─────────────────┘
```

## Branch Preview Workflow

1. Every branch and pull request gets its own Vercel Preview deployment
2. Vercel posts a "Preview ready" link on the PR automatically
3. Share the PR URL with stakeholders for review

## Project Docs

- Development log: see [`CHANGELOG.md`](./CHANGELOG.md)
- Idea brief: see [`idea-brainstorm.md`](./idea-brainstorm.md)
- Product specification: see [`product-spec.md`](./product-spec.md)

## License

Private - All rights reserved
