# Contributing to Athen AI

## Development Workflow

### Code Quality Standards

All code must pass the following checks before being committed:

1. **Type Checking**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Formatting**: `npm run format:check`
4. **Tests**: `npm test`

### Commit Guidelines

- Write clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on a single change

### Code Style

- Use TypeScript for all new code
- Follow the ESLint and Prettier configurations
- Write tests for new features
- Document complex logic with comments

### Testing

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for 80% code coverage

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run all quality checks
4. Submit a pull request with a clear description
5. Address review feedback
6. Merge after approval

## Project Structure

### Backend (`packages/backend`)

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── middleware/     # Express middleware
├── routes/         # API route definitions
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── index.ts        # Application entry point
```

### Frontend (`packages/frontend`)

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # API client services
├── stores/         # Zustand state stores
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── App.tsx         # Root component
└── main.tsx        # Application entry point
```

## Development Tips

### Running Individual Workspaces

```bash
# Backend only
npm run dev -w @athen-ai/backend

# Frontend only
npm run dev -w @athen-ai/frontend
```

### Debugging

- Backend: Use `console.log` or attach a debugger to the Node process
- Frontend: Use browser DevTools and React DevTools extension

### Environment Variables

- Never commit `.env` files
- Update `.env.example` when adding new variables
- Document all environment variables in the README

## Getting Help

- Check the design document: `.kiro/specs/athen-ai-mvp/design.md`
- Check the requirements: `.kiro/specs/athen-ai-mvp/requirements.md`
- Review the implementation tasks: `.kiro/specs/athen-ai-mvp/tasks.md`
