# Athen-AI Documentation

This directory contains all project documentation, organized for easy navigation.

## Directory Structure

```
docs/
├── planning/          # Brainstorming, ideation, and planning documents
├── specs/            # Product specifications and requirements
├── guides/           # Development guides and how-tos
└── reports/          # Testing reports, analysis, and audit results
```

## Current Documents

### Planning (`/planning`)
- **`idea-brainstorm.md`** - Original brainstorming session
  - Initial concept development
  - Problem space exploration
  - Feature ideas and possibilities

### Specifications (`/specs`)
- **`product-spec.md`** - Product specification document
  - MVP feature definitions
  - Requirements from Issue #2
  - Target outcomes and metrics
  - User workflows and use cases

### Reports (`/reports`)
- **`2024-12-30-testing-report.md`** - Comprehensive clinician UX testing
  - Browser testing results
  - Issues found (critical, priority, nice-to-have)
  - Technical observations
  - Implementation plans for fixes

### Guides (`/guides`)
- *(Empty - reserved for future developer guides)*
  - Contributing guidelines
  - Architecture deep-dives
  - Setup instructions
  - Best practices

## Root Documentation Files

Some key documentation remains in the project root for visibility:

- **`README.md`** - Main project README with quick start
- **`CHANGELOG.md`** - Development log of all changes and decisions
- **`CONTRIBUTING.md`** - Contribution guidelines
- **`.claude/CLAUDE.md`** - Project-specific AI assistant context

## Document Requirements

**All plans and reports MUST include metadata:**

```markdown
## Metadata

**Created:** YYYY-MM-DD HH:MM TZ
**Last Commit:** `commit-hash` - "commit message"
**Author:** Name or AI Agent
**Context:** Brief description

**How This Plan Was Generated:**
[Detailed methodology - how was this created?]
```

**Why this matters:**
- Tracks when the plan was made relative to code state
- Provides context on what existed before the plan
- Documents the process for future reference
- Helps understand assumptions and constraints

**Getting commit info:**
```bash
git log -1 --format="%H %s" --date=short
```

## Document Naming Conventions

### Reports
Use format: `YYYY-MM-DD-description.md`
- Example: `2024-12-30-testing-report.md`
- Example: `2025-01-15-security-audit.md`

### Specs
Use descriptive names with version if needed:
- `product-spec.md` - Current spec
- `product-spec-v2.md` - Major revision
- `api-spec.md` - API documentation
- `data-model-spec.md` - Data structure specification

### Planning
Use descriptive names:
- `idea-brainstorm.md` - Initial ideation
- `mvp-planning.md` - MVP scope definition
- `roadmap-q1-2025.md` - Quarterly roadmap

### Guides
Use descriptive, action-oriented names:
- `setup-development.md` - Local dev setup
- `deployment-guide.md` - Deployment instructions
- `testing-guide.md` - Testing best practices

## When to Create New Documents

### Create a new spec when:
- Defining a new major feature
- Documenting API contracts
- Specifying data models or schemas
- Defining user flows for complex features

### Create a new report when:
- Completing testing (UX, security, performance)
- Conducting code reviews or audits
- Analyzing metrics or usage data
- Documenting post-mortems

### Create a new planning doc when:
- Starting a new project phase
- Planning a major refactor
- Defining a roadmap
- Brainstorming solutions to problems

### Create a new guide when:
- Onboarding requires specific steps
- A pattern should be reused across the codebase
- Setup has multiple steps or gotchas
- Best practices need documentation

## Keeping Docs in Sync

**Source of truth:**
- For current features: `product-spec.md`
- For decisions made: `CHANGELOG.md` (root)
- For development history: Git commit messages
- For testing status: Latest report in `/reports`

**Update these when:**
- Adding features → Update spec, log in CHANGELOG
- Finding bugs → Create issue, may warrant report
- Making architectural changes → Update guides, log in CHANGELOG
- Completing testing → Create report, reference in CHANGELOG

## Related Files

- **`.claude/CLAUDE.md`** - Claude Code specific context
  - Project domain knowledge (healthcare, HIPAA)
  - Development standards
  - Compliance requirements
  - Links to key documents

---

**Last Updated:** 2024-12-30
