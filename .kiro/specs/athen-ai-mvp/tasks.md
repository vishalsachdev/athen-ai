# Implementation Plan

- [-] 1. Project Setup and Infrastructure
- [x] 1.1 Initialize monorepo with frontend and backend workspaces
  - Create package.json with workspaces for frontend (React) and backend (Node.js)
  - Set up TypeScript configuration for both projects
  - Configure ESLint and Prettier for code quality
  - _Requirements: All requirements depend on proper project structure_

- [ ] 1.2 Set up PostgreSQL database with pgvector extension
  - Create database schema using Prisma migrations
  - Install and configure pgvector extension for vector similarity search
  - Set up connection pooling configuration
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 1.3 Configure AWS/GCP infrastructure
  - Set up S3/GCS bucket for temporary file storage with 24-hour lifecycle policy
  - Configure KMS for secret encryption
  - Set up Redis instance for session storage
  - Configure CloudWatch/Cloud Logging for observability
  - _Requirements: 15.3, 16.4_

- [ ] 1.4 Set up CI/CD pipeline with GitHub Actions
  - Create workflow for linting, type checking, and testing
  - Configure Docker image build and push to container registry
  - Set up staging and production deployment workflows
  - _Requirements: All requirements benefit from automated deployment_

- [ ] 2. Authentication and User Management
- [ ] 2.1 Implement user registration and login endpoints
  - Create User model and database schema
  - Implement password hashing with bcrypt (cost factor 12)
  - Create JWT token generation and validation middleware
  - Build registration endpoint with email validation
  - Build login endpoint with credential verification
  - _Requirements: 1.1, 15.5_


- [ ] 2.2 Implement email verification system
  - Create email verification token generation
  - Build email sending service using SendGrid/AWS SES
  - Create verify-email endpoint that marks accounts as verified
  - Implement middleware to block workflow execution for unverified users
  - _Requirements: 1.2, 1.4, 18.1_

- [ ] 2.3 Build onboarding wizard backend
  - Create OnboardingData model and schema
  - Build endpoint to capture legal name, role, specialty, and HIPAA acknowledgment
  - Validate ABMS specialty codes
  - Store HIPAA acknowledgment timestamp
  - _Requirements: 1.3_

- [ ] 2.4 Implement Google OAuth integration
  - Configure passport-google-oauth20 strategy
  - Create OAuth callback endpoint
  - Handle account creation or linking for OAuth users
  - _Requirements: 1.5_

- [ ] 2.5 Build authentication frontend components
  - Create LoginForm component with email/password inputs
  - Create RegisterForm component with validation
  - Build OnboardingWizard multi-step form component
  - Implement Google OAuth button and flow
  - Create email verification success page
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 3. LLM Service and Planner Wizard
- [ ] 3.1 Create LLM service abstraction layer
  - Build OpenAI API client wrapper with error handling
  - Implement retry logic with exponential backoff
  - Add request/response logging for debugging
  - Implement token counting and limit enforcement (max 4000 tokens)
  - _Requirements: 2.2, 8.2, 9.1, 11.2_

- [ ] 3.2 Implement Plan model and repository
  - Create Plan, PlanStep, and PlanMetadata schemas
  - Build CRUD operations for plans
  - Implement version control with parent-child relationships
  - Create diff generation using Myers algorithm
  - _Requirements: 2.4, 13.1, 13.2, 13.3_

- [ ] 3.3 Build Planner Wizard question flow
  - Define 7-10 wizard questions covering goal, specialty, PHI usage, budget, HIPAA/FDA compliance, team size, urgency, integrations
  - Create endpoint to retrieve wizard questions
  - Ensure HIPAA/FDA questions are always included
  - _Requirements: 2.1, 2.5_


- [ ] 3.4 Implement plan generation endpoint
  - Create prompt template for GPT-4 plan generation
  - Build endpoint that accepts wizard answers and generates structured plan
  - Parse LLM response into Plan model with steps, costs, time estimates, risks
  - Implement step regeneration for individual plan steps
  - _Requirements: 2.2_

- [ ] 3.5 Build plan editing capabilities
  - Create endpoints for inline step editing
  - Implement step reordering logic
  - Add step addition and removal functionality
  - Track edit history with diffs
  - _Requirements: 2.3_

- [ ] 3.6 Create Planner Wizard frontend
  - Build WizardFlow component with progress tracking
  - Create QuestionCard component for each question type (text, select, boolean, number)
  - Implement navigation (back/next buttons)
  - Add loading state during plan generation
  - Build PlanEditor component with drag-and-drop reordering
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Workflow Execution Engine
- [ ] 4.1 Implement Workflow model and state machine
  - Create Workflow and WorkflowExecution schemas
  - Build state transitions: planned → active → paused (with resume)
  - Create endpoints for workflow CRUD operations
  - Implement workflow status update logic
  - _Requirements: 3.1, 14.2, 14.3, 14.4_

- [ ] 4.2 Build dry-run simulation service
  - Create fake data generators for common workflow types
  - Implement cost estimation based on model pricing and token counts
  - Build dry-run endpoint that returns simulated outputs and credit estimates
  - _Requirements: 3.2_

- [ ] 4.3 Implement workflow execution orchestrator
  - Create step-by-step execution engine with user confirmation checkpoints
  - Build execution logging with detailed traces
  - Implement credit deduction at each step
  - Handle execution errors and rollback logic
  - _Requirements: 3.4, 3.5_

- [ ] 4.4 Create workflow parameter configuration
  - Build endpoint to capture model selection, form design, form fields, EMR link, additional agents
  - Validate required parameters based on workflow type
  - Store configuration in workflow config JSONB field
  - _Requirements: 3.3_


- [ ] 4.5 Build workflow frontend components
  - Create WorkflowList component showing status, last run, ownership
  - Build WorkflowDetail component with execution history
  - Create DryRunModal showing simulated outputs and cost estimates
  - Build ExecutionLog component with step-by-step progress
  - Implement pause/resume controls
  - _Requirements: 3.2, 3.4, 14.1, 14.3, 14.4, 14.5_

- [ ] 5. Provider Connection Management
- [ ] 5.1 Implement secret vault service
  - Create SecretReference model and schema
  - Build envelope encryption using KMS
  - Implement secret storage and retrieval with encryption
  - Add secret rotation support
  - _Requirements: 4.2, 15.3_

- [ ] 5.2 Build OpenAI connection flow
  - Create Connection model and schema
  - Implement API key entry and validation
  - Build connection test endpoint that validates auth, makes minimal API call, retrieves rate limits
  - Store encrypted API key in secret vault
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.3 Implement OAuth flow for Google (if time allows)
  - Configure OAuth client credentials
  - Build OAuth initiation and callback endpoints
  - Handle token exchange and storage
  - Implement token refresh logic
  - _Requirements: 4.1_

- [ ] 5.4 Create connection management endpoints
  - Build endpoints for listing user connections
  - Implement connection deletion with secret cleanup
  - Add support for multiple connections per provider
  - Implement personal vs org-level connection ownership
  - _Requirements: 4.4, 4.5_

- [ ] 5.5 Build connection frontend components
  - Create ConnectionList showing provider, status, last validated timestamp
  - Build ConnectionModal for API key entry with instructions
  - Implement connection test UI showing tier, limits, estimated costs
  - Add OAuth flow UI with pop-up or inline iframe
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 6. File Processing and Vectorization Pipeline
- [ ] 6.1 Implement file upload service
  - Create FileUpload model and schema
  - Build multipart file upload endpoint with size validation (max 50MB)
  - Support PDF, Word, Excel, JPG, PNG, HL7/FHIR formats
  - Require PHI flag on upload
  - Store files temporarily in encrypted S3/GCS bucket
  - _Requirements: 5.1, 5.5_


- [ ] 6.2 Build PHI redaction service
  - Implement regex patterns for HIPAA 18 identifiers (names, dates, IDs, SSN, MRN, phone, email, etc.)
  - Integrate spaCy NER model for name detection
  - Create redaction preview generation with before/after comparison
  - Build confidence scoring for redactions
  - _Requirements: 5.2_

- [ ] 6.3 Implement redaction approval workflow
  - Create endpoint to generate redaction preview
  - Build approve-redaction endpoint that triggers vectorization
  - Create reject-redaction endpoint that allows retry or deletion
  - _Requirements: 5.3, 5.4_

- [ ] 6.4 Build vectorization service
  - Implement text extraction from various file formats
  - Create chunking logic (512 tokens with 50 token overlap)
  - Integrate OpenAI text-embedding-ada-002 for embeddings
  - Replace patient identifiers with cryptographically random UUIDs
  - Store chunks and embeddings in VectorChunk table
  - Delete original file after successful vectorization
  - _Requirements: 5.3, 6.2, 6.3, 16.5_

- [ ] 6.5 Create file upload frontend components
  - Build FileUpload component with drag-and-drop
  - Add PHI flag checkbox with warning message
  - Create RedactionPreview component showing side-by-side comparison
  - Implement approve/reject buttons with retry options
  - Show vectorization progress indicator
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Vector Search and Knowledge Base
- [ ] 7.1 Implement vector search service
  - Create search query endpoint with text input
  - Generate query embeddings using OpenAI
  - Perform pgvector cosine similarity search
  - Default scope to user's own vectors
  - Support org-level search opt-in
  - _Requirements: 6.1, 6.5_

- [ ] 7.2 Build search ranking and filtering
  - Implement hybrid search combining vector similarity and keyword matching
  - Add metadata filtering (file IDs, date ranges)
  - Re-rank results by relevance
  - Limit results to top 20 chunks
  - _Requirements: 6.1_

- [ ] 7.3 Create vector search frontend
  - Build VectorSearch component with search input
  - Display search results with filename, similarity score, text snippet
  - Add filters for scope (user/org) and metadata
  - Implement result highlighting
  - _Requirements: 6.1_


- [ ] 8. Credit and Billing System
- [ ] 8.1 Implement credit account management
  - Create CreditAccount model and schema
  - Build endpoints for viewing credit balance and transactions
  - Implement auto-recharge configuration (threshold, amount)
  - _Requirements: 7.4, 7.5_

- [ ] 8.2 Build credit tracking service
  - Create CreditTransaction model for all credit operations
  - Implement atomic credit deduction with database transactions
  - Track credit consumption by operation type (LLM call, file upload, vectorization, workflow execution)
  - _Requirements: 7.1_

- [ ] 8.3 Implement cost estimation service
  - Build token counting for LLM requests
  - Calculate estimated credits based on model pricing
  - Create cost breakdown by component
  - Build estimation endpoint for workflow dry-runs
  - _Requirements: 7.2_

- [ ] 8.4 Integrate Stripe payment processing
  - Set up Stripe customer creation on user registration
  - Implement credit purchase endpoint
  - Build auto-recharge logic when balance < threshold
  - Create webhook handler for payment events
  - _Requirements: 7.3_

- [ ] 8.5 Build billing frontend components
  - Display credit balance on dashboard and in user settings
  - Create credit purchase modal with amount selection
  - Show usage analytics by action type and workflow
  - Display low balance warnings
  - Add auto-recharge configuration UI
  - _Requirements: 7.4, 7.5_

- [ ] 9. Clinical Note Drafting
- [ ] 9.1 Create clinical note templates
  - Define SOAP and H&P templates for plastic surgery, orthopedic, general surgery, neurosurgery, ENT
  - Build prompt templates with variable substitution
  - Store templates in database
  - _Requirements: 8.1_

- [ ] 9.2 Implement note generation service
  - Create ClinicalNote model and schema
  - Build endpoint that accepts patient record link and template selection
  - Generate note content using GPT-4 with specialty template
  - Implement RAG pattern for citations using vector search
  - Format citations as footnotes with URLs
  - _Requirements: 8.2, 8.3_

- [ ] 9.3 Build attestation service
  - Create attestation endpoint with signature capture
  - Store attestation timestamp and signature
  - Log attestation with user ID and note content
  - Track edits and overrides after attestation
  - _Requirements: 8.4, 8.5_


- [ ] 9.4 Create note drafting frontend
  - Build NoteDrafting component with specialty and template selection
  - Add patient record linking interface
  - Display generated note with citations
  - Create AttestationModal with signature canvas
  - Implement clipboard copy for EHR integration
  - Show edit tracking and diff view
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Patient Instructions Generation
- [ ] 10.1 Implement patient instructions service
  - Create PatientInstructions model and schema
  - Build generation endpoint with language selection (English/Spanish)
  - Implement reading level calculation using Flesch-Kincaid formula
  - Target 6th-8th grade reading level in prompts
  - Extract and surface contraindication warnings
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 10.2 Build review and approval workflow
  - Create review endpoint requiring explicit clinician approval
  - Log approval timestamp
  - Implement Spanish translation using OpenAI with medical terminology preservation
  - _Requirements: 9.4, 9.5_

- [ ] 10.3 Create patient instructions frontend
  - Build PatientInstructions component with language toggle
  - Display reading level indicator
  - Highlight contraindications prominently
  - Add review and approve buttons
  - Implement export to PDF
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 11. Prior Authorization Packet Builder
- [ ] 11.1 Implement prior auth service
  - Create PriorAuthPacket model and schema
  - Build checklist-driven data capture interface
  - Create insurance company template storage
  - Implement data import from uploaded files
  - _Requirements: 10.1, 10.2_

- [ ] 11.2 Build packet generation and export
  - Generate standard format packets per insurance company
  - Create PDF export functionality
  - Track submission, approval, denial, appeal status
  - Calculate turnaround time metrics
  - _Requirements: 10.3, 10.4, 10.5_

- [ ] 11.3 Create prior auth frontend
  - Build PriorAuthBuilder component with checklist UI
  - Add file attachment interface
  - Display insurance company requirements
  - Implement PDF preview and export
  - Show status tracking and metrics
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_


- [ ] 12. Assistant Support System
- [ ] 12.1 Implement assistant service
  - Create AssistantSession model with Redis storage
  - Build chat endpoint using GPT-3.5-turbo
  - Create system prompt focused on platform features and navigation
  - Implement session-only storage with 24-hour TTL
  - Clear conversation history on logout
  - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [ ] 12.2 Create assistant frontend
  - Build AssistantPanel component with chat interface
  - Implement message history display
  - Add typing indicators and loading states
  - Create collapsible side panel
  - _Requirements: 11.1, 11.2_

- [ ] 13. Dashboard and Analytics
- [ ] 13.1 Implement metrics service
  - Create event tracking for user actions
  - Build aggregation queries for plans created, active workflows, credit balance
  - Implement timeframe filtering (day, week, month, all)
  - Calculate metrics from database queries (no caching)
  - _Requirements: 12.1, 12.2, 12.4_

- [ ] 13.2 Build dashboard frontend
  - Create Dashboard component with metric cards
  - Display plans created, active workflows, credit balance
  - Implement timeframe selector
  - Add deep links from cards to detail views
  - _Requirements: 12.1, 12.3, 12.4, 12.5_

- [ ] 14. Audit Logging and Security
- [ ] 14.1 Implement audit logging middleware
  - Create AuditLog model with append-only schema
  - Build middleware to automatically log PHI-related operations
  - Capture actor ID, action, target type/ID, IP address, user agent, timestamp
  - Store metadata as JSONB
  - _Requirements: 15.1_

- [ ] 14.2 Build anomaly detection service
  - Implement IP geolocation for location-based detection
  - Create rules for unusual location, high-volume downloads, external share attempts
  - Build AnomalyAlert model and storage
  - Trigger email notifications for anomalies
  - _Requirements: 15.4, 18.5_

- [ ] 14.3 Implement RBAC enforcement
  - Create authorization middleware for role-based access control
  - Implement least-privilege by default
  - Add row-level security policies in PostgreSQL
  - Enforce user ID filtering in all queries
  - _Requirements: 15.5_


- [ ] 14.4 Build audit log viewing interface (admin only)
  - Create admin-only audit log endpoint with filtering
  - Display audit logs with search and filter capabilities
  - Show anomaly alerts with severity indicators
  - _Requirements: 15.1, 15.2_

- [ ] 15. Tool Catalog
- [ ] 15.1 Create tool catalog data model
  - Create Tool model and schema
  - Seed database with initial tool data (OpenAI, Google if included)
  - Include compliance tags, pricing, setup complexity, auth type
  - _Requirements: 17.1_

- [ ] 15.2 Build catalog endpoints
  - Create endpoint for browsing tools with filtering
  - Implement AND logic for multiple filters
  - Build tool detail endpoint
  - Add pre-population logic for planner wizard
  - _Requirements: 17.2, 17.3, 17.4, 17.5_

- [ ] 15.3 Create catalog frontend
  - Build tool browsing interface with cards
  - Implement filters for compliance, pricing, category, complexity
  - Create tool detail view with setup guide
  - Add "Use in Planner" button that pre-fills wizard
  - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 16. Email Notification System
- [ ] 16.1 Implement email service
  - Configure SendGrid or AWS SES
  - Create email templates for verification, workflow completion, token expiration, low balance, anomaly alerts
  - Build email sending service with retry logic
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 16.2 Integrate email triggers
  - Send verification email on registration
  - Send workflow completion notifications
  - Send token expiration reminders
  - Send low balance warnings at 100 credits
  - Send anomaly alert emails
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 17. Data Retention and Privacy
- [ ] 17.1 Implement data deletion endpoints
  - Create endpoints for deleting files and vector chunks
  - Implement cascade deletion for related records
  - Add audit log entries for all deletions
  - _Requirements: 16.2_

- [ ] 17.2 Configure temporary storage lifecycle
  - Set up S3/GCS lifecycle policy to delete files after 24 hours
  - Ensure original PHI files are deleted immediately after vectorization
  - Verify no PHI in persistent storage
  - _Requirements: 16.3, 16.4, 16.5_


- [ ] 18. API Security and Rate Limiting
- [ ] 18.1 Implement rate limiting middleware
  - Configure rate limits: 100 req/min general, 10 req/min LLM endpoints, 5 req/min file uploads
  - Return 429 Too Many Requests with Retry-After header
  - Use Redis for distributed rate limiting
  - _Requirements: 15.5_

- [ ] 18.2 Add input validation and sanitization
  - Implement request body size limit (10MB)
  - Add file upload size limit (50MB)
  - Create validation schemas for all endpoints
  - Sanitize inputs to prevent XSS
  - _Requirements: 15.5_

- [ ] 18.3 Configure CORS and CSRF protection
  - Set up CORS policy whitelisting frontend domain
  - Implement double-submit cookie pattern for CSRF
  - Add SameSite=Strict cookie attribute
  - _Requirements: 15.5_

- [ ] 19. Frontend Layout and Navigation
- [ ] 19.1 Create shared layout components
  - Build Layout component with navbar and sidebar
  - Create Navbar with user menu and credit balance display
  - Implement responsive navigation
  - Add notification toast system
  - _Requirements: All frontend requirements_

- [ ] 19.2 Set up routing and navigation
  - Configure React Router with protected routes
  - Implement authentication guards
  - Create navigation menu with dashboard, plans, workflows, connections, files, clinical features
  - Add breadcrumb navigation
  - _Requirements: All frontend requirements_

- [ ] 20. Error Handling and User Feedback
- [ ] 20.1 Implement global error handling
  - Create error boundary components for React
  - Build standardized error response format
  - Implement user-friendly error messages
  - Add error logging to monitoring service
  - _Requirements: All requirements benefit from proper error handling_

- [ ] 20.2 Add loading states and progress indicators
  - Create loading spinners for async operations
  - Add progress bars for file uploads and vectorization
  - Implement skeleton screens for data loading
  - Show workflow execution progress
  - _Requirements: All frontend requirements_

- [ ] 21. Performance Optimization
- [ ] 21.1 Implement frontend optimizations
  - Add code splitting with React.lazy for routes
  - Implement virtual scrolling for long lists
  - Add image lazy loading
  - Configure asset compression (gzip/brotli)
  - _Requirements: All frontend requirements benefit from performance_


- [ ] 21.2 Implement backend optimizations
  - Add database indexes on frequently queried columns
  - Configure connection pooling (max 20 connections)
  - Implement Redis caching for user profiles and tool catalog
  - Add response pagination (default 20 items, max 100)
  - _Requirements: All backend requirements benefit from performance_

- [ ] 21.3 Optimize LLM calls
  - Implement streaming responses for long-running calls
  - Add token limit enforcement (max 4000 tokens)
  - Use GPT-3.5-turbo for assistant queries
  - Cache common assistant responses
  - _Requirements: 2.2, 11.2_

- [ ] 22. Monitoring and Observability
- [ ] 22.1 Set up application monitoring
  - Configure CloudWatch/Cloud Monitoring metrics
  - Create custom metrics for plan creation rate, workflow execution time, credit consumption
  - Set up alarms for error rate > 1%, p95 latency > 1s
  - _Requirements: All requirements benefit from monitoring_

- [ ] 22.2 Implement structured logging
  - Add correlation IDs to all requests
  - Create structured JSON logs with log levels
  - Configure centralized logging
  - Set retention: 90 days for app logs, indefinite for audit logs
  - _Requirements: 15.2_

- [ ] 22.3 Configure distributed tracing
  - Set up AWS X-Ray or Cloud Trace
  - Trace LLM API calls, database queries, external services
  - Identify performance bottlenecks
  - _Requirements: All requirements benefit from tracing_

- [ ] 23. Documentation and Developer Experience
- [ ] 23.1 Create API documentation
  - Document all REST endpoints with request/response examples
  - Add authentication requirements
  - Include error codes and messages
  - Create Postman collection for testing
  - _Requirements: All API requirements_

- [ ]* 23.2 Write developer setup guide
  - Document local development environment setup
  - Include database setup and seeding instructions
  - Add instructions for running tests
  - Document environment variables and configuration
  - _Requirements: All requirements_

- [ ]* 23.3 Create user documentation
  - Write user guide for onboarding and first plan creation
  - Document clinical features (note drafting, patient instructions, prior auth)
  - Create troubleshooting guide
  - Add FAQ section
  - _Requirements: All user-facing requirements_


- [ ] 24. Testing and Quality Assurance
- [ ]* 24.1 Write unit tests for core services
  - Test RedactionService for HIPAA identifier detection
  - Test VectorizationService chunking and embedding
  - Test CreditTracker calculations
  - Test AuthMiddleware JWT validation and RBAC
  - Test CostEstimator accuracy
  - Target 80% coverage for services
  - _Requirements: 5.2, 6.2, 7.1, 15.5_

- [ ]* 24.2 Write integration tests for critical flows
  - Test end-to-end user registration and onboarding
  - Test plan creation → workflow activation → execution
  - Test file upload → redaction → vectorization → search
  - Test connection creation → test → usage in workflow
  - Test credit deduction → low balance → auto-recharge
  - _Requirements: 1.1, 2.2, 3.1, 4.1, 5.1, 7.3_

- [ ]* 24.3 Perform security testing
  - Test PHI redaction accuracy with synthetic data
  - Verify no PHI in logs or error messages
  - Validate audit log completeness
  - Test JWT token expiration and refresh
  - Test RBAC permission enforcement
  - _Requirements: 5.2, 15.1, 15.3, 15.5_

- [ ]* 24.4 Conduct performance testing
  - Load test with 100 concurrent users creating plans
  - Test 50 concurrent file uploads and vectorizations
  - Test 1000 vector searches per minute
  - Validate p95 API response time < 500ms
  - _Requirements: All requirements benefit from performance validation_

- [ ]* 24.5 Run end-to-end tests
  - Test new clinician onboarding → first plan → workflow execution
  - Test file upload with PHI → redaction → use in note drafting
  - Test connection setup → workflow config → dry-run → execution
  - Test credit purchase → workflow execution → low balance warning
  - Test across Chrome, Firefox, Safari, Edge
  - _Requirements: All user journey requirements_

- [ ] 25. Deployment and Launch Preparation
- [ ] 25.1 Set up production environment
  - Provision production database with backups
  - Configure production Redis cluster
  - Set up production S3/GCS bucket with encryption
  - Configure production KMS keys
  - _Requirements: All requirements depend on production infrastructure_

- [ ] 25.2 Establish BAAs with vendors
  - Sign BAA with OpenAI
  - Sign BAA with hosting provider (AWS/GCP)
  - Sign BAA with email service provider
  - Document BAA compliance
  - _Requirements: 15.3, 16.3_


- [ ] 25.3 Configure production monitoring and alerts
  - Set up PagerDuty or Opsgenie for on-call
  - Configure critical alerts (database down, payment failure, PHI exposure risk)
  - Set up warning alerts (high error rate, slow response times)
  - Test alert delivery
  - _Requirements: All requirements benefit from production monitoring_

- [ ] 25.4 Perform final security audit
  - Review all endpoints for authentication and authorization
  - Verify encryption at rest and in transit
  - Check for PHI leakage in logs and error messages
  - Validate HIPAA compliance measures
  - _Requirements: 15.1, 15.3, 15.4, 15.5, 16.3_

- [ ] 25.5 Deploy to production and verify
  - Deploy backend API to production
  - Deploy frontend to production CDN
  - Run smoke tests on production
  - Verify all integrations (OpenAI, Stripe, email)
  - Monitor for errors and performance issues
  - _Requirements: All requirements_

- [ ] 26. Limited Beta Launch
- [ ] 26.1 Prepare beta user onboarding
  - Create beta invitation email template
  - Set up beta user tracking
  - Prepare onboarding materials and guides
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 26.2 Onboard initial beta users (10-20 clinicians)
  - Send beta invitations to surgical subspecialty clinicians
  - Provide onboarding support
  - Monitor usage and gather feedback
  - Track key metrics (TTFP, TTFC, workflow activations)
  - _Requirements: All requirements_

- [ ] 26.3 Iterate based on beta feedback
  - Collect user feedback on UX pain points
  - Identify and fix critical bugs
  - Validate credit pricing model
  - Optimize performance based on real usage
  - _Requirements: All requirements_
