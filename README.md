# athen-ai

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
