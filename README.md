# Athen AI

AI consulting platform for healthcare professionals - enabling clinicians to create AI-powered workflows for clinical documentation, patient instructions, and prior authorization through a secure, HIPAA-compliant platform.

## Project Structure

This is a monorepo containing:

- `packages/frontend` - React 18 + TypeScript + Vite frontend application
- `packages/backend` - Node.js + Express + TypeScript backend API

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL 15+ with pgvector extension
- Redis

## Getting Started

### Installation

Install dependencies for all workspaces:

```bash
npm install
```

### Environment Setup

1. Copy environment files:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

2. Update the `.env` files with your configuration

### Development

Run both frontend and backend in development mode:

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

Build all packages:

```bash
npm run build
```

### Testing

Run tests for all packages:

```bash
npm test
```

### Linting and Formatting

```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for server state
- Zustand for client state
- Tailwind CSS for styling
- React Router for navigation

### Backend
- Node.js 20 LTS
- Express.js with TypeScript
- Prisma ORM
- PostgreSQL with pgvector
- Redis for caching
- JWT authentication

## Architecture

The platform follows a three-tier architecture:
1. **Client Layer**: React SPA
2. **API Layer**: Express REST API
3. **Data Layer**: PostgreSQL + Redis

See `.kiro/specs/athen-ai-mvp/design.md` for detailed architecture documentation.

## License

Private - All rights reserved

## Project Overview

athen-ai is an AI consulting and activation platform for clinicians and healthcare teams. Healthcare professionals struggle to integrate AI tools effectively—clinicians spend an average of 30 minutes per week navigating complex AI integrations, and 20% of AI projects fail due to improper setup. athen-ai addresses this by streamlining AI integration with a target of reducing setup time by up to 75%. It focuses on high-impact, practical workflows like clinical note drafting, patient instructions, and prior authorization packet preparation—delivered with HIPAA-aware guardrails, simple EHR-friendly insertion paths (e.g., smart phrases/clipboard), and measurable outcomes (time saved, after-hours reduction, turnaround times).

## Project Docs
- Idea brief: see [`idea-brainstorm.md`](./idea-brainstorm.md)
- Product specification (MVP → roadmap): see [`product-spec.md`](./product-spec.md)

## Branch Preview Workflow (GitHub + Vercel)

1. Every branch and pull request gets its own Vercel Preview deployment
2. Vercel posts a "Preview ready" link on the PR automatically
3. The client clicks the link, reviews the live build, and comments/approves right on the PR

### Setup steps (once)
- Install the Vercel GitHub App and import this repo
- Ensure "Create a Preview Deployment for every push" is enabled
- (Optional) In GitHub → Branch protection, require the Vercel Preview check and Code Owner review

### Author workflow
- Create a feature branch and push
- Open a PR; wait for the Vercel bot to post the Preview link
- Share the PR URL with the client for review

### Client workflow
- Open the PR and click the Preview link under the first comment or in the Deployments box
- Leave comments on the PR or click "Approve" if ready to merge

Project name, repo, and Vercel deployment use the slug `athen-ai`.

See your team's contribution guide for the standardized PR format and code owners for approvals.
