## athen-ai Product Specification (MVP and Beyond)

## What is athen-ai? - Athen-ai functions as an AI consulting platform specifically tailored for healthcare professionals, aiming to guide AI naive healthcare professionals in effective AI integration in medicine.

### Purpose
This document outlines the product specification for athen-ai, including the MVP and beyond.

### User Roles and Permissions
- **Clinician/User**: Create plans and workflows, link tools, upload files, use assistant, manage privacy.
- **Org Admin**: Manage members, billing, org-level connections and permissions.
- **Collaborator**: View/edit shared items with scoped permissions.
- **Platform Admin**: Moderate community, manage feature flags, audits, and support.

### Core User Journeys
- **Onboarding (Welcome Wizard)**: Create account → verify email → enter legal/role/specialty → HIPAA acknowledgment → optional org join → suggested tools → first plan.
- **Plan Creation (Planner)**: Answer wizard questions → LLM generates structured plan → edit/reorder steps → save → initiate tool setups.
- **Tool Connection (Connections)**: Pick provider → OAuth/API key flow (minimize navigation away from app with easy-to-follow links, screenshots, minimal time outside) → store secret securely → show tier/limits and estimated monthly charges → test connection.
- **Workflow Activation (Workflows)**: Choose plan → parameterize → connect data sources → dry-run → activate → monitor runs.
- **Community Share/Import**: Publish with tags/privacy → others browse/like/rate → import copy to My Plans.
- **File/KB Management**: Upload docs → de-identify (review) → chunk/embed → private vector store → use in assistant/workflows.

### Feature Specs and Acceptance Criteria

#### Dashboard
- **Must show**: plans created, active workflows, estimated time saved, trending tools, success stories.
- **Filters**: timeframe; org vs personal.
- **Acceptance**: Metrics derive from server events; cards deep-link to details.

#### Planner (LLM-driven)
- **Question flow**: goal, specialty, PHI usage, budget, compliance (HIPAA/FDA), team size, urgency, integrations.
- **Output**: step-by-step plan with costs/time, recommended tools, action links, risks, prerequisites.
- **Editing**: inline edit, reorder, add/remove steps.
- **Save**: versioned plans in `My Plans`.
- **Acceptance**: Given the same answers, plan is reproducible; edit history retained.

#### Catalog
- **Browse/search/filter**: pricing, HIPAA/FDA tags, setup complexity, categories, vendor.
- **Detail**: description, pricing, compliance tags, auth type, scopes, rate limits, community ratings, setup guide.
- **Pre-populate planner** from selected tools.
- **Acceptance**: Filters combine with AND logic; adding tools pre-fills planner constraints.

#### My Plans & Workflows
- **Plans**: CRUD, privacy toggles, export/import, versioning.
- **Workflows**: status (active/paused/planned), last run, next steps, logs, ownership, collaborators.
- **Acceptance**: Privacy enforced in listings and access; collaborators see only shared items.

#### Community
- **Feed**: public plans/workflows with likes/ratings, tags, search.
- **Detail**: import/copy with attribution; comments optional post-MVP.
- **Moderation**: report content → admin review.
- **Acceptance**: Import creates a private copy with original attribution retained.

#### Collaboration
- **Share**: invite by email; role (view/edit); item or folder-level sharing.
- **Org**: add members, assign roles.
- **Acceptance**: Server-side authorization enforced on all reads/writes.

#### Connections
- **Providers (MVP)**: OpenAI, Google (Gemini), Anthropic; stretch: Azure OpenAI, Zapier, Drive, S3; EHR sandboxes (Epic/Cerner) post-MVP.
- **Auth**: OAuth where possible; secure API key vault otherwise.
- **Secrets**: encrypted at rest; scoped per user/org; rotation supported.
- **Acceptance**: "Test connection" validates minimal scope and lists available features/limits and estimated monthly charges based on user's tier/usage pattern.

#### File Management and Vectorization
- **Upload**: local drag-drop; import from Drive/S3 (post-MVP for import).
- **De-identification**: PHI redaction pipeline with operator review and preview.
- **Chunking/embeddings**: configurable chunk/overlap; metadata; HIPAA storage.
- **Usage**: assistant and workflows can query KBs with filters.
- **Acceptance**: Redaction preview shows before/after; embeddings link to original doc and version.

#### Side Panel Assistant
- **Context-aware**: active page, user/org profile, connected tools, selected KBs.
- **Actions**: Q&A, suggest next steps, generate plan steps, run simulated test automations.
- **Citations**: link to KB sources.
- **Acceptance**: PII never leaves HIPAA boundary; logs/audit captured.

#### Authentication and Onboarding
- **Auth**: email/password; optional Google SSO; email verification; optional 2FA (post-MVP).
- **Welcome wizard**: legal name, role, specialty, HIPAA acknowledgment, org association.
- **Acceptance**: Incomplete onboarding gates access to plan creation.

### Non-functional and Compliance
- **HIPAA**: encryption in transit/at rest, access controls, audit logs, least-privilege, BAAs, PHI flow mapping, retention policies.
- **Security**: scoped API keys, secret vault, rate limiting, anomaly detection, IP allowlists (admin).
- **Privacy**: privacy-by-default for plans; explicit consent for sharing.
- **Reliability**: 99.9% target; idempotent APIs; retriable background jobs.
- **Observability**: app logs, audit logs, metrics (plans created, activation rate), traces.

### Safety & Compliance Baseline (MVP)
- **HIPAA boundary**: No PHI leaves approved vendors; BAAs in place for model and hosting providers; support org-managed keys and BYO keys.
- **Data handling**: PHI flag required on uploads; dual de-identification (automated + human preview) before any sharing/community publishing; provenance ledger records data source, model/provider/version, approver, and redaction status.
- **Access controls**: Role-scoped access; least-privilege by default; full audit trail of reads/writes; optional IP allowlisting and device posture for orgs.
- **Attestation & risk tiers**: Classify features by clinical risk (low/medium/high); require clinician attestation before inserting AI-generated clinical content; stricter review/controls for higher tiers.
- **Retention & incidents**: Default retention windows; export/erasure workflows; breach notification process documented and tested.

### MVP Scope (4–6 weeks development only)

**UPDATED based on Issue #2 client feedback:**

**IN SCOPE (MVP):**
- Auth + onboarding (email/password, optional Google SSO if timeline allows, email verification, specialty selection, HIPAA acknowledgment)
- Dashboard (basic metrics only)
- Planner wizard (7-10 questions → LLM-generated structured plan → edit/reorder → save)
- My Plans (CRUD, privacy toggles, versioning with manual save)
- Workflow activation (plan → workflow conversion, parameterization, dry-run with simulated outputs + cost estimates)
- Workflow execution framework (user confirms steps, platform executes - see TBD for automation level)
- Connections (OpenAI only for MVP; Google if time allows)
- File Upload (drag-drop) → PHI flag → automated redaction → review preview → approve → vectorize → **delete original** (NO PHI STORAGE)
- Vector search (defaults to user's files only)
- Assistant (MVP = support bot for platform questions only, session-only conversations)
- Credit system + billing (Stripe integration, 1 credit = $0.01, auto-charge overages, show estimates before workflow runs)
- Audit logs (admin-readable, kept forever)
- HIPAA-compliant temp storage during vectorization only

**CUT FROM MVP (deferred to post-MVP):**
- Community (browse/import/ratings)
- Dashboard advanced metrics
- Multiple provider connections (keeping just OpenAI, maybe Google)
- Context-aware assistant (MVP is support bot only)
- Org-level features (org admin, org billing - personal accounts only for MVP)
- EHR integrations (using clipboard/copy-paste for MVP)
- Folder-level plan organization
- 2FA
- IP allowlisting

**Target Users**: 10-20 clinicians for limited beta, surgical subspecialties focus (plastic surgery, orthopedic, general surgery, neurosurgery, ENT)

### Clinician MVP Acceptance Criteria
- **Note drafting**: Specialty templates (SOAP/H&P); tone and language controls; ≤2 clicks to insert via smart phrase/side panel; diffs tracked; citations included when external sources used; clinician attestation required before saving; edits and overrides logged.
- **Patient instructions**: Output at 6th–8th grade reading level; multilingual support; contraindication warnings surfaced; explicit clinician review required.
- **Prior authorization packet**: Checklist-driven data capture; attachment/packet builder; exportable packet (PDF); track turnaround time, approvals, appeals, and denials avoided.
- **Uploads & de-identification**: PHI flag mandatory; de-ID preview must be approved by clinician before sharing; provenance ledger updated on approval; storage remains within HIPAA boundary.
- **Connections**: OAuth/BYO keys with streamlined UX (minimal navigation away, clear instructions with screenshots); scopes disclosed and logged; successful "Test connection" flow required showing tier/limits and estimated monthly charges; no payment information stored by the platform.
- **EHR integration path**: Phase 0 clipboard/smart phrases; Phase 1 limited FHIR read (demographics/meds/problems) with audit entries for each access.

### High-level Data Model (illustrative)
```typescript
// Users and orgs
type User = {
  id: string;
  email: string;
  name: string;
  role: 'clinician' | 'collaborator' | 'org_admin' | 'platform_admin';
  orgId?: string;
  onboardingCompletedAt?: string;
};

type Org = {
  id: string;
  name: string;
  billingTier: 'free' | 'pro' | 'enterprise';
};

// Plans/workflows
type Plan = {
  id: string;
  ownerUserId: string;
  orgId?: string;
  title: string;
  summary: string;
  steps: Array<{ id: string; title: string; description: string; toolId?: string; actionUrl?: string }>;
  privacy: 'private' | 'org' | 'public';
  version: number;
  sourceAttribution?: { originalPlanId?: string; authorName?: string };
};

type Workflow = {
  id: string;
  planId: string;
  status: 'active' | 'paused' | 'planned';
  lastRunAt?: string;
  config: Record<string, unknown>;
};

// Catalog and connections
type Tool = {
  id: string;
  name: string;
  category: string;
  pricing: string;
  complianceTags: string[]; // ['HIPAA', 'FDA'] etc
  setupComplexity: 'low' | 'medium' | 'high';
  authType: 'oauth' | 'api_key' | 'custom';
};

type Connection = {
  id: string;
  ownerUserId: string;
  orgId?: string;
  provider: 'openai' | 'anthropic' | 'google' | 'zapier' | 'epic' | 'cerner' | 'drive' | 's3';
  scope: string[];
  status: 'valid' | 'revoked' | 'expired';
  lastValidatedAt?: string;
  secretRef: string; // reference to encrypted secret
};

// Files and embeddings
type FileObject = {
  id: string;
  ownerUserId: string;
  orgId?: string;
  filename: string;
  storageUrl: string;
  contentType: string;
  isPHI: boolean;
  redactionStatus: 'pending' | 'complete' | 'skipped';
  checksum: string;
};

type EmbeddingChunk = {
  id: string;
  fileId: string;
  chunkIndex: number;
  text: string;
  vector: number[];
  metadata: Record<string, string>; // section, page, redaction flags
};

// Social
type CommunityItem = {
  id: string;
  kind: 'plan' | 'workflow';
  itemId: string;
  publishedByUserId: string;
  tags: string[];
  likes: number;
  ratingAvg?: number;
};

// Audit
type AuditLog = {
  id: string;
  actorUserId: string;
  orgId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  occurredAt: string;
  ip: string;
  metadata?: Record<string, unknown>;
};
```

### API Surface (MVP)
- **Auth**: POST `/auth/register`, POST `/auth/login`, POST `/auth/logout`, POST `/auth/verify-email`
- **Users/Org**: GET `/me`, PATCH `/me`, GET `/org`, POST `/org/invite`, PATCH `/org/members/:id`
- **Plans**: GET `/plans`, POST `/plans`, GET `/plans/:id`, PATCH `/plans/:id`, POST `/plans/:id/publish`, POST `/plans/:id/import`
- **Workflows**: GET `/workflows`, POST `/workflows`, PATCH `/workflows/:id`, POST `/workflows/:id/run`, GET `/workflows/:id/logs`
- **Catalog**: GET `/tools`, GET `/tools/:id`
- **Connections**: GET `/connections`, POST `/connections`, POST `/connections/:id/test`, DELETE `/connections/:id`
- **Files/KB**: POST `/files`, GET `/files`, GET `/files/:id`, POST `/files/:id/vectorize`, GET `/kb/search`
- **Assistant**: POST `/assistant/query`
- **Community**: GET `/community`, GET `/community/:id`, POST `/community/:id/like`, POST `/community/:id/rate`
- **Audit**: GET `/audit` (admin only)

### Integrations and Storage
- **LLM abstraction**: provider-agnostic service (OpenAI, Anthropic, Google) with policy guardrails.
- **Storage**: Postgres (plans/workflows/users), S3-compatible (files), pgvector or managed vector DB, KMS for secrets.
- **Secrets**: envelope encryption, rotation, HSM-backed KMS (AWS KMS, GCP KMS).
- **De-identification**: rules-based + model-assisted redaction with operator review.

### UX Flows to Wireframe First
- Planner wizard (5–7 steps; progress; back/next; autosave)
- Tool connection modal (OAuth/API key entry; test; capabilities summary)
- KB upload → redaction preview → approve → vectorize
- Community detail → import (show deltas and required connections)
- Assistant panel (context chips: page, KBs, tools; citations)

### Analytics and KPIs
- **Clinical productivity**: time to close chart; after-hours charting minutes (baseline vs post); note insertions per session.
- **Quality of outputs**: edit/override rate on AI-inserted text; citation usage; plan completion rating; community import rate.
- **Prior authorization**: time to submit; approval rate; appeal rate; denials avoided.
- **Activation**: onboarding completion; time-to-first-plan (TTFP); time-to-first-connection (TTFC); preview-to-merge ratio.
- **Engagement**: weekly active planners; workflow activations; assistant queries.
- **Safety**: PHI leakage incidents (target 0); failed de-ID audits; anomalous access events.

### Risks and Mitigations
- **PHI handling risk**: strict redaction review + audit logs; default PHI=on.
- **Vendor lock-in**: provider-agnostic LLM and vector interfaces.
- **OAuth scope creep**: minimal scopes, explicit display, per-feature gating.
- **User overwhelm**: opinionated templates and quick-start plans per specialty.

### Phased Roadmap
- **MVP**: Planner, Catalog, My Plans, OpenAI + one more provider, KB upload + redaction + embeddings, Assistant search, Community browse/import, basic dashboard, auth + onboarding, audit logs.
- **Phase 2**: Workflow activation & logs, org collaboration, more providers (EHR sandboxes), ratings/comments, 2FA/SSO, usage-based billing.
- **Phase 3**: Automation runners, marketplace of workflow steps, advanced compliance tooling (DLP policies), enterprise org controls.

### Open Questions (RESOLVED - See Issue #2)

#### Resolved Answers (from client feedback Nov 7, 2025)

**Billing model**: Usage-based credits model. Personal plans only for MVP (org plans post-MVP).
- 1 credit = $0.01 USD
- Credits consumed by: LLM calls, file uploads/vectorization, workflow executions
- Auto-charge for overages
- Show estimated cost before running workflows
- Monthly tiers TBD (pending usage validation)

**Public exposure**: Can index public plans externally to preview product and platform.

**PHI defaults**: Yes, allow non-PHI mode with lighter flows. Default PHI=on until explicitly specified by user. Warning that by noting no PHI, liability shifts to user to not use any data/docs containing PHI.

**EHR scope**: Epic sandbox first (majority market share, easier API). Also need to look for private EMRs used by smaller practices with easy-to-connect APIs. Post-MVP for MVP scope.

**Assistant autonomy**: Click-to-run actions in MVP (support bot explaining platform usage initially, context-aware post-MVP).

---

## Detailed Requirements Clarification (from Issue #2 Client Responses)

### MVP Scope & Timeline

**Timeline**: 4-6 weeks development only (design mostly complete, QA after first deployment)

**MVP Success Criteria**: Internal testing only - need working demo in internal hands first, then move to limited beta ASAP (10-20 clinicians).

**Features CUT from MVP**:
- Community (browse/import) - defer to post-MVP
- Dashboard metrics - keep basic only
- Multiple provider connections - just OpenAI for MVP, can add Google if time allows

**Platform LLM Backend**: OpenAI for Planner wizard and Assistant (can refine and build own model with open-source Mistral later).

**Second Provider (if time allows)**: Google (for easier connections to Google products/linking).

### Plans & Workflows Architecture

**Planner Branching Logic**: Always ask HIPAA/FDA compliance questions regardless of PHI usage answer.

**Plan Output Format**: Executable workflow definitions ready to activate (click-and-play model).

**Plans vs. Workflows Relationship**:
- **Plan** = Blueprint generated by LLM; can be edited, saved, reused
- **Workflow** = Activated instance of a Plan; allows users to execute via simplified one-click steps
- One Plan can have multiple active Workflows
- Plan becomes Workflow when user approves the plan and clicks "activate"
- Example: "Patient Intake Plan" (template) → "My Plastic Surgery Intake Form" (active workflow instance)

**Workflow Dry-run**: Shows simulated outputs with fake data + cost estimates.

**Plan Editing**: Track edit history with diffs; allow regenerating just one step.

**Workflow Monitoring**: Detailed step-by-step execution traces so users can see all complex steps the platform is simplifying.

**Workflow Parameters** (user must provide): Vary by task. Example for patient intake form:
- Choose AI model
- Choose form design
- Choose form fields
- Link EMR
- Choose additional post-form submission agents as needed

**Workflow Execution Model**: User clicks buttons to confirm steps as they go, platform executes. (Note: Full automation vs guided manual setup to be determined - see PM concerns)

### Clinician MVP Features

**Note Drafting - EHR Integration**: Start with copy/paste via clipboard (clipboard). If actual EHR integration can be achieved in Phase 1, that would be great.

**Note Drafting - Input**: Link patient record.

**Note Drafting - Specialty Focus**: Surgical subspecialties - plastic surgery, orthopedic surgery, general surgery, neurosurgery, ENT.

**Note Templates**: SOAP/H&P templates for surgical subspecialties listed above.

**Citations Format**: Footnotes with URLs and direct links to sources.

**Attestation UI**: Signature capture + approve button with logged timestamp.

**Prior Authorization - Data Capture**: Imported from uploaded files.

**Prior Auth - Packet Format**: Standard format per insurance company - should include all necessary documentation.

**Patient Instructions - Languages**: English and Spanish for MVP.

**Smart Phrases - Storage**: Stored in EHR, athen-ai just generates text (for now - post-MVP will link and store in EHR).

### File Management & De-Identification

**CRITICAL ARCHITECTURE: NO PHI STORAGE**
- **PHI-containing data will be immediately vectorized and de-identified, then deleted**
- No users have access to original PHI after de-identification and vector store creation
- Separate encrypted and HIPAA-compliant database for temp file storage during processing only
- All data retained indefinitely by default (vectors only), users can delete as needed
- **No PHI will be stored** - eliminates most HIPAA compliance complexity

**PHI Detection Scope**: Just HIPAA 18 identifiers (names, dates, IDs, etc.) need redaction.

**Review Process**: Uploading clinician reviews - only for PHI-flagged files.

**Redaction Non-Approval**: Re-run redaction with different settings; if unable to approve, delete file.

**File Formats**: PDF, Word, Excel, JPG, PNG, HL7/FHIR messages.

**Chunking Strategy**: Platform-set (to be determined with development team). [PM Note: Proposed 512 tokens/chunk, 50 token overlap]

**Vector Store Search Scope**: Defaults to only searching current user's files. Can enable public search or org search as separate options.

**File Metadata**: Capture all metadata except PHI - **no patient identifiers should ever be captured**. Replace all patient identifiers with randomly generated in-house identifiers (cryptographically random, unlinkable, but consistent within user's vector store).

### Connections & Integrations

**OAuth UX Approach**: Either pop-up windows for OAuth with instructions in main window OR inline iframe embedding where possible. If neither possible, then step-by-step guide with external links but clear return instructions.

**API Key vs OAuth**: Prefer OAuth; use API keys where OAuth is not possible.

**Connection Test Validation**: All of the above - authentication, minimal API call, check rate limits and quota.

**Cost Estimation Method**: User enters expected usage, show pricing tiers from provider (highlighting most applicable tier).

**Connection Ownership**: Both personal and org-level - user chooses if they are part of org. Default to personal; can choose active connection in connections tab or in workflow manager when setting up new workflow.

**Epic EHR**: Post-MVP (not in initial MVP scope).

**BYO Keys**: Some can be platform-managed where needed (not all providers require BYO).

**Scope Disclosure**: Both during connection setup and in connection details view (more detail after initial setup).

**Secret Rotation**: Automated reminders when tokens expire.

**Multiple Connections**: Yes - user can have multiple connections to same provider (e.g., personal + org OpenAI key).

### Billing & Credits

**Credit Consumption**: All of the above - LLM API calls, file uploads/vectorization, workflow executions (defer to engineering for optimization).

**Credit Pricing**: 1 credit = $0.01 (will need further optimization).

**Monthly Plan Tiers**: To be determined (see PM response for proposals).

**Overage Handling**: Auto-charge for overages.

**Workflow Credit Charges**: Show estimated cost before running.

**Payment Processing**: Use payment processor such as Stripe (they store payment info, platform doesn't).

**Credit Visibility**: Dashboard and in user settings.

**Usage Analytics**: Per action type and per plan/workflow.

**Free Tier Limits**: Limited credits + no community access.

### Authentication & Onboarding

**HIPAA Acknowledgment Text**: To be drafted and reviewed later.

**Email Verification Timing**: Users can start immediately, but cannot execute workflow until email is verified.

**Specialty List**: Standard ABMS list.

**Role Self-Selection**: Clinician vs org admin for MVP - will define more roles later.

**Org Discovery**: Org invite codes or link - no public orgs for MVP.

**Google SSO**: For MVP if possible within timeline.

**Suggested Tools Logic**: Based on planner goals - pick the best tool for the specified need.

### Security & Compliance

**BAA Launch Blockers**: All of the above - all LLM providers (OpenAI, Anthropic, Google if included), hosting provider (AWS/GCP/Azure), vector DB provider.

**PHI Storage Location**: **NO PHI WILL BE STORED** (see File Management section above).

**Encryption Key Management**: Platform-managed for MVP (AWS KMS, GCP KMS).

**Audit Log Retention**: Logs kept forever.

**IP Allowlisting**: Post-MVP (not MVP feature).

**Anomaly Detection**: Anomalous location, high-volume downloads, attempting to share data outside of org, outside usual patterns.

**Clinical Risk Tiers**: Will use a framework - to be determined. [PM Note: Proposed FDA SaMD risk framework]

**Breach Notification**: No PHI will be stored (vectors are de-identified).

**Data Retention Windows**: All data retained indefinitely by default. Users can delete or clear history as needed.

### Community & Collaboration (mostly post-MVP)

**Publishing Approval**: Automated PHI check first, then publish.

**Rating System**: Thumbs up/down (like Reddit).

**Attribution Display**: In plan metadata only.

**Collaboration Invites**: Can send email invites; recipient creates account, then gets access.

**Folder-Level Sharing**: Not MVP feature. Post-MVP: organize plans into folders, can share whole folders (e.g., all patient onboarding tools in one folder).

### Assistant

**Assistant LLM**: Platform-managed (same as planner) - OpenAI.

**Context-Aware "Active Page"**: Not MVP feature. MVP = general platform Q&A (support wizard to explain how platform works). Post-MVP = page-specific context awareness.

**Assistant Actions - Scope**: For MVP, just general platform questions and answers (support wizard). Context-aware features post-MVP.

**Conversation History**: Session-only for MVP. Post-MVP when context-aware, will save indefinitely with user delete option.

### Data Model & Technical

**Plan Versioning**: Manual "save new version" button; unlimited versions per user.

**Workflow Status Transitions**:
- Planned → Active: When user completes all necessary workflow steps and it is working
- Active → Paused: User pauses (e.g., out of office, wants to stop charges)
- Paused → Active: Possible (e.g., return from vacation, resume deployment)

---

## Remaining TBD Items (Blockers for Development)

1. **Credit cost mapping table** - exact credit costs per action type
2. **Monthly plan tiers** - Free/Pro/Team credit amounts and pricing
3. **Chunking strategy** - specific token counts and overlap
4. **Clinical risk framework** - classification criteria
5. **HIPAA acknowledgment legal text** - requires legal review
6. **Workflow execution model** - fully automated vs. guided manual setup (architecture decision)
7. **PHI file retention policy** - immediate deletion vs. grace period (UX decision)
8. **3-5 concrete workflows** - detailed parameter lists for surgical specialties


