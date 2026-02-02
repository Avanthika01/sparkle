# CD

Deploy the application manually using the deployment script.

## Deploy to staging

```bash
./scripts/deploy.sh staging
```

## Deploy to production

```bash
./scripts/deploy.sh production
```

## Dry run (preview without deploying)

```bash
./scripts/deploy.sh staging --dry-run
```

## Skip tests during deployment

```bash
./scripts/deploy.sh staging --skip-tests
```

## Prerequisites

Ensure GitHub secrets are configured:

```bash
./scripts/setup-secrets.sh --check
```

## Automatic deployment

- Push to `develop` branch → deploys to staging automatically
- Push to `main` branch → deploys to production automatically
