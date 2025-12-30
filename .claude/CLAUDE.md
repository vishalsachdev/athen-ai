# Athen-ai Project Context

## Client & Requirements Process

**Client**: Working with stakeholders to develop requirements (see Issue #2 by @Kilment)

**Requirements Intake Workflow**:
1. Stakeholders use the Athen-ai Requirements Bot ([link](https://uiuc.chat/Athen-ai-requiments-bot)) to explore use cases and quantify problem statements
2. Chat transcript is submitted as a GitHub Issue with "Requirements Intake" label
3. Requirements are reviewed and incorporated into `product-spec.md`
4. Open questions are resolved and documented

**Initial Requirements**: Issue #2 (Oct 31, 2025) established:
- Quantified problem: 30 min/week wasted on AI integrations, 20% failure rate
- Target outcome: 75% reduction in setup time
- MVP features: Plan Creation, Tool Setups, Workflow Activation, File/KB Management
- Key decisions: usage-based billing, Epic EHR first, PHI-on by default, click-to-run actions

## Project Domain

**Healthcare AI Integration Platform**
- Target users: Clinicians (often AI-naive)
- Primary workflows: Clinical notes, patient instructions, prior authorization
- Critical compliance: HIPAA, PHI handling, de-identification, audit logs
- UX priority: Simplicity and minimal navigation (reduce cognitive load for busy clinicians)

## Development Context

**Compliance is Non-Negotiable**:
- Default PHI=on for all features (explicit opt-out only)
- Never log PHI in plain text
- All data handling must respect de-identification workflows
- Audit logs required for all PHI access

**Security Priorities**:
- OAuth flows with minimal scopes
- Encrypted secrets at rest (KMS-backed)
- Provider-agnostic architecture to avoid vendor lock-in
- Cost transparency (show estimated monthly charges after connection)

**UX Principles for Clinicians**:
- Minimize navigation away from the platform (use clear instructions, screenshots)
- Click-to-run actions (not just read-only suggestions)
- ≤2 clicks for common actions (note insertion, plan creation)
- 6th-8th grade reading level for patient-facing content

## Development Standards

**Testing Requirements**:
- All clinical workflows must have acceptance tests
- De-identification pipeline must be tested against PHI test data (synthetic)
- Connection flows must validate scopes and cost estimates

**Documentation Requirements**:
- Update `product-spec.md` when requirements change
- Reference source issue for traceability (e.g., "from Issue #2")
- Update README.md with quantified outcomes when available

## MVP Priorities (from product-spec.md)

1. Planner (LLM-driven plan generation)
2. Catalog (browse AI tools)
3. My Plans (CRUD with privacy controls)
4. Connections (OpenAI + one more provider with streamlined OAuth)
5. File Upload → De-identification → Vectorization
6. Assistant (KB search with citations)
7. Community (browse/import public plans)
8. Auth + Onboarding (HIPAA acknowledgment)

**Phase 2**: Workflow automation, EHR sandboxes (Epic first), org collaboration, usage-based billing

---

## Current Focus

- [ ] Fix chat functionality (backend not deployed to Vercel)

## Roadmap

### Immediate (Before MVP Launch)
- [ ] Fix chat functionality - Backend deployment to Vercel (Critical)
- [ ] Standardize branding - Decide "Athena" vs "Athen AI"
- [ ] Fix tool count display - Dynamic HIPAA count instead of hardcoded "28"

### Short-term (Next Sprint)
- [ ] Add setup guides for 10 missing tools (40% of catalog)
- [ ] Add setup difficulty badges to tool cards
- [ ] Improve chat placeholder text for better user guidance

### Long-term (Future Enhancements)
- [ ] Default HIPAA filter to ON for healthcare context
- [ ] Add React error boundaries for robustness
- [ ] Consider backend database for tool data when scaling beyond 50 tools
- [ ] Accessibility improvements (ARIA live regions)

### Completed
- [x] Initial MVP development
- [x] OpenAI GPT-5.2 integration (PR #8)
- [x] Documentation structure organized (/docs with planning/, specs/, reports/, guides/)
- [x] Clinician UX testing completed with detailed report

## Backlog

- EHR sandbox integrations (Epic first)
- Workflow automation features
- Organization collaboration features
- Usage-based billing system

## Session Log

### 2024-12-30
- Completed: Comprehensive clinician UX testing of deployed app
- Completed: Created detailed testing report (`/docs/reports/2024-12-30-testing-report.md`)
- Completed: Organized documentation into `/docs` structure
- Completed: Fixed CHANGELOG.md year error (2025 -> 2024)
- Completed: Created documentation standards and plan template
- Found: 1 critical issue (chat non-functional), 3 priority issues, 3 nice-to-haves
- Next: Fix chat functionality (backend deployment to Vercel)
