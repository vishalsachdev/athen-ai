# Athen AI - Development Log

A running history of decisions, discussions, and changes made to the project.

---

## December 30, 2024

### Context
Switched AI backend from Anthropic Claude to OpenAI due to expired Anthropic API key. Conducted comprehensive UX testing of deployed application and organized project documentation.

### Changes Made

#### 1. AI Backend Migration
- **Files:** `packages/backend/src/services/openaiAI.ts`, `api/chat.ts`
- Migrated from Anthropic Claude (Azure AI Foundry) to OpenAI GPT-5.2
- Using Vishal's OpenAI API key after Anthropic key expired
- Updated environment variable from `ANTHROPIC_FOUNDRY_API_KEY` to `OPENAI_API_KEY`
- Model changed from `claude-opus-4-5` to `gpt-5.2-chat-latest`
- Maintained SSE streaming functionality

#### 2. Documentation Structure Overhaul
- **Created:** `/docs` directory with organized subdirectories
- **Structure:**
  - `docs/planning/` - Brainstorming and ideation (moved `idea-brainstorm.md` here)
  - `docs/specs/` - Product specifications (moved `product-spec.md` here)
  - `docs/reports/` - Testing reports and analysis
  - `docs/guides/` - Development guides (empty, reserved for future)
- **Added:** `docs/README.md` with documentation standards and naming conventions
- **Added:** `docs/planning/TEMPLATE-plan.md` for future planning documents
- **New requirement:** All plans/reports must include metadata section with:
  - Creation timestamp
  - Last commit reference
  - How the plan was generated
- **Added:** `TRASH-FILES.md` to track moved/deleted files
- **Added:** `TRASH/` directory to `.gitignore`

#### 3. Comprehensive UX Testing
- **Created:** `docs/reports/2024-12-30-testing-report.md`
- Tested deployed app at https://athen-ai-orcin.vercel.app/ as clinician user
- Testing included:
  - Chat interface functionality
  - HIPAA compliance filter
  - Category navigation
  - Tool guide pages
  - Responsive design (375px mobile, 1400px desktop)
  - Console error monitoring
- **Issues found:**
  - **Critical:** Chat interface non-functional (backend not deployed to Vercel)
  - **Priority:** Branding inconsistency ("Athena" vs "Athen AI")
  - **Priority:** Tool count hardcoded as "28" instead of dynamic calculation (should be 14)
  - **Priority:** 10 out of 25 tools missing setup guides
  - **Nice-to-have:** 3 UX improvements identified

#### 4. Roadmap Infrastructure
- **Added to `.claude/CLAUDE.md`:**
  - `## Current Focus` - Fix chat functionality (backend deployment)
  - `## Roadmap` - Prioritized list of immediate, short-term, and long-term tasks
  - `## Backlog` - Phase 2 features (EHR integration, workflows, billing)
  - `## Session Log` - Track work completed each session

### Decisions Made
- **API Provider:** Switched to OpenAI due to Anthropic key expiration (temporary solution)
- **Documentation Location:** Root files (`idea-brainstorm.md`, `product-spec.md`) moved to `/docs` for better organization
- **Metadata Requirement:** All future plans must document creation context and commit state
- **CHANGELOG Year Fix:** Corrected "Nov 24, 2025" → "Nov 24, 2024" (was future-dated by mistake)

### Next Session Priorities
1. **Fix chat backend deployment** - Core feature currently broken on production
2. **Branding decision** - Standardize on "Athena" or "Athen AI" across all surfaces
3. **Dynamic tool counting** - Replace hardcoded "28 HIPAA compliant" with calculated value

---

## December 26, 2024

### Context
Met with client (Orr) to confirm MVP direction. Original Athena repo was too complex - agreed to start simple with the `athen-ai` repo and build up.

### MVP Direction Confirmed
- **What we're building:** A curated search/discovery platform for healthcare AI tools
- **Target users:** Small clinics, private practices (plastic surgery, dermatology, orthopedics)
- **Core value:** Help physicians find the right AI tools + provide step-by-step setup guides
- **Later phases:** Add HIPAA-compliant data middleman layer, cross-practice data sharing, workflow marketplace

### Changes Made

#### 1. Created Real Tools Database
- **File:** `src/data/tools.ts`
- Added 15 curated healthcare AI tools across 6 categories:
  - Scribes: Freed AI, Scribeberry, Doximity Scribe
  - Intake: IntakeQ, Jotform, Infermedica
  - Chatbots: Kommunicate, BastionGPT
  - Scheduling: NexHealth, Emitrr
  - Billing: Medical Coding AI
  - Specialty: TouchMD, Aesthetix CRM (plastic surgery), Miiskin, FotoFinder (dermatology)
- Each tool includes: name, category, description, website, HIPAA status, pricing, key features, search keywords

#### 2. Replaced Mock Search with Real Data
- **File:** `src/components/SolutionSearch.tsx`
- Removed fake "OCR-Scanner-Pro" type responses
- Now searches actual tool database
- Added category filter sidebar
- Added HIPAA-only filter toggle
- Shows tool cards with real info

#### 3. Added Tool Card Component
- **File:** `src/components/ToolCard.tsx`
- Displays: tool name, category badge, HIPAA badge, description, key features, pricing
- Links to tool guide page

#### 4. Added Routing
- **Files:** `src/main.tsx`, `src/App.tsx`
- Added React Router (already installed)
- Routes: `/` (search), `/tools/:toolId` (guide page)

#### 5. Created Tool Guide Pages
- **File:** `src/pages/ToolGuide.tsx`
- Shows tool details + setup guide (if available)
- Falls back to "Coming Soon" placeholder for tools without guides

#### 6. Wrote 3 Setup Guides
- **File:** `src/data/guides.ts`
- Doximity Scribe (6 steps, 5-10 min setup) - FREE tool
- Freed AI (6 steps, 10-15 min setup) - Most popular scribe
- IntakeQ (7 steps, 30-45 min setup) - Patient intake forms
- Each guide includes: overview, prerequisites, step-by-step instructions, tips

### Decisions Made
- **Tool links:** Go to internal guide pages (not external websites directly) - allows us to add value with setup instructions
- **No markdown in guides:** Removed `**bold**` syntax since React doesn't render it - using plain text instead
- **No backend needed yet:** All data is static in TypeScript files for MVP

#### 7. Added Guided Search Wizard
- **Problem:** Users who don't know exactly what tool they need can't effectively use keyword search
- **Solution:** "Help me find the right tool" wizard - a 3-step modal that asks about pain points, specialty, and preferences
- **Files:**
  - `src/components/GuidedSearch.tsx` - Modal wizard component with 4 steps (pain point, specialty, preferences, results)
  - `src/data/tools.ts` - Added new fields to support filtering:
    - `painPoints[]` - what problems the tool solves (documentation, patient-questions, scheduling, intake, billing)
    - `setupDifficulty` - easy/medium/hard
    - `setupTime` - estimated setup time
    - `pricingTier` - free/low/medium/enterprise
    - `specialties[]` - which specialties the tool is best for
  - `src/components/SolutionSearch.tsx` - Added wizard trigger button
- **How it works:**
  1. User clicks "Not sure what you need? Let us help you find the right tool"
  2. Step 1: Select biggest pain point (documentation, patient questions, scheduling, intake, billing)
  3. Step 2: Select specialty (plastic surgery, dermatology, orthopedics, general)
  4. Step 3: Set preferences (budget, easy setup only)
  5. Results: Shows top 3 recommended tools with "why it fits" explanation
- **UX:** Modal with backdrop blur, progress indicator, back navigation, smooth transitions

#### 8. Replaced Search + Wizard with Conversational Chat Interface
- **Problem:** Having both keyword search AND a wizard felt redundant. Users wanted a more natural way to describe their problems.
- **Solution:** Conversational AI chat interface powered by Claude via Microsoft Foundry
- **Architecture:**
  - Frontend: Custom chat UI with Tailwind (streaming support, message bubbles)
  - Backend: Express API endpoint that streams responses via SSE
  - LLM: Claude Opus 4.5 via Microsoft Azure AI Foundry with custom system prompt
- **Backend files created:**
  - `packages/backend/src/services/claudeAI.ts` - Anthropic SDK client with Foundry config + streaming
  - `packages/backend/src/data/tools.ts` - Tools database for system prompt
  - `packages/backend/src/data/systemPrompt.ts` - AI personality and instructions
  - `packages/backend/src/routes/chat.ts` - POST /api/v1/chat endpoint (SSE streaming)
- **Frontend files:**
  - `packages/frontend/src/components/ChatInterface.tsx` - Chat UI with streaming
  - `packages/frontend/src/components/SolutionSearch.tsx` - Updated to show chat + Browse All Tools (always visible)
  - Deleted `GuidedSearch.tsx` (replaced by chat)
- **Layout:** Chat at top, "Browse All Tools" section always visible below (no dropdown toggle)
- **Environment variables needed:**
  ```
  ANTHROPIC_FOUNDRY_API_KEY=your-foundry-api-key
  ANTHROPIC_FOUNDRY_RESOURCE=vishal-sachdev-claude-resource
  ANTHROPIC_MODEL=claude-opus-4-5
  ```
- **Header:** Changed from "Athen AI" to "Athena"

#### 9. UI Refinements
- **Chat window height:** Increased from `h-[500px]` to `h-[600px]` for more conversation space
- **Header spacing:** Reduced top padding from `py-12` to `pt-4 pb-12` in `App.tsx` to minimize dead space
- **SolutionSearch header:** Reduced spacing (`space-y-1`, `text-2xl`, `text-sm`) and container padding (`px-6 pt-3 pb-6`)
- **Auto-scroll fix:** Chat was auto-scrolling on page load even with no messages. Fixed by adding condition `if (messages.length > 0)` before scroll in `ChatInterface.tsx`

#### 10. Local Network Access Configuration
- **Purpose:** Allow testing from other devices on the same WiFi network
- **Frontend (vite.config.ts):** Added `host: '0.0.0.0'` to dev server config
- **Backend (index.ts):**
  - Added `'http://192.168.68.67:5173'` to CORS origins
  - Changed `app.listen()` to bind to `'0.0.0.0'` instead of localhost
  - Fixed TypeScript error by using `Number(process.env.PORT)` for port casting

#### 11. GitHub Push and Vercel Deployment
- **Branch:** `ui` branch for frontend changes
- **GitHub auth fix:** Used `gh auth setup-git` to resolve credential issues after being added as collaborator
- **Vercel build error:** Initial "No Output Directory named 'public'" error
  - **Fix:** Changed `vercel.json` buildCommand from `npm run build --workspace=@athen-ai/frontend` to `cd packages/frontend && npm run build`
- **Frontend deployed successfully** to Vercel from GitHub auto-deployment

#### 12. Vercel Serverless Function for Chat API
- **Problem:** Vercel only deploys static frontend; backend Express server doesn't run on Vercel
- **Solution:** Convert chat endpoint to a Vercel serverless function
- **Files created:**
  - `api/chat.ts` - Serverless function with:
    - Full tools database embedded
    - System prompt for Claude
    - SSE streaming response
    - CORS headers
    - Input validation
  - Updated `vercel.json` with `functions` config and `rewrites` for API routing
  - Added `@anthropic-ai/foundry-sdk` and `@vercel/node` to root `package.json`
- **Frontend update:** Changed API endpoint from `/api/v1/chat` to `/api/chat`
- **Vite proxy update:** Added rewrite rule to map `/api/chat` to `/api/v1/chat` for local development
- **Environment variables for Vercel:**
  ```
  ANTHROPIC_FOUNDRY_API_KEY=your-api-key
  ANTHROPIC_FOUNDRY_RESOURCE=vishal-sachdev-claude-resource
  ANTHROPIC_MODEL=claude-opus-4-5
  ```
- **Conversation continuity:** Works for multi-turn conversations because full message history is sent with each request (stored in frontend state)

---

## December 29, 2024

### AI Toolbox Feature & Setup Guides Expansion

#### 1. Added AI Toolbox / Workflow Builder
- **Concept:** Users can build their ideal clinical workflow by adding tools to different stages
- **Workflow stages:** Scheduling → Intake → Documentation → Assistance → Billing
- **Files:**
  - `packages/frontend/src/context/WorkflowContext.tsx` - State management with localStorage persistence
  - `packages/frontend/src/components/WorkflowPanel.tsx` - Slide-out panel showing workflow stages
  - `packages/frontend/src/components/WorkflowStage.tsx` - Individual stage component
  - `packages/frontend/src/components/ChatToolCard.tsx` - Tool cards rendered inline in chat messages
- **Features:**
  - Tools auto-map to appropriate workflow stages based on category
  - Persists across page refreshes via localStorage
  - Floating "AI Toolbox" button shows count of tools added
  - "Add to Toolbox" button on tool cards (in chat and tool guide pages)

#### 2. Chat Context Persistence
- **File:** `packages/frontend/src/context/ChatContext.tsx`
- Chat messages now persist when navigating between pages
- Uses React Context to maintain conversation state

#### 3. Toolbox Context for AI Assistant
- When user has tools in their toolbox, the full setup guides are sent to the AI
- AI can now provide contextual help with integration, setup questions, and workflow optimization
- **Files updated:**
  - `packages/backend/src/data/systemPrompt.ts` - Generates toolbox context section
  - `packages/backend/src/services/claudeAI.ts` - Passes toolbox to system prompt
  - `packages/backend/src/routes/chat.ts` - Accepts toolbox in request body
  - `api/chat.ts` - Serverless function updated with same logic

#### 4. Expanded Setup Guides (3 → 15 tools)
- Previously only had guides for: Doximity Scribe, Freed AI, IntakeQ
- **Now have comprehensive setup guides for all 15 tools:**
  - Scribes: Freed AI, Scribeberry, Doximity Scribe
  - Intake: IntakeQ, Jotform, Infermedica
  - Chatbots: Kommunicate, BastionGPT
  - Scheduling: NexHealth, Emitrr
  - Billing: Medical Coding AI
  - Specialty: TouchMD, Aesthetix CRM, Miiskin, FotoFinder
- Each guide includes: overview, time estimate, prerequisites, step-by-step instructions, pro tips

#### 5. Chat UI Improvements
- **Markdown rendering:** Added `react-markdown` with `remark-gfm` plugin for proper formatting
- **Custom renderers for:** headers, lists, paragraphs, links, tables, horizontal rules, bold text
- **Tool cards in chat:** AI can recommend tools using `[[TOOL:tool-id]]` syntax, renders interactive cards
- **Spacing improvements:** Better vertical breathing room between elements
- **Response limit increased:** `max_tokens` bumped from 1500 to 4096 for longer responses

#### 6. System Prompt Improvements
- Added formatting rules for consistent output
- Instructions for numbered lists, tables, spacing
- Toolbox context injection when user has tools selected

---

## Reference: Meeting Notes (Nov 24, 2024)

From initial strategy call with Anjali:
- Focus on subspecialties: plastic surgery, dermatology, orthopedic surgery
- Common workflow requests: AI intake forms, custom chatbots, smart scheduling
- Long-term vision: Data sharing between practices, template marketplace
- MVP approach: Start with search + guides only, no data processing/BAAs initially
