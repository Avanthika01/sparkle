# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev              # Start Vite dev server
npm run build            # Production build (typecheck + vite build)
npm run build:staging    # Build with staging env
npm run build:production # Build with production env
npm run preview          # Preview production build locally
```

## Testing Commands

```bash
npm test                 # Run all tests once
npm run test:watch       # Watch mode
npm run test:coverage    # Tests with coverage report (must meet 70% threshold)
npm run test:ui          # Visual test UI

# Run a single test file
npm test src/hooks/__tests__/useTodos.test.ts

# Run tests matching a pattern
npm test -- -t "should add a new todo"
```

Test files use `*.test.ts` or `*.spec.ts` naming in `__tests__/` directories.

## Quality Commands

```bash
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint (fix with lint:fix)
npm run format:check     # Prettier check (fix with format)
npm run quality          # All quality checks (typecheck + lint + format)
npm run validate         # Quality + tests with coverage
```

## Architecture

React + TypeScript + Vite todo app with localStorage persistence. Uses `@/` path alias for src imports (e.g., `import { useTodos } from '@/hooks/useTodos'`).

**Component hierarchy:**

- `App.tsx` → orchestrates all components via `useTodos` hook
- `TodoInput` → form for adding todos
- `TodoList` → renders list of `TodoItem` components
- `TodoItem` → individual todo with toggle/delete
- `TodoFilter` → filter buttons (all/active/completed) + stats

**Custom hooks:**

- `useTodos` (src/hooks/useTodos.ts) → all todo state and operations, uses `useLocalStorage` internally
- `useLocalStorage` (src/hooks/useLocalStorage.ts) → generic localStorage persistence hook

**State keys in localStorage:** `sparkle-todos`, `sparkle-filter`

## CI/CD Pipeline

Two GitHub Actions workflows in `.github/workflows/`:

1. **ci.yml** - Main pipeline: quality gate → test with Codecov → build → deploy to Vercel → enterprise packaging → Slack notifications
2. **security.yml** - Security scans: npm audit, CodeQL, TruffleHog, Gitleaks

**Branch deployment:** `develop` → staging, `main` → production

## Environment Files

- `.env.development` - local dev
- `.env.staging` - staging builds
- `.env.production` - production builds

Variables: `VITE_API_URL`, `VITE_APP_TITLE`

## Deployment Scripts

```bash
./scripts/deploy.sh staging          # Manual deploy to staging
./scripts/deploy.sh production       # Manual deploy to production
./scripts/setup-secrets.sh --list    # List required GitHub secrets
./scripts/setup-secrets.sh --check   # Check which secrets are configured
```
