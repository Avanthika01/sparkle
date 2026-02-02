#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════════
# Sparkle Manual Deployment Script
# ═══════════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS] <environment>

Deploy Sparkle to the specified environment.

Environments:
    staging       Deploy to staging environment
    production    Deploy to production environment

Options:
    -h, --help        Show this help message
    -n, --dry-run     Show what would be done without deploying
    -s, --skip-tests  Skip running tests before deployment
    -v, --verbose     Enable verbose output

Examples:
    $(basename "$0") staging
    $(basename "$0") production --skip-tests
    $(basename "$0") staging --dry-run
EOF
}

# Default options
DRY_RUN=false
SKIP_TESTS=false
VERBOSE=false
ENVIRONMENT=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        staging|production)
            ENVIRONMENT=$1
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

if [[ -z "$ENVIRONMENT" ]]; then
    log_error "Environment is required"
    usage
    exit 1
fi

cd "$PROJECT_ROOT"

log_info "Starting deployment to $ENVIRONMENT"

# Check for required tools
check_requirements() {
    log_info "Checking requirements..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi

    if ! command -v vercel &> /dev/null; then
        log_warn "Vercel CLI not installed. Install with: npm i -g vercel"
        exit 1
    fi

    log_success "All requirements met"
}

# Run quality checks
run_quality_checks() {
    log_info "Running quality checks..."

    npm run typecheck
    log_success "TypeScript check passed"

    npm run lint
    log_success "ESLint check passed"

    npm run format:check
    log_success "Prettier check passed"
}

# Run tests
run_tests() {
    if [[ "$SKIP_TESTS" == true ]]; then
        log_warn "Skipping tests (--skip-tests flag)"
        return
    fi

    log_info "Running tests..."
    npm run test:coverage
    log_success "Tests passed"
}

# Build the application
build_app() {
    log_info "Building for $ENVIRONMENT..."

    if [[ "$ENVIRONMENT" == "staging" ]]; then
        npm run build:staging
    else
        npm run build:production
    fi

    log_success "Build complete"
}

# Deploy to Vercel
deploy() {
    log_info "Deploying to Vercel ($ENVIRONMENT)..."

    if [[ "$DRY_RUN" == true ]]; then
        log_warn "DRY RUN: Would deploy to $ENVIRONMENT"
        return
    fi

    if [[ "$ENVIRONMENT" == "production" ]]; then
        vercel --prod
    else
        vercel
    fi

    log_success "Deployment complete!"
}

# Main execution
main() {
    check_requirements

    log_info "Installing dependencies..."
    npm ci
    log_success "Dependencies installed"

    run_quality_checks
    run_tests
    build_app
    deploy

    echo ""
    log_success "🚀 Deployment to $ENVIRONMENT completed successfully!"
}

main
