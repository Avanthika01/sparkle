# ✨ Sparkle

A sparkling todo app built with React, TypeScript, and Vite, featuring a complete CI/CD pipeline for automated deployment.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SPARKLE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         PRESENTATION LAYER                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  TodoInput  │  │  TodoList   │  │  TodoItem   │  │ TodoFilter  │  │   │
│  │  │             │  │             │  │             │  │             │  │   │
│  │  │ • Add todos │  │ • Renders   │  │ • Toggle    │  │ • Filter    │  │   │
│  │  │ • Form      │  │   todo list │  │ • Delete    │  │   controls  │  │   │
│  │  │   handling  │  │ • Empty     │  │ • Display   │  │ • Stats     │  │   │
│  │  │             │  │   state     │  │   status    │  │ • Clear     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           HOOKS LAYER                                 │   │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐    │   │
│  │  │         useTodos            │  │      useLocalStorage        │    │   │
│  │  │                             │  │                             │    │   │
│  │  │ • State management          │  │ • Persistence abstraction   │    │   │
│  │  │ • CRUD operations           │  │ • JSON serialization        │    │   │
│  │  │ • Filtering logic           │  │ • Error handling            │    │   │
│  │  │ • Statistics calculation    │  │                             │    │   │
│  │  └─────────────────────────────┘  └─────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         STORAGE LAYER                                 │   │
│  │                     ┌─────────────────┐                               │   │
│  │                     │  localStorage   │                               │   │
│  │                     │                 │                               │   │
│  │                     │ sparkle-todos   │                               │   │
│  │                     │ sparkle-filter  │                               │   │
│  │                     └─────────────────┘                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CI/CD PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Push/PR                                                                     │
│     │                                                                        │
│     ▼                                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Quality    │───▶│    Test &    │───▶│    Build     │                   │
│  │    Gate      │    │   Coverage   │    │              │                   │
│  │              │    │              │    │  • staging   │                   │
│  │ • typecheck  │    │ • vitest     │    │  • prod      │                   │
│  │ • eslint     │    │ • codecov    │    │              │                   │
│  │ • prettier   │    │              │    │              │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                │                             │
│                           ┌────────────────────┼────────────────────┐        │
│                           │                    │                    │        │
│                           ▼                    ▼                    ▼        │
│                    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│                    │   Deploy     │    │   Deploy     │    │  Enterprise  │ │
│                    │   Staging    │    │  Production  │    │ Distribution │ │
│                    │              │    │              │    │              │ │
│                    │ develop →    │    │ main →       │    │ • Package    │ │
│                    │ Vercel       │    │ Vercel       │    │ • Artifacts  │ │
│                    └──────────────┘    └──────────────┘    └──────────────┘ │
│                           │                    │                    │        │
│                           └────────────────────┴────────────────────┘        │
│                                          │                                   │
│                                          ▼                                   │
│                                   ┌──────────────┐                           │
│                                   │    Slack     │                           │
│                                   │ Notification │                           │
│                                   └──────────────┘                           │
│                                                                              │
│  Security (parallel):  Dependency Audit │ CodeQL Analysis │ Secrets Scan    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## Project Structure

```
sparkle/
├── src/
│   ├── components/        # React components
│   │   ├── TodoInput.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoFilter.tsx
│   │   └── __tests__/     # Component tests
│   ├── hooks/             # Custom React hooks
│   │   ├── useTodos.ts
│   │   ├── useLocalStorage.ts
│   │   └── __tests__/     # Hook tests
│   ├── types/             # TypeScript type definitions
│   ├── test/              # Test setup
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── .github/workflows/     # CI/CD pipelines
│   ├── ci.yml             # Main CI/CD workflow
│   └── security.yml       # Security scanning
├── scripts/               # Deployment scripts
│   ├── deploy.sh          # Manual deployment
│   └── setup-secrets.sh   # GitHub secrets setup
└── .env.*                 # Environment configs
```

## Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run build:staging` | Build for staging              |
| `npm run preview`       | Preview production build       |
| `npm run test`          | Run tests                      |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format code with Prettier      |
| `npm run typecheck`     | TypeScript type checking       |
| `npm run quality`       | Run all quality checks         |
| `npm run validate`      | Run quality checks + tests     |

## CI/CD Pipeline

### Main Workflow (ci.yml)

1. **Quality Gate**: TypeScript, ESLint, Prettier checks
2. **Test & Coverage**: Vitest tests with Codecov reporting
3. **Build**: Separate builds for staging and production
4. **Deploy**: Automatic deployment to Vercel
5. **Enterprise Distribution**: Package artifacts for internal CDN

### Security Workflow (security.yml)

- Dependency audit (npm audit)
- CodeQL static analysis
- Secrets scanning (TruffleHog, Gitleaks)
- Weekly scheduled scans

## Deployment

### Automatic Deployment

- **Staging**: Push to `develop` branch → deploys to staging
- **Production**: Push to `main` branch → deploys to production

### Manual Deployment

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# Dry run (see what would happen)
./scripts/deploy.sh staging --dry-run
```

### Setup GitHub Secrets

```bash
# Interactive setup
./scripts/setup-secrets.sh

# Check configured secrets
./scripts/setup-secrets.sh --check --repo owner/sparkle

# List required secrets
./scripts/setup-secrets.sh --list
```

#### Required Secrets

| Secret              | Description                 |
| ------------------- | --------------------------- |
| `VERCEL_TOKEN`      | Vercel deployment token     |
| `VERCEL_ORG_ID`     | Vercel organization ID      |
| `VERCEL_PROJECT_ID` | Vercel project ID           |
| `CODECOV_TOKEN`     | Codecov upload token        |
| `SLACK_WEBHOOK_URL` | Slack notifications webhook |

## Environment Configuration

| File               | Purpose                |
| ------------------ | ---------------------- |
| `.env.development` | Local development      |
| `.env.staging`     | Staging environment    |
| `.env.production`  | Production environment |

Environment variables:

- `VITE_API_URL` - Backend API URL
- `VITE_APP_TITLE` - Application title

## Testing

Tests are written with Vitest and React Testing Library, targeting 70%+ coverage.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Visual UI
npm run test:ui
```

## License

MIT
