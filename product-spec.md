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
- **Tool Connection (Connections)**: Pick provider → OAuth/API key flow → store secret securely → show tier/limits → test connection.
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
- **Acceptance**: “Test connection” validates minimal scope and lists available features/limits.

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

### MVP Scope (4–6 weeks)
- Dashboard (basic metrics)
- Planner (core flow)
- Catalog (browse, detail)
- My Plans (CRUD, privacy)
- Connections (OpenAI + one additional provider)
- File Upload (basic) → redaction preview → embeddings
- KB search in assistant
- Community (browse/import)
- Auth + onboarding
- Audit logs (admin-readable)
- HIPAA storage choices and encryption

### Clinician MVP Acceptance Criteria
- **Note drafting**: Specialty templates (SOAP/H&P); tone and language controls; ≤2 clicks to insert via smart phrase/side panel; diffs tracked; citations included when external sources used; clinician attestation required before saving; edits and overrides logged.
- **Patient instructions**: Output at 6th–8th grade reading level; multilingual support; contraindication warnings surfaced; explicit clinician review required.
- **Prior authorization packet**: Checklist-driven data capture; attachment/packet builder; exportable packet (PDF); track turnaround time, approvals, appeals, and denials avoided.
- **Uploads & de-identification**: PHI flag mandatory; de-ID preview must be approved by clinician before sharing; provenance ledger updated on approval; storage remains within HIPAA boundary.
- **Connections**: OAuth/BYO keys; scopes disclosed and logged; successful "Test connection" flow required; no payment information stored by the platform.
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

### Open Questions
- **Billing model**: per-seat vs usage vs hybrid? Org-level vs personal?
- **Public exposure**: index public plans externally or in-app only?
- **PHI defaults**: allow non-PHI mode with lighter flows?
- **EHR scope**: which EHR sandbox first (Epic vs Cerner) and intended flows?
- **Assistant autonomy**: read-only suggestions vs click-to-run actions in MVP?


