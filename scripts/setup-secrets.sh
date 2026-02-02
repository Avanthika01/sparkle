#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════════
# Sparkle GitHub Secrets Setup Script
# ═══════════════════════════════════════════════════════════════════════════════

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_header() { echo -e "\n${CYAN}═══ $1 ═══${NC}\n"; }

usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Configure GitHub repository secrets for Sparkle CI/CD pipeline.

Options:
    -h, --help        Show this help message
    -r, --repo        GitHub repository (format: owner/repo)
    -l, --list        List required secrets without setting them
    -c, --check       Check which secrets are already configured

Prerequisites:
    - GitHub CLI (gh) installed and authenticated
    - Write access to the repository

Required Secrets:
    VERCEL_TOKEN          Vercel deployment token
    VERCEL_ORG_ID         Vercel organization ID
    VERCEL_PROJECT_ID     Vercel project ID
    CODECOV_TOKEN         Codecov upload token
    SLACK_WEBHOOK_URL     Slack incoming webhook URL

Optional Secrets:
    ENTERPRISE_CDN_ENDPOINT    Enterprise CDN upload endpoint
    ENTERPRISE_CDN_TOKEN       Enterprise CDN authentication token

Example:
    $(basename "$0") --repo myorg/sparkle
    $(basename "$0") --check --repo myorg/sparkle
EOF
}

# Required secrets
REQUIRED_SECRETS=(
    "VERCEL_TOKEN:Vercel deployment token (from vercel.com/account/tokens)"
    "VERCEL_ORG_ID:Vercel organization ID (from project settings)"
    "VERCEL_PROJECT_ID:Vercel project ID (from project settings)"
    "CODECOV_TOKEN:Codecov upload token (from codecov.io)"
    "SLACK_WEBHOOK_URL:Slack incoming webhook URL"
)

OPTIONAL_SECRETS=(
    "ENTERPRISE_CDN_ENDPOINT:Enterprise CDN upload endpoint"
    "ENTERPRISE_CDN_TOKEN:Enterprise CDN authentication token"
)

REPO=""
LIST_ONLY=false
CHECK_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -r|--repo)
            REPO="$2"
            shift 2
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -c|--check)
            CHECK_ONLY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Check for GitHub CLI
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed"
        echo "Install it from: https://cli.github.com/"
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated"
        echo "Run: gh auth login"
        exit 1
    fi
}

# Get repository if not provided
get_repo() {
    if [[ -z "$REPO" ]]; then
        if git remote get-url origin &> /dev/null; then
            REPO=$(git remote get-url origin | sed -E 's/.*[:/]([^/]+\/[^/]+)(\.git)?$/\1/')
            log_info "Detected repository: $REPO"
        else
            log_error "Could not detect repository. Use --repo option."
            exit 1
        fi
    fi
}

# List all secrets
list_secrets() {
    log_header "Required Secrets"
    for secret in "${REQUIRED_SECRETS[@]}"; do
        name="${secret%%:*}"
        desc="${secret#*:}"
        echo -e "  ${GREEN}$name${NC}"
        echo -e "    $desc"
    done

    log_header "Optional Secrets"
    for secret in "${OPTIONAL_SECRETS[@]}"; do
        name="${secret%%:*}"
        desc="${secret#*:}"
        echo -e "  ${YELLOW}$name${NC}"
        echo -e "    $desc"
    done
}

# Check existing secrets
check_secrets() {
    log_header "Checking Secrets for $REPO"

    existing=$(gh secret list --repo "$REPO" 2>/dev/null | awk '{print $1}' || echo "")

    echo "Required secrets:"
    for secret in "${REQUIRED_SECRETS[@]}"; do
        name="${secret%%:*}"
        if echo "$existing" | grep -q "^$name$"; then
            echo -e "  ${GREEN}✓${NC} $name"
        else
            echo -e "  ${RED}✗${NC} $name (missing)"
        fi
    done

    echo ""
    echo "Optional secrets:"
    for secret in "${OPTIONAL_SECRETS[@]}"; do
        name="${secret%%:*}"
        if echo "$existing" | grep -q "^$name$"; then
            echo -e "  ${GREEN}✓${NC} $name"
        else
            echo -e "  ${YELLOW}○${NC} $name (not set)"
        fi
    done
}

# Set a secret
set_secret() {
    local name="$1"
    local desc="$2"
    local required="$3"

    echo ""
    if [[ "$required" == "true" ]]; then
        echo -e "${GREEN}$name${NC} (required)"
    else
        echo -e "${YELLOW}$name${NC} (optional)"
    fi
    echo "  $desc"

    read -rp "Enter value (or press Enter to skip): " value

    if [[ -n "$value" ]]; then
        echo "$value" | gh secret set "$name" --repo "$REPO"
        log_success "Set $name"
    else
        if [[ "$required" == "true" ]]; then
            log_warn "Skipped $name (required - you'll need to set this later)"
        else
            log_info "Skipped $name"
        fi
    fi
}

# Configure all secrets
configure_secrets() {
    log_header "Configuring Secrets for $REPO"

    echo "You will be prompted to enter each secret value."
    echo "Press Enter to skip any secret."
    echo ""

    for secret in "${REQUIRED_SECRETS[@]}"; do
        name="${secret%%:*}"
        desc="${secret#*:}"
        set_secret "$name" "$desc" "true"
    done

    echo ""
    read -rp "Configure optional secrets? (y/N): " configure_optional

    if [[ "$configure_optional" =~ ^[Yy]$ ]]; then
        for secret in "${OPTIONAL_SECRETS[@]}"; do
            name="${secret%%:*}"
            desc="${secret#*:}"
            set_secret "$name" "$desc" "false"
        done
    fi

    log_header "Setup Complete"
    log_info "Run '$(basename "$0") --check --repo $REPO' to verify configuration"
}

# GitHub Actions Variables (not secrets)
configure_variables() {
    log_header "Configuring Repository Variables"

    echo "These are non-sensitive configuration values."
    echo ""

    read -rp "Staging API URL (or Enter to skip): " staging_api
    if [[ -n "$staging_api" ]]; then
        gh variable set STAGING_API_URL --repo "$REPO" --body "$staging_api"
        log_success "Set STAGING_API_URL"
    fi

    read -rp "Production API URL (or Enter to skip): " prod_api
    if [[ -n "$prod_api" ]]; then
        gh variable set PRODUCTION_API_URL --repo "$REPO" --body "$prod_api"
        log_success "Set PRODUCTION_API_URL"
    fi
}

# Main execution
main() {
    check_gh_cli

    if [[ "$LIST_ONLY" == true ]]; then
        list_secrets
        exit 0
    fi

    get_repo

    if [[ "$CHECK_ONLY" == true ]]; then
        check_secrets
        exit 0
    fi

    configure_secrets

    read -rp "Configure repository variables? (y/N): " configure_vars
    if [[ "$configure_vars" =~ ^[Yy]$ ]]; then
        configure_variables
    fi

    echo ""
    log_success "🔐 Secret configuration complete!"
}

main
