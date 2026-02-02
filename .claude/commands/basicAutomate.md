I want to build a CI/CD pipeline to demo in a mid-level job interview. I want to demonstrate deep understanding of AWS infrastructure.

## What I have
- A Node.js app with a Dockerfile (already created)
- AWS account (free tier)
- GitHub repository

## What I want to build
A pipeline where I click a manual button in GitHub Actions and my app gets deployed to AWS.

## Tools to use
- GitHub Actions (CI/CD)
- Docker (containerization)
- Terraform (infrastructure as code)
- AWS free tier only

## Constraints
- Must be free (use EC2 t2.micro, skip ECS and Load Balancer)
- Must use Infrastructure as Code (Terraform for all AWS resources)
- Must use OIDC for GitHub Actions to AWS authentication (no access keys)

## Architecture
GitHub Actions → Build Docker image → Push to ECR → Deploy to EC2

## What I need you to do
Guide me step by step through the entire setup. For each step:
1. Explain WHY we're doing it (so I can explain in interviews)
2. Show me the code/commands
3. Wait for me to confirm it worked before moving to the next step

## Steps to cover
1. Verify my Dockerfile works locally
2. Set up Terraform backend and provider
3. Create IAM OIDC identity provider for GitHub Actions (Terraform)
4. Create IAM role for GitHub Actions (Terraform)
5. Create ECR repository (Terraform)
6. Create EC2 instance with Docker installed (Terraform)
7. Create security groups and networking (Terraform)
8. Create GitHub Actions workflow with manual trigger
9. Test the full pipeline

Start with step 1.