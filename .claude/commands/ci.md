# CI

Run the full CI quality gate locally (same checks as GitHub Actions):

1. TypeScript type checking
2. ESLint linting
3. Prettier format check
4. Tests with coverage

```bash
npm run validate
```

If any check fails, fix the issues before committing. Individual checks:

- `npm run typecheck` - TypeScript only
- `npm run lint` - ESLint only (use `npm run lint:fix` to auto-fix)
- `npm run format:check` - Prettier only (use `npm run format` to auto-fix)
- `npm run test:coverage` - Tests only
