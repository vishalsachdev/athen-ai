# Git Hooks

This directory contains git hooks that can be installed to improve development workflow.

## Available Hooks

### pre-push
**Purpose:** Reminds you to update CHANGELOG.md before pushing code changes

**What it does:**
- Checks if you're pushing commits that changed files
- Verifies if CHANGELOG.md was updated in those commits
- If not, prompts you with a reminder and asks for confirmation
- Shows the list of changed files to help you decide

**When to update CHANGELOG:**
- You added or changed features
- You made architectural decisions
- You fixed important bugs
- You made breaking changes

**When it's OK to skip:**
- Typo fixes
- README updates
- Test-only changes
- Documentation improvements
- Dependency bumps with no functional changes

## Installation

### Option 1: Symlink (recommended)
This keeps hooks automatically in sync when they're updated:

```bash
# From repo root
ln -sf ../../.githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

### Option 2: Copy
Copy the hook to your local .git/hooks directory:

```bash
# From repo root
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

**Note:** If using copy method, you'll need to manually update when hooks change.

### Option 3: Configure Git to Use This Directory
Git 2.9+ supports setting a custom hooks directory:

```bash
git config core.hooksPath .githooks
```

This makes git use `.githooks/` for all hooks automatically.

## Verifying Installation

Test that the hook works:

```bash
# Make a change without updating CHANGELOG
echo "test" >> README.md
git add README.md
git commit -m "test: verify pre-push hook"
git push origin main  # Should trigger the reminder
```

You should see a yellow warning asking if you want to continue.

## Disabling Hooks Temporarily

If you need to bypass the hook for a specific push:

```bash
git push --no-verify origin main
```

**Use sparingly!** The hooks exist to help maintain project quality.

## Adding New Hooks

When creating new hooks:

1. Add the hook script to this directory (`.githooks/`)
2. Make it executable: `chmod +x .githooks/your-hook`
3. Document it in this README
4. Commit both the hook and documentation
5. Notify team members to reinstall hooks

---

**Last Updated:** 2024-12-30
